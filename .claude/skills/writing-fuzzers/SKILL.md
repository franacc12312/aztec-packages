---
name: writing-fuzzers
description: Write libfuzzer harnesses for barretenberg/cpp components. Covers fuzzer patterns, custom mutators, exception handling, CMake integration, and best practices for testing cryptographic code with ASAN.
---

# Writing LibFuzzer Harnesses for Barretenberg

## When to Use

Use this skill when:
- Adding a new fuzzer for a barretenberg component
- Creating memory safety tests with ASAN
- Testing cryptographic primitives against malformed inputs
- Implementing structure-aware fuzzing for msgpack/binary formats

## File Naming & Location

Fuzzers use the naming convention `*.fuzzer.cpp` and are auto-discovered by CMake when `FUZZING=1`.

**Location patterns:**
- Place in the same directory as the code being tested
- Example: `barretenberg/cpp/src/barretenberg/bbapi/bbapi.fuzzer.cpp`

## Basic Fuzzer Structure

```cpp
#include "component_being_tested.hpp"
#include <cstdint>
#include <cstring>

// Required entry point
extern "C" int LLVMFuzzerTestOneInput(const uint8_t* data, size_t size)
{
    if (size < MIN_SIZE) {
        return 0;  // Early return for insufficient data
    }

    try {
        // Parse and exercise the code
        component_function(data, size);
    } catch (const std::exception&) {
        // Expected - malformed data should throw, not crash
    }

    return 0;
}
```

## Custom Mutator Pattern

For structure-aware fuzzing, implement a custom mutator:

```cpp
extern "C" size_t LLVMFuzzerMutate(uint8_t* Data, size_t Size, size_t MaxSize);

extern "C" size_t LLVMFuzzerCustomMutator(uint8_t* data, size_t size,
                                          size_t max_size, unsigned int seed)
{
    FastRandom rng(seed);

    // Choose mutation strategy
    int strategy = rng.next() % 100;

    if (strategy < 20) {
        // Structure-specific mutation
        mutate_structure(data, size, rng);
    } else if (strategy < 40) {
        // Format marker mutations
        mutate_format_markers(data, size, rng);
    } else if (strategy < 60) {
        // Field element mutations (32-byte boundaries)
        mutate_field_elements(data, size, rng);
    } else {
        // Delegate to libfuzzer default
        return LLVMFuzzerMutate(data, size, max_size);
    }

    return size;
}
```

## Initialization Hook (Optional)

For fuzzers needing global state:

```cpp
extern "C" int LLVMFuzzerInitialize(int* argc, char*** argv)
{
    // Set up SRS, world state, contracts, etc.
    bb::srs::init_crs_factory("path/to/srs");
    return 0;
}
```

## Common Fuzzer Patterns

### 1. Multi-Mode Dispatch Fuzzer

Use first byte to select different testing modes:

```cpp
enum class FuzzerMode : uint8_t {
    MODE_A = 0,
    MODE_B = 1,
    MODE_C = 2,
};

extern "C" int LLVMFuzzerTestOneInput(const uint8_t* data, size_t size)
{
    if (size < 2) return 0;

    FuzzerMode mode = static_cast<FuzzerMode>(data[0] % 3);
    const uint8_t* payload = data + 1;
    size_t payload_size = size - 1;

    switch (mode) {
    case FuzzerMode::MODE_A: fuzz_mode_a(payload, payload_size); break;
    case FuzzerMode::MODE_B: fuzz_mode_b(payload, payload_size); break;
    case FuzzerMode::MODE_C: fuzz_mode_c(payload, payload_size); break;
    }
    return 0;
}
```

### 2. VM/Instruction Stream Fuzzer

Parse input as a sequence of instructions:

```cpp
extern "C" int LLVMFuzzerTestOneInput(const uint8_t* data, size_t size)
{
    auto instructions = parse_instructions(data, size);

    ExecutionState state;
    for (auto& instr : instructions) {
        if (!execute_instruction(state, instr)) {
            break;  // Invalid state, stop execution
        }
    }

    // Validate final state
    validate_state(state);
    return 0;
}
```

### 3. Differential Fuzzer

Compare two implementations:

```cpp
extern "C" int LLVMFuzzerTestOneInput(const uint8_t* data, size_t size)
{
    auto native_result = native_implementation(data, size);
    auto circuit_result = circuit_implementation(data, size);

    if (native_result != circuit_result) {
        abort();  // Signal differential bug
    }

    // Verify circuit validity
    if (!bb::CircuitChecker::check(builder)) {
        abort();
    }
    return 0;
}
```

## Barretenberg-Specific Utilities

### FastRandom (Deterministic PRNG)

```cpp
#include "barretenberg/common/fuzzer.hpp"

// Use for reproducible mutations
FastRandom rng(seed);
uint32_t val = rng.next();
```

### Field Element Mutation

```cpp
#include "barretenberg/common/fuzzer.hpp"

// Mutate field elements with special value awareness
fr elem = fr::serialize_from_buffer(data);
elem = mutateFieldElement(elem, rng);
```

