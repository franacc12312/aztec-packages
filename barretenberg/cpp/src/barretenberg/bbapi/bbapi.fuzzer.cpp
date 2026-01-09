/**
 * @file bbapi.fuzzer.cpp
 * @brief LibFuzzer harness for the BB API (Barretenberg API)
 *
 * This fuzzer targets memory safety issues in the bbapi by exercising:
 * 1. Msgpack command deserialization - parsing arbitrary bytes as bbapi commands
 * 2. ACIR bytecode parsing - parsing circuit bytecode in msgpack-compact format
 * 3. Witness file parsing - parsing witness data
 * 4. Proof verification inputs - testing verification with corrupted/malformed data
 * 5. Chonk IVC command sequences - testing stateful IVC operations
 *
 * Run with ASAN to detect memory corruption, buffer overflows, use-after-free, etc.
 */

#include "barretenberg/bbapi/bbapi_execute.hpp"
#include "barretenberg/bbapi/bbapi_shared.hpp"
#include "barretenberg/dsl/acir_format/acir_format.hpp"
#include "barretenberg/dsl/acir_format/acir_to_constraint_buf.hpp"
#include "barretenberg/ecc/curves/bn254/bn254.hpp"
#include "barretenberg/ecc/curves/grumpkin/grumpkin.hpp"
#include "barretenberg/numeric/uint256/uint256.hpp"
#include "barretenberg/serialize/msgpack_impl.hpp"

#include <algorithm>
#include <cstdint>
#include <cstring>
#include <random>
#include <vector>

namespace {

// Type aliases to avoid ambiguity with bb::stdlib
using AesEncrypt = bb::bbapi::AesEncrypt;
using BBApiRequest = bb::bbapi::BBApiRequest;
using Blake2s = bb::bbapi::Blake2s;
using Bn254FrSqrt = bb::bbapi::Bn254FrSqrt;
using Bn254G1Mul = bb::bbapi::Bn254G1Mul;
using ChonkAccumulate = bb::bbapi::ChonkAccumulate;
using ChonkLoad = bb::bbapi::ChonkLoad;
using ChonkProve = bb::bbapi::ChonkProve;
using ChonkStart = bb::bbapi::ChonkStart;
using CircuitInput = bb::bbapi::CircuitInput;
using CircuitProve = bb::bbapi::CircuitProve;
using CircuitVerify = bb::bbapi::CircuitVerify;
using Command = bb::bbapi::Command;
using GrumpkinMul = bb::bbapi::GrumpkinMul;
using MegaVkAsFields = bb::bbapi::MegaVkAsFields;
using PedersenHash = bb::bbapi::PedersenHash;
using Poseidon2Hash_ = bb::bbapi::Poseidon2Hash;
using Poseidon2Permutation_ = bb::bbapi::Poseidon2Permutation;
using ProofSystemSettings = bb::bbapi::ProofSystemSettings;
using VkAsFields = bb::bbapi::VkAsFields;

inline auto execute_command(BBApiRequest& r, Command&& c) { return bb::bbapi::execute(r, std::move(c)); }

using fr = bb::fr;
using fq = bb::fq;
using g1 = bb::g1;
using uint256_t = bb::numeric::uint256_t;

// acir_format functions
inline auto circuit_buf_to_acir_format(std::vector<uint8_t>&& b) { return acir_format::circuit_buf_to_acir_format(std::move(b)); }
inline auto witness_buf_to_witness_vector(std::vector<uint8_t>&& b) { return acir_format::witness_buf_to_witness_vector(std::move(b)); }

// LibFuzzer mutation function
extern "C" size_t LLVMFuzzerMutate(uint8_t* Data, size_t Size, size_t MaxSize);

/**
 * @brief Simple deterministic PRNG for fuzzing
 */
class FastRandom {
    uint32_t state;

  public:
    explicit FastRandom(uint32_t seed)
    {
        if (seed == 0) {
            seed = 1;
        }
        state = seed;
    }

