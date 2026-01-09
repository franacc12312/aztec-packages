#pragma once
#include <cstdint>
#include <cstring>

// Forward declare LLVMFuzzerMutate for field element mutation
extern "C" size_t LLVMFuzzerMutate(uint8_t* Data, size_t Size, size_t MaxSize);

// =====================================================================
// Msgpack Format Mutation Utilities
// For fuzzing msgpack-compact formats (ACIR bytecode, witness files, etc.)
// =====================================================================

namespace msgpack_fuzzer {

// Format markers for msgpack-compact format
constexpr uint8_t FORMAT_MSGPACK = 2;
constexpr uint8_t FORMAT_MSGPACK_COMPACT = 3;

// Msgpack type markers for injection
constexpr uint8_t MSGPACK_FIXARRAY_0 = 0x90;
constexpr uint8_t MSGPACK_FIXARRAY_15 = 0x9f;
constexpr uint8_t MSGPACK_ARRAY16 = 0xdc;
constexpr uint8_t MSGPACK_ARRAY32 = 0xdd;
constexpr uint8_t MSGPACK_FIXMAP_0 = 0x80;
constexpr uint8_t MSGPACK_FIXMAP_15 = 0x8f;
constexpr uint8_t MSGPACK_MAP16 = 0xde;
constexpr uint8_t MSGPACK_MAP32 = 0xdf;
constexpr uint8_t MSGPACK_BIN8 = 0xc4;
constexpr uint8_t MSGPACK_BIN16 = 0xc5;
constexpr uint8_t MSGPACK_BIN32 = 0xc6;
constexpr uint8_t MSGPACK_UINT8 = 0xcc;
constexpr uint8_t MSGPACK_UINT16 = 0xcd;
constexpr uint8_t MSGPACK_UINT32 = 0xce;
constexpr uint8_t MSGPACK_UINT64 = 0xcf;
constexpr uint8_t MSGPACK_INT8 = 0xd0;
constexpr uint8_t MSGPACK_INT16 = 0xd1;
constexpr uint8_t MSGPACK_INT32 = 0xd2;
constexpr uint8_t MSGPACK_INT64 = 0xd3;
constexpr uint8_t MSGPACK_NIL = 0xc0;
constexpr uint8_t MSGPACK_FALSE = 0xc2;
constexpr uint8_t MSGPACK_TRUE = 0xc3;
constexpr uint8_t MSGPACK_FIXSTR_0 = 0xa0;
constexpr uint8_t MSGPACK_FIXSTR_31 = 0xbf;
constexpr uint8_t MSGPACK_STR8 = 0xd9;
constexpr uint8_t MSGPACK_STR16 = 0xda;
constexpr uint8_t MSGPACK_STR32 = 0xdb;

/**
 * @brief Collection of msgpack type markers for random injection
 */
constexpr uint8_t TYPE_MARKERS[] = {
    // Arrays (valid container for ACIR)
    0x90, 0x91, 0x92, 0x93, 0x94, 0x95, // fixarray 0-5
    0xdc, 0xdd,                          // array16, array32
    // Maps (often invalid, should be array for root)
    0x80, 0x81, 0x82, 0x83, // fixmap 0-3
    0xde, 0xdf,             // map16, map32
    // Binary (for coefficients/field elements)
    0xc4, 0xc5, 0xc6, // bin8, bin16, bin32
    // Strings (for variant tags)
    0xa0, 0xa1, 0xa2, 0xab, // fixstr various
    0xd9, 0xda, 0xdb,       // str8, str16, str32
    // Integers (for witness indices)
    0xcc, 0xcd, 0xce, 0xcf, // uint8-64
    0xd0, 0xd1, 0xd2, 0xd3, // int8-64
    // Special
    0xc0,       // nil
    0xc2, 0xc3, // false, true
};
constexpr size_t TYPE_MARKERS_COUNT = sizeof(TYPE_MARKERS);

/**
 * @brief Mutate the format marker (byte 0) of msgpack-compact data
 * @tparam Rng PRNG type with next() method
 * @param data Data buffer (must have size >= 1)
 * @param rng Random number generator
 */
template <typename Rng> inline void mutate_format_marker(uint8_t* data, Rng& rng)
{
    // 50% chance to use invalid marker, 50% valid
    if (rng.next() & 1) {
        uint8_t invalid_markers[] = { 0x00, 0x01, 0x04, 0x05, 0xff };
        data[0] = invalid_markers[rng.next() % sizeof(invalid_markers)];
    } else {
        data[0] = (rng.next() & 1) ? FORMAT_MSGPACK : FORMAT_MSGPACK_COMPACT;
    }
}

/**
 * @brief Inject a msgpack type marker at a random position
 * @tparam Rng PRNG type with next() method
 * @param data Data buffer
 * @param size Buffer size
 * @param rng Random number generator
 */
template <typename Rng> inline void inject_type_marker(uint8_t* data, size_t size, Rng& rng)
{
    if (size < 2) {
        return;
    }
    // Position after format marker
    size_t pos = 1 + (rng.next() % (size - 1));
    data[pos] = TYPE_MARKERS[rng.next() % TYPE_MARKERS_COUNT];
}

/**
 * @brief Mutate array length headers in msgpack data
 * @tparam Rng PRNG type with next() method
 * @param data Data buffer
 * @param size Buffer size
 * @param rng Random number generator
 */
template <typename Rng> inline void mutate_array_length(uint8_t* data, size_t size, Rng& rng)
{
    for (size_t i = 1; i + 1 < size; i++) {
        // Find array16 header (0xdc)
        if (data[i] == MSGPACK_ARRAY16 && i + 3 < size) {
            // Mutate the 16-bit length
            data[i + 1] = static_cast<uint8_t>(rng.next());
            data[i + 2] = static_cast<uint8_t>(rng.next());
            return;
        }
        // Find array32 header (0xdd)
        if (data[i] == MSGPACK_ARRAY32 && i + 5 < size) {
            // Mutate the 32-bit length
            data[i + 1] = static_cast<uint8_t>(rng.next());
            data[i + 2] = static_cast<uint8_t>(rng.next());
            data[i + 3] = static_cast<uint8_t>(rng.next());
            data[i + 4] = static_cast<uint8_t>(rng.next());
            return;
        }
        // Find fixarray (0x90-0x9f)
        if ((data[i] & 0xf0) == 0x90) {
            // Mutate the 4-bit length in place
            data[i] = static_cast<uint8_t>(0x90 | (rng.next() & 0x0f));
            return;
        }
    }
}

/**
 * @brief Mutate binary (bin8/bin16/bin32) length headers
 * Targets coefficient/field element size mismatches
 * @tparam Rng PRNG type with next() method
 * @param data Data buffer
 * @param size Buffer size
 * @param rng Random number generator
 */
template <typename Rng> inline void mutate_binary_length(uint8_t* data, size_t size, Rng& rng)
{
    for (size_t i = 1; i + 1 < size; i++) {
        // Find bin8 header (0xc4)
        if (data[i] == MSGPACK_BIN8 && i + 2 < size) {
            // Mutate length - target sizes around 32 bytes (field elements)
            uint8_t lengths[] = { 0, 1, 16, 31, 32, 33, 64, 255 };
            data[i + 1] = lengths[rng.next() % sizeof(lengths)];
            return;
        }
        // Find bin16 header (0xc5)
        if (data[i] == MSGPACK_BIN16 && i + 3 < size) {
            data[i + 1] = static_cast<uint8_t>(rng.next());
            data[i + 2] = static_cast<uint8_t>(rng.next());
            return;
        }
    }
}

/**
 * @brief Mutate witness indices (integer encodings)
 * @tparam Rng PRNG type with next() method
 * @param data Data buffer
 * @param size Buffer size
 * @param rng Random number generator
 */
template <typename Rng> inline void mutate_witness_index(uint8_t* data, size_t size, Rng& rng)
{
    for (size_t i = 1; i + 1 < size; i++) {
        // Find uint8 (0xcc)
        if (data[i] == MSGPACK_UINT8 && i + 2 < size) {
            data[i + 1] = static_cast<uint8_t>(rng.next());
            return;
        }
        // Find uint16 (0xcd)
        if (data[i] == MSGPACK_UINT16 && i + 3 < size) {
            data[i + 1] = static_cast<uint8_t>(rng.next());
            data[i + 2] = static_cast<uint8_t>(rng.next());
            return;
        }
        // Find uint32 (0xce)
        if (data[i] == MSGPACK_UINT32 && i + 5 < size) {
            data[i + 1] = static_cast<uint8_t>(rng.next());
            data[i + 2] = static_cast<uint8_t>(rng.next());
            data[i + 3] = static_cast<uint8_t>(rng.next());
            data[i + 4] = static_cast<uint8_t>(rng.next());
            return;
        }
        // Inject negative value (int8 0xd0 with -1)
        if ((rng.next() % 20) == 0 && i + 2 < size) {
            data[i] = MSGPACK_INT8;
            data[i + 1] = 0xff; // -1
            return;
        }
    }
}

/**
 * @brief Mutate a 32-byte field element in msgpack binary format
 * Looks for bin8 with length 32 (0xc4 0x20) pattern
 * @tparam Rng PRNG type with next() method
 * @param data Data buffer
 * @param size Buffer size
 * @param rng Random number generator
 */
template <typename Rng> inline void mutate_field_element_bytes(uint8_t* data, size_t size, Rng& rng)
{
    // Look for bin8 marker (0xc4) followed by length 32 (0x20)
    for (size_t i = 1; i + 34 < size; i++) {
        if (data[i] == MSGPACK_BIN8 && data[i + 1] == 0x20) {
            // Found a 32-byte binary blob
            uint8_t* field_start = data + i + 2;

            int mutation = rng.next() % 6;
            switch (mutation) {
            case 0: // Zero
                std::memset(field_start, 0, 32);
                break;
            case 1: // Max value (all 0xff)
                std::memset(field_start, 0xff, 32);
                break;
            case 2: // One (big-endian)
                std::memset(field_start, 0, 32);
                field_start[31] = 1;
                break;
            case 3: // Random single bit flip
                field_start[rng.next() % 32] ^= static_cast<uint8_t>(1 << (rng.next() % 8));
                break;
            case 4: // Random single byte change
                field_start[rng.next() % 32] = static_cast<uint8_t>(rng.next());
                break;
            case 5: // Delegate to libfuzzer
                LLVMFuzzerMutate(field_start, 32, 32);
                break;
            }
            return;
        }
    }
}

/**
 * @brief Apply a random msgpack-aware mutation strategy
 * @tparam Rng PRNG type with next() method
 * @param data Data buffer
 * @param size Buffer size
 * @param rng Random number generator
 * @return The (potentially unchanged) size
 */
template <typename Rng> inline size_t mutate_msgpack(uint8_t* data, size_t size, Rng& rng)
{
    if (size == 0) {
        return 0;
    }

    int strategy = rng.next() % 100;

    if (strategy < 10) {
        // 10%: Mutate format marker
        mutate_format_marker(data, rng);
    } else if (strategy < 25) {
        // 15%: Inject msgpack type marker
        inject_type_marker(data, size, rng);
    } else if (strategy < 40) {
        // 15%: Mutate array lengths
        mutate_array_length(data, size, rng);
    } else if (strategy < 55) {
        // 15%: Mutate binary sizes
        mutate_binary_length(data, size, rng);
    } else if (strategy < 70) {
        // 15%: Mutate witness indices
        mutate_witness_index(data, size, rng);
    } else if (strategy < 85) {
        // 15%: Mutate field elements
        mutate_field_element_bytes(data, size, rng);
    } else {
        // 15%: Random byte mutation (delegate to libfuzzer)
        if (size > 1) {
            size_t pos = 1 + (rng.next() % (size - 1));
            data[pos] = static_cast<uint8_t>(rng.next());
        }
    }

    return size;
}

} // namespace msgpack_fuzzer
