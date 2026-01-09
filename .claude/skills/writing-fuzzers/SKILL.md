---
name: writing-fuzzers
description: Write libfuzzer harnesses for barretenberg/cpp components.
---

# Writing LibFuzzer Harnesses for Barretenberg

## File Naming & Location

Fuzzers use `*.fuzzer.cpp` naming and are auto-discovered by CMake when `FUZZING=1`.

Place in same directory as code being tested:
- `barretenberg/cpp/src/barretenberg/bbapi/bbapi.fuzzer.cpp`

## Basic Structure

```cpp
#include "component_being_tested.hpp"
#include <cstdint>

extern "C" int LLVMFuzzerTestOneInput(const uint8_t* data, size_t size)
{
    if (size < MIN_SIZE) return 0;

    try {
        component_function(data, size);
    } catch (const std::exception&) {
        // Expected - malformed data should throw, not crash
    }
    return 0;
}
```

## Custom Mutator

```cpp
extern "C" size_t LLVMFuzzerMutate(uint8_t* Data, size_t Size, size_t MaxSize);

extern "C" size_t LLVMFuzzerCustomMutator(uint8_t* data, size_t size,
                                          size_t max_size, unsigned int seed)
{
    // Structure-aware mutations here
    return LLVMFuzzerMutate(data, size, max_size);
}
```

## Utilities

- `FastRandom` - Deterministic PRNG in `fuzzer.hpp`
- `msgpack_fuzzer::*` - Msgpack mutations in `fuzzer_msgpack.hpp`
- `mutateFieldElement<T, FF>()` - Field element mutation in `fuzzer.hpp`

## Building & Running

```bash
cd barretenberg/cpp
cmake --preset fuzzing
cd build-fuzzing
ninja component_fuzzer
./bin/component_fuzzer -runs=10000
```

## Reference Fuzzers

- `bbapi/bbapi.fuzzer.cpp` - Multi-mode API fuzzing
- `dsl/acir_format/acir_dsl.fuzzer.cpp` - ACIR program generation
- `stdlib/primitives/field/field.fuzzer.hpp` - ArithmeticFuzzHelper pattern