    uint32_t next()
    {
        state = static_cast<uint32_t>(
            (static_cast<uint64_t>(state) * static_cast<uint64_t>(363364578) + static_cast<uint64_t>(537)) %
            static_cast<uint64_t>(3758096939));
        return state;
    }
};

/**
 * @brief Read uint256_t from raw bytes (handles unaligned access)
 */
uint256_t read_uint256(const uint8_t* data, size_t buffer_size = 32)
{
    if (buffer_size > 32) {
        buffer_size = 32;
    }

    uint64_t parts[4] = { 0, 0, 0, 0 };
    for (size_t i = 0; i < (buffer_size + 7) / 8; i++) {
        size_t to_read = (buffer_size - (i * 8)) < 8 ? buffer_size - (i * 8) : 8;
        std::memcpy(&parts[i], data + (i * 8), to_read);
    }
    return uint256_t(parts[0], parts[1], parts[2], parts[3]);
}

/**
 * @brief Mutate a field element for fuzzing
 */
template <typename FF> FF mutate_field_element(FF e, FastRandom& rng)
{
    const size_t choice = rng.next() % 4;

    if (choice < 2) {
        // Delegate mutation to libfuzzer
        uint256_t value_data = uint256_t(e);
        // NOLINTNEXTLINE(cppcoreguidelines-pro-type-reinterpret-cast)
        LLVMFuzzerMutate(reinterpret_cast<uint8_t*>(&value_data), sizeof(uint256_t), sizeof(uint256_t));
        return FF(value_data);
    }
    if (choice < 3) {
        // Small addition/subtraction
        if (rng.next() & 1) {
            e += FF(rng.next() & 0xff);
        } else {
            e -= FF(rng.next() & 0xff);
        }
        return e;
    }
    // Special values
    switch (rng.next() % 6) {
    case 0:
        return FF::zero();
    case 1:
        return FF::one();
    case 2:
        return -FF::one();
    case 3:
        return FF(2);
    case 4:
        return FF((FF::modulus - 1) / 2);
    default:
        return e;
    }
}

/**
 * @brief Fuzzer mode selection based on first byte of input
 */
enum class FuzzerMode : uint8_t {
    MSGPACK_COMMAND = 0,     // Fuzz msgpack command deserialization
    ACIR_BYTECODE = 1,       // Fuzz ACIR bytecode parsing
    WITNESS_DATA = 2,        // Fuzz witness file parsing
    CIRCUIT_PROVE = 3,       // Fuzz circuit prove command
    CIRCUIT_VERIFY = 4,      // Fuzz verification with malformed inputs
    CHONK_SEQUENCE = 5,      // Fuzz Chonk IVC command sequence
    CRYPTO_COMMANDS = 6,     // Fuzz cryptographic primitive commands
    VK_PARSING = 7,          // Fuzz verification key parsing
};

/**
 * @brief Attempt to deserialize and execute a msgpack-encoded bbapi command
 *
 * This tests the robustness of msgpack deserialization and command dispatch
 * against malformed/corrupted input data.
 */
bool fuzz_msgpack_command(const uint8_t* data, size_t size)
{
    if (size < 2) {
        return false;
    }

    try {
        // Attempt to deserialize as a Command
        msgpack::object_handle oh = msgpack::unpack(reinterpret_cast<const char*>(data), size);
        msgpack::object obj = oh.get();

        Command cmd;
        obj.convert(cmd);

        // Execute the command with a fresh request context
        BBApiRequest request;
        [[maybe_unused]] auto response = execute_command(request, std::move(cmd));

        return true;
    } catch (const std::exception&) {
        // Expected - malformed data should throw, not crash
        return false;
    } catch (...) {
        // Catch any other exceptions
        return false;
    }
}

/**
 * @brief Fuzz ACIR bytecode parsing
 *
 * Tests circuit_buf_to_acir_format with arbitrary input data.
 * The function expects msgpack-compact format with a format marker byte.
 */
bool fuzz_acir_bytecode(const uint8_t* data, size_t size)
{
    if (size < 4) {
        return false;
    }

    try {
        // Create a copy since the function takes ownership
        std::vector<uint8_t> buf(data, data + size);

        // Set format marker for msgpack-compact (byte value 3)
        buf[0] = 3;

        [[maybe_unused]] auto acir_format = circuit_buf_to_acir_format(std::move(buf));

        return true;
    } catch (const std::exception&) {
        // Expected - malformed bytecode should throw
        return false;
    } catch (...) {
        return false;
    }
}

/**
 * @brief Fuzz witness data parsing
 *
 * Tests witness_buf_to_witness_vector with arbitrary input data.
 */
bool fuzz_witness_data(const uint8_t* data, size_t size)
{
    if (size < 4) {
        return false;
    }

    try {
        std::vector<uint8_t> buf(data, data + size);

        // Set format marker for msgpack-compact
        buf[0] = 3;

        [[maybe_unused]] auto witness_vec = witness_buf_to_witness_vector(std::move(buf));

        return true;
    } catch (const std::exception&) {
        return false;
    } catch (...) {
        return false;
    }
}

/**
 * @brief Fuzz CircuitProve command with structured input
 *
 * Creates a CircuitProve command with fuzz-generated bytecode and witness data.
 */
bool fuzz_circuit_prove(const uint8_t* data, size_t size)
{
    if (size < 32) {
        return false;
    }

    try {
        // Parse header
        auto bytecode_len = static_cast<uint16_t>(static_cast<int>(data[0]) | (static_cast<int>(data[1]) << 8));
        auto witness_len = static_cast<uint16_t>(static_cast<int>(data[2]) | (static_cast<int>(data[3]) << 8));

        // Clamp lengths to available data
        size_t remaining = size - 4;
        bytecode_len = static_cast<uint16_t>(std::min(static_cast<size_t>(bytecode_len), remaining / 2));
        witness_len = static_cast<uint16_t>(std::min(static_cast<size_t>(witness_len), remaining - bytecode_len));

        if (bytecode_len < 4 || witness_len < 4) {
            return false;
        }

        // Create bytecode with format marker
        std::vector<uint8_t> bytecode(data + 4, data + 4 + bytecode_len);
        bytecode[0] = 3; // msgpack-compact marker

        // Create witness with format marker
        std::vector<uint8_t> witness(data + 4 + bytecode_len, data + 4 + bytecode_len + witness_len);
        witness[0] = 3; // msgpack-compact marker

        // Create circuit input
        CircuitInput circuit;
        circuit.name = "fuzz_circuit";
        circuit.bytecode = std::move(bytecode);
        circuit.verification_key = {}; // Empty VK - will be computed

        // Create prove command
        CircuitProve prove_cmd;
        prove_cmd.circuit = std::move(circuit);
        prove_cmd.witness = std::move(witness);
        prove_cmd.settings = ProofSystemSettings{};

        // Execute
        BBApiRequest request;
        [[maybe_unused]] auto response = std::move(prove_cmd).execute(request);

        return true;
    } catch (const std::exception&) {
        return false;
    } catch (...) {
        return false;
    }
}

/**
 * @brief Fuzz CircuitVerify with malformed proof/VK data
 *
 * Tests verification robustness against corrupted inputs.
 */
bool fuzz_circuit_verify(const uint8_t* data, size_t size)
{
    if (size < 64) {
        return false;
    }

    try {
        // Parse header for sizes
        uint8_t num_public_inputs = data[0] % 16;
        uint8_t proof_elements = data[1] % 128 + 1;
        uint8_t vk_size_factor = data[2] % 8 + 1;

        const uint8_t* ptr = data + 3;
        size_t remaining = size - 3;

        // Build verification key from input bytes
        size_t vk_size = std::min(static_cast<size_t>(vk_size_factor * 32), remaining / 3);
        std::vector<uint8_t> verification_key(ptr, ptr + vk_size);
        ptr += vk_size;
        remaining -= vk_size;

        // Build public inputs (as uint256_t values)
        std::vector<uint256_t> public_inputs;
        for (uint8_t i = 0; i < num_public_inputs && remaining >= 32; ++i) {
            public_inputs.push_back(read_uint256(ptr, 32));
            ptr += 32;
            remaining -= 32;
        }

        // Build proof elements (as uint256_t values)
        std::vector<uint256_t> proof;
        size_t proof_bytes = std::min(static_cast<size_t>(proof_elements) * 32, remaining);
        for (size_t i = 0; i + 32 <= proof_bytes; i += 32) {
            proof.push_back(read_uint256(ptr + i, 32));
        }

        // Create verify command
        CircuitVerify verify_cmd;
        verify_cmd.verification_key = std::move(verification_key);
        verify_cmd.public_inputs = std::move(public_inputs);
        verify_cmd.proof = std::move(proof);
        verify_cmd.settings = ProofSystemSettings{};

        // Execute verification
        BBApiRequest request;
        [[maybe_unused]] auto response = std::move(verify_cmd).execute(request);

        return true;
    } catch (const std::exception&) {
        return false;
    } catch (...) {
        return false;
    }
}

/**
 * @brief Fuzz Chonk IVC command sequence
 *
 * Tests the stateful Chonk IVC API with fuzz-generated circuit/witness data.
 */
bool fuzz_chonk_sequence(const uint8_t* data, size_t size)
{
    if (size < 32) {
        return false;
    }

    try {
        // Parse header
        uint8_t num_circuits = (data[0] % 4) + 1; // 1-4 circuits
        const uint8_t* ptr = data + 1;
        size_t remaining = size - 1;

        BBApiRequest request;

        // Start Chonk
        ChonkStart start_cmd;
        start_cmd.num_circuits = num_circuits;
        [[maybe_unused]] auto start_response = std::move(start_cmd).execute(request);

        // For each circuit, load and accumulate
        for (uint8_t i = 0; i < num_circuits && remaining > 8; ++i) {
            auto bytecode_len =
                static_cast<uint16_t>(static_cast<int>(ptr[0]) | (static_cast<int>(ptr[1]) << 8));
            auto witness_len =
                static_cast<uint16_t>(static_cast<int>(ptr[2]) | (static_cast<int>(ptr[3]) << 8));
            ptr += 4;
            remaining -= 4;

            // Clamp to available data
            bytecode_len = static_cast<uint16_t>(std::min(static_cast<size_t>(bytecode_len), remaining / 2));
            witness_len = static_cast<uint16_t>(std::min(static_cast<size_t>(witness_len), remaining - bytecode_len));

            if (bytecode_len < 4 || witness_len < 4) {
                break;
            }

            // Create bytecode
            std::vector<uint8_t> bytecode(ptr, ptr + bytecode_len);
            bytecode[0] = 3; // msgpack-compact marker
            ptr += bytecode_len;
            remaining -= bytecode_len;

            // Create witness
            std::vector<uint8_t> witness(ptr, ptr + witness_len);
            witness[0] = 3; // msgpack-compact marker
            ptr += witness_len;
            remaining -= witness_len;

            // Load circuit
            CircuitInput circuit;
            circuit.name = "fuzz_circuit_" + std::to_string(i);
            circuit.bytecode = bytecode;
            circuit.verification_key = {};

            ChonkLoad load_cmd;
            load_cmd.circuit = std::move(circuit);
            [[maybe_unused]] auto load_response = std::move(load_cmd).execute(request);

            // Accumulate witness
            ChonkAccumulate acc_cmd;
            acc_cmd.witness = std::move(witness);
            [[maybe_unused]] auto acc_response = std::move(acc_cmd).execute(request);
        }

        // Try to prove (will likely fail but tests error handling)
        ChonkProve prove_cmd;
        [[maybe_unused]] auto prove_response = std::move(prove_cmd).execute(request);

        return true;
    } catch (const std::exception&) {
        return false;
    } catch (...) {
        return false;
    }
}

/**
 * @brief Fuzz cryptographic primitive commands
 *
 * Tests hash functions, signatures, and other crypto operations.
 */
bool fuzz_crypto_commands(const uint8_t* data, size_t size)
{
    if (size < 8) {
        return false;
    }

    try {
        uint8_t cmd_type = data[0] % 8;
        const uint8_t* payload = data + 1;
        size_t payload_size = size - 1;

        BBApiRequest request;

        switch (cmd_type) {
        case 0: {
            // Poseidon2Hash
            Poseidon2Hash_ cmd;
            // Parse as field elements (32 bytes each)
            for (size_t i = 0; i + 32 <= payload_size; i += 32) {
                fr element = fr::serialize_from_buffer(payload + i);
                cmd.inputs.push_back(element);
            }
            if (!cmd.inputs.empty()) {
                [[maybe_unused]] auto response = std::move(cmd).execute(request);
            }
            break;
        }
        case 1: {
            // Blake2s
            Blake2s cmd;
            cmd.data = std::vector<uint8_t>(payload, payload + payload_size);
            [[maybe_unused]] auto response = std::move(cmd).execute(request);
            break;
        }
        case 2: {
            // PedersenHash - uses bb::grumpkin::fq
            PedersenHash cmd;
            for (size_t i = 0; i + 32 <= payload_size; i += 32) {
                bb::grumpkin::fq element = bb::grumpkin::fq::serialize_from_buffer(payload + i);
                cmd.inputs.push_back(element);
            }
            if (payload_size >= 4) {
                cmd.hash_index = static_cast<uint32_t>(payload[0]) | (static_cast<uint32_t>(payload[1]) << 8) |
                                 (static_cast<uint32_t>(payload[2]) << 16) | (static_cast<uint32_t>(payload[3]) << 24);
            }
            if (!cmd.inputs.empty()) {
                [[maybe_unused]] auto response = std::move(cmd).execute(request);
            }
            break;
        }
        case 3: {
            // AesEncrypt - uses arrays and specific field names
            if (payload_size >= 48) { // 16 key + 16 iv + 16+ data
                AesEncrypt cmd;
                std::copy(payload, payload + 16, cmd.key.begin());
                std::copy(payload + 16, payload + 32, cmd.iv.begin());
                cmd.plaintext = std::vector<uint8_t>(payload + 32, payload + payload_size);
                cmd.length = static_cast<uint32_t>(cmd.plaintext.size());
                [[maybe_unused]] auto response = std::move(cmd).execute(request);
            }
            break;
        }
        case 4: {
            // GrumpkinMul - uses affine_element point
            if (payload_size >= 96) { // 32 scalar + 64 point
                GrumpkinMul cmd;
                cmd.scalar = bb::grumpkin::fr::serialize_from_buffer(payload);
                bb::grumpkin::fq x = bb::grumpkin::fq::serialize_from_buffer(payload + 32);
                bb::grumpkin::fq y = bb::grumpkin::fq::serialize_from_buffer(payload + 64);
                cmd.point = bb::grumpkin::g1::affine_element(x, y);
                [[maybe_unused]] auto response = std::move(cmd).execute(request);
            }
            break;
        }
        case 5: {
            // Bn254G1Mul - uses affine_element point
            if (payload_size >= 96) {
                Bn254G1Mul cmd;
                cmd.scalar = fr::serialize_from_buffer(payload);
                fq x = fq::serialize_from_buffer(payload + 32);
                fq y = fq::serialize_from_buffer(payload + 64);
                cmd.point = g1::affine_element(x, y);
                [[maybe_unused]] auto response = std::move(cmd).execute(request);
            }
            break;
        }
        case 6: {
            // Bn254FrSqrt
            if (payload_size >= 32) {
                Bn254FrSqrt cmd;
                cmd.input = fr::serialize_from_buffer(payload);
                [[maybe_unused]] auto response = std::move(cmd).execute(request);
            }
            break;
        }
        case 7: {
            // Poseidon2Permutation - uses std::array<fr, 4>
            if (payload_size >= 128) { // 4 * 32 bytes
                Poseidon2Permutation_ cmd;
                for (size_t i = 0; i < 4; i++) {
                    cmd.inputs[i] = fr::serialize_from_buffer(payload + i * 32);
                }
                [[maybe_unused]] auto response = std::move(cmd).execute(request);
            }
            break;
        }
        }

        return true;
    } catch (const std::exception&) {
        return false;
    } catch (...) {
        return false;
    }
}

/**
 * @brief Fuzz VK parsing and conversion
 *
 * Tests VkAsFields and MegaVkAsFields with arbitrary VK bytes.
 */
bool fuzz_vk_parsing(const uint8_t* data, size_t size)
{
    if (size < 32) {
        return false;
    }

    try {
        uint8_t vk_type = data[0] % 2;
        std::vector<uint8_t> vk_bytes(data + 1, data + size);

        BBApiRequest request;

        if (vk_type == 0) {
            VkAsFields cmd;
            cmd.verification_key = std::move(vk_bytes);
            [[maybe_unused]] auto response = std::move(cmd).execute(request);
        } else {
            MegaVkAsFields cmd;
            cmd.verification_key = std::move(vk_bytes);
            [[maybe_unused]] auto response = std::move(cmd).execute(request);
        }

        return true;
    } catch (const std::exception&) {
        return false;
    } catch (...) {
        return false;
    }
}

} // anonymous namespace

