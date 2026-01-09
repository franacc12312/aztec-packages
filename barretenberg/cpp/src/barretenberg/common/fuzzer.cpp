/**
 * @brief Global flag for ArithmeticFuzzHelper to signal expected circuit failures.
 * Used by fuzzers that test circuit validity - when set to true, a failing circuit
 * check is expected and not treated as a bug.
 */
// NOLINTNEXTLINE(cppcoreguidelines-avoid-non-const-global-variables)
bool circuit_should_fail = false;
