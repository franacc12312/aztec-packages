/**
 * @file witness_data.fuzzer.cpp
 * @brief Fuzzer for witness data deserialization (msgpack-compact format)
 *
 * Tests the parsing pipeline:
 *   Raw bytes -> deserialize_msgpack_compact -> WitnessMap -> WitnessVector
 *
 * Targets memory safety issues in msgpack parsing and witness structure handling.
 */

#include "barretenberg/dsl/acir_format/acir_to_constraint_buf.hpp"
#include "fuzzer_msgpack.hpp"
#include <cstdint>
#include <vector>

extern "C" size_t LLVMFuzzerMutate(uint8_t* Data, size_t Size, size_t MaxSize);

namespace {

class FastRandom {
    uint32_t state;

  public:
    explicit FastRandom(uint32_t seed)
    {
        if (seed == 0)
            seed = 1;
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

} // namespace

extern "C" int LLVMFuzzerTestOneInput(const uint8_t* data, size_t size)
{
    if (size < 2) {
        return 0;
    }

    try {
        std::vector<uint8_t> buf(data, data + size);
        acir_format::witness_buf_to_witness_vector(std::move(buf));
    } catch (const std::exception&) {
        // Expected - malformed data should throw
    } catch (...) {
        // Catch any other exceptions
    }

    return 0;
}

extern "C" size_t LLVMFuzzerCustomMutator(uint8_t* data, size_t size, size_t max_size, unsigned int seed)
{
    if (size < 2) {
        return LLVMFuzzerMutate(data, size, max_size);
    }

    FastRandom rng(seed);
    int strategy = rng.next() % 100;

    if (strategy < 70) {
        // 70%: Use msgpack-aware mutations
        return msgpack_fuzzer::mutate_msgpack(data, size, rng);
    } else {
        // 30%: Delegate to libfuzzer
        return LLVMFuzzerMutate(data, size, max_size);
    }
}