/**
 * @brief LibFuzzer entry point
 */
extern "C" int LLVMFuzzerTestOneInput(const uint8_t* data, size_t size)
{
    if (size < 8) {
        return 0;
    }

    // Select fuzzer mode based on first byte
    FuzzerMode mode = static_cast<FuzzerMode>(data[0] % 8);
    const uint8_t* payload = data + 1;
    size_t payload_size = size - 1;

    switch (mode) {
    case FuzzerMode::MSGPACK_COMMAND:
        fuzz_msgpack_command(payload, payload_size);
        break;
    case FuzzerMode::ACIR_BYTECODE:
        fuzz_acir_bytecode(payload, payload_size);
        break;
    case FuzzerMode::WITNESS_DATA:
        fuzz_witness_data(payload, payload_size);
        break;
    case FuzzerMode::CIRCUIT_PROVE:
        fuzz_circuit_prove(payload, payload_size);
        break;
    case FuzzerMode::CIRCUIT_VERIFY:
        fuzz_circuit_verify(payload, payload_size);
        break;
    case FuzzerMode::CHONK_SEQUENCE:
        fuzz_chonk_sequence(payload, payload_size);
        break;
    case FuzzerMode::CRYPTO_COMMANDS:
        fuzz_crypto_commands(payload, payload_size);
        break;
    case FuzzerMode::VK_PARSING:
        fuzz_vk_parsing(payload, payload_size);
        break;
    }

    return 0;
}

