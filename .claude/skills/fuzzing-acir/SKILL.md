---
name: fuzzing-acir
description: Fuzzing ACIR bytecode and witness data using msgpack-compact format.
---

# Fuzzing ACIR Objects (msgpack-compact Format)

## msgpack-compact Format

ACIR uses msgpack-compact with a single-byte format marker:

```
[format_marker: 1 byte][msgpack_payload: N bytes]
```

Format markers:
- `0x02` - Standard msgpack
- `0x03` - Compact msgpack (preferred)

The payload must be an ARRAY type, not MAP.

## Key Structures

```
Program { functions: [Circuit, ...] }
Circuit { current_witness_index, opcodes, expression_width, ... }
Opcode  { variant as single-entry MAP: {"AssertZero": <expr>} }
Expression { mul_terms, linear_combinations, q_c (32 bytes) }
Witness { value: u32 }
```

## Edge Cases to Target

1. **Format marker** - Invalid values (0x00, 0x01, 0x04, 0xff)
2. **Type mismatch** - MAP instead of ARRAY after marker
3. **Array lengths** - Declared vs actual element count mismatch
4. **Binary sizes** - Coefficients != 32 bytes
5. **Witness indices** - u32 max, negative values
6. **Tagged variants** - Unknown/misspelled opcode names, empty maps

## Using fuzzer_msgpack.hpp

```cpp
#include "barretenberg/common/fuzzer_msgpack.hpp"

extern "C" size_t LLVMFuzzerCustomMutator(uint8_t* data, size_t size,
                                          size_t max_size, unsigned int seed)
{
    FastRandom rng(seed);
    return msgpack_fuzzer::mutate_msgpack(data, size, rng);
}
```

## Reference

- `dsl/acir_format/acir_dsl.fuzzer.cpp` - Existing ACIR fuzzer
- `bbapi/bbapi.fuzzer.cpp` - API-level ACIR testing