### uint256_t Reading (Safe Unaligned Access)

```cpp
#include "barretenberg/common/fuzzer.hpp"

// Safe reading of 256-bit values from potentially unaligned buffers
uint256_t value = read_uint256(data, 32);
```

## Exception Handling Strategies

### For API/Parsing Code (Graceful)

```cpp
try {
    auto parsed = parse_input(data, size);
    process(parsed);
} catch (const std::exception&) {
    return 0;  // Malformed input is expected
} catch (...) {
    return 0;  // Catch any exception type
}
```

### For Circuit Code (Assert on Mismatch)

```cpp
auto result = compute(input);
auto circuit_result = compute_circuit(input);

if (!bb::CircuitChecker::check(builder)) {
    // Circuit validity failure
    if (!expected_failure) {
        abort();  // Bug found!
    }
}

if (result != circuit_result) {
    abort();  // Differential bug found!
}
```

## CMakeLists.txt Integration

Fuzzers are auto-discovered, but may need extra dependencies:

```cmake
# In module's CMakeLists.txt
barretenberg_module(mymodule dep1 dep2)

# Add fuzzer-specific dependencies
if(FUZZING)
    target_link_libraries(mymodule_myfuzzer_fuzzer PRIVATE vm2_stub)
endif()
```

## Building & Running Fuzzers

```bash
# Configure with fuzzing preset
cd barretenberg/cpp
cmake --preset fuzzing

# Build specific fuzzer
cd build-fuzzing
ninja bbapi_bbapi_fuzzer

# Run fuzzer
./bin/bbapi_bbapi_fuzzer -runs=10000

# Run with corpus
./bin/bbapi_bbapi_fuzzer corpus_dir/

# Run with specific options
./bin/bbapi_bbapi_fuzzer -max_len=4096 -timeout=30 corpus_dir/
```

## Special Value Constants for Field Elements

When mutating field elements, use these edge cases:

```cpp
// Special values that often trigger bugs
fr::zero()                    // 0
fr::one()                     // 1
-fr::one()                    // p-1 (modular -1)
fr::one().sqrt().second       // sqrt(1)
fr::get_root_of_unity(8)      // 8th root of unity
fr(2)                         // 2
fr((fr::modulus - 1) / 2)     // midpoint value
```

## Msgpack Format Markers

For msgpack-aware fuzzing:

```cpp
// Format markers
uint8_t MSGPACK_FORMAT = 2;         // Standard msgpack
uint8_t MSGPACK_COMPACT_FORMAT = 3; // Compact msgpack

// Type markers to inject
uint8_t msgpack_markers[] = {
    0x90, 0x91, 0x92, 0x93,  // fixarray (0-15 elements)
    0x80, 0x81, 0x82, 0x83,  // fixmap (0-15 pairs)
    0xa0, 0xa1, 0xa2, 0xa3,  // fixstr (0-31 bytes)
    0xc4, 0xc5, 0xc6,        // bin8, bin16, bin32
    0xcc, 0xcd, 0xce, 0xcf,  // uint8, uint16, uint32, uint64
    0xd0, 0xd1, 0xd2, 0xd3,  // int8, int16, int32, int64
};
```

## Avoiding Namespace Ambiguity

When `using namespace bb;` causes ambiguity with `bb::stdlib`:

```cpp
namespace {
// Define aliases inside anonymous namespace
using CircuitProve = bb::bbapi::CircuitProve;
using fr = bb::fr;
using fq = bb::fq;

// Wrap functions that conflict
inline auto execute_cmd(BBApiRequest& r, Command&& c) {
    return bb::bbapi::execute(r, std::move(c));
}
} // anonymous namespace
```

## Checklist for New Fuzzers

```
New Fuzzer Checklist:
- [ ] File named `component.fuzzer.cpp`
- [ ] Placed in same directory as tested code
- [ ] Has `LLVMFuzzerTestOneInput` entry point
- [ ] Early return for insufficient input size
- [ ] Exception handling for malformed inputs
- [ ] Custom mutator if structure-aware fuzzing needed
- [ ] CMakeLists.txt updated if extra deps needed
- [ ] Builds with `cmake --preset fuzzing`
- [ ] Runs without immediate crash: `./bin/fuzzer -runs=0`
```

## Reference Fuzzers

Study these existing fuzzers for patterns:

| Fuzzer | Location | Pattern | Notes |
|--------|----------|---------|-------|
| `bbapi.fuzzer.cpp` | `bbapi/` | Multi-mode dispatch | API testing, msgpack |
| `acir_dsl.fuzzer.cpp` | `dsl/acir_format/` | VM-based | ACIR program generation |
| `field.fuzzer.hpp` | `stdlib/primitives/field/` | Havoc mutation | Field arithmetic |
| `blake2s.fuzzer.cpp` | `stdlib/hash/blake2s/` | Differential | Hash function testing |
| `alu.fuzzer.cpp` | `avm_fuzzer/harness/` | AVM gadget | Custom mutator |