/**
 * @brief Custom mutator for structure-aware fuzzing
 *
 * Provides intelligent mutations that are more likely to produce valid inputs
 * for the various fuzzer modes.
 */
extern "C" size_t LLVMFuzzerCustomMutator(uint8_t* data, size_t size, size_t max_size, unsigned int seed)
{
    if (size < 8 || max_size < 16) {
        return LLVMFuzzerMutate(data, size, max_size);
    }

    FastRandom rng(seed);
    int strategy = static_cast<int>(rng.next() % 100u);

    if (strategy < 15) {
        // Change fuzzer mode
        data[0] = static_cast<uint8_t>(rng.next() % 8);
    } else if (strategy < 30) {
        // Mutate format marker byte (position varies by mode)
        size_t marker_pos = 1 + (rng.next() % std::min(size - 1, size_t(4)));
        // Set to valid format markers
        uint8_t markers[] = { 2, 3 }; // msgpack, msgpack-compact
        data[marker_pos] = markers[rng.next() % 2];
    } else if (strategy < 45) {
        // Insert special msgpack type markers
        if (size > 4) {
            size_t pos = 1 + (rng.next() % (size - 1));
            // Msgpack type markers
            uint8_t msgpack_markers[] = {
                0x90, 0x91, 0x92, 0x93, // fixarray
                0x80, 0x81, 0x82, 0x83, // fixmap
                0xa0, 0xa1, 0xa2, 0xa3, // fixstr
                0xc4, 0xc5, 0xc6,       // bin8, bin16, bin32
                0xcc, 0xcd, 0xce, 0xcf, // uint8-uint64
                0xd0, 0xd1, 0xd2, 0xd3, // int8-int64
            };
            data[pos] = msgpack_markers[rng.next() % sizeof(msgpack_markers)];
        }
    } else if (strategy < 60) {
        // Mutate field element boundaries (32-byte aligned)
        if (size >= 34) {
            size_t field_start = 1 + ((rng.next() % ((size - 1) / 32)) * 32);
            if (field_start + 32 <= size) {
                // Apply field element mutations
                fr elem = fr::serialize_from_buffer(data + field_start);
                elem = mutate_field_element(elem, rng);
                auto buf = elem.to_buffer();
                memcpy(data + field_start, buf.data(), 32);
            }
        }
    } else if (strategy < 75) {
        // Insert/modify length fields (common in msgpack)
        if (size > 4) {
            size_t pos = 1 + (rng.next() % (size - 2));
            // Small length values are more common/valid
            data[pos] = static_cast<uint8_t>(rng.next() % 64);
        }
    } else {
        // Use LibFuzzer's built-in mutation
        return LLVMFuzzerMutate(data, size, max_size);
    }

    return size;
}
