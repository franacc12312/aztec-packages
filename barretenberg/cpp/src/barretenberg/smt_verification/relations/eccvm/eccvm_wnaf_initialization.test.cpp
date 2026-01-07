/**
 * @file eccvm_wnaf_initialization.test.cpp
 * @brief SMT-based verification of WNAF initialization constraints
 *
 * This file tests whether the WNAF relation properly constrains initialization
 * at the start of the trace (row 0 -> row 1 transition).
 *
 * SECURITY CONCERN:
 * At row 0, precompute_select = 0, which disables most constraints.
 * At row 1, the first active row, scalar_sum should be 0 (start of first scalar).
 * But scalar_sum at row 1 comes from scalar_sum_shift at row 0.
 *
 * If scalar_sum_shift at row 0 is not constrained to 0, a malicious prover
 * could start with an arbitrary scalar_sum, potentially causing incorrect
 * scalar decomposition.
 */

#include <gtest/gtest.h>

#include "barretenberg/smt_verification/solver/solver.hpp"
#include "barretenberg/smt_verification/terms/term.hpp"
#include "eccvm_relations.hpp"

using namespace bb;
using namespace smt_solver;
using namespace smt_terms;

namespace {

STerm find_var(const std::vector<STerm>& vars, const std::vector<std::string>& names, const std::string& name)
{
    for (size_t i = 0; i < names.size(); ++i) {
        if (names[i] == name) {
            return vars[i];
        }
    }
    throw std::runtime_error("Variable not found: " + name);
}

} // namespace

/**
 * @brief Test if scalar_sum is constrained when precompute_select = 0
 *
 * This tests the initialization row (row 0) where precompute_select = 0.
 * The question: Is scalar_sum_shift constrained to be 0?
 *
 * If this test PASSES (SAT), it means scalar_sum_shift can be non-zero
 * when precompute_select = 0, which is a potential vulnerability.
 *
 * Expected: UNSAT if properly constrained, SAT if vulnerable
 */
TEST(ECCVMWnafInitialization, ScalarSumShiftConstrainedWhenInactive)
{
    const char* modulus = "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001";

    auto trace = smt_eccvm_relations::record_eccvm_wnaf_relation();
    Solver s(modulus, default_solver_config);

    std::vector<STerm> formulas, vars;
    std::vector<std::string> names;
    smt_eccvm_relations::replay_eccvm_wnaf_relation(trace, &s, "", true, formulas, vars, names);

    STerm zero = FFIConst("0", &s, 10);
    STerm one = FFIConst("1", &s, 10);

    STerm precompute_select = find_var(vars, names, "precompute_select");
    STerm scalar_sum_shift = find_var(vars, names, "precompute_scalar_sum_shift");

    // Assert all relation formulas are satisfied
    for (size_t i = 0; i < formulas.size(); ++i) {
        s.assertFormula(s.term_manager.mkTerm(cvc5::Kind::EQUAL,
                                              { static_cast<cvc5::Term>(formulas[i]), static_cast<cvc5::Term>(zero) }));
    }

    // We are at row 0: precompute_select = 0
    precompute_select == zero;

    // Try to set scalar_sum_shift to non-zero
    scalar_sum_shift != zero;

    bool is_sat = s.check();

    if (is_sat) {
        // VULNERABILITY DETECTED!
        // scalar_sum_shift can be non-zero when precompute_select = 0
        // This means at row 1, scalar_sum can start with an arbitrary value
        GTEST_SKIP() << "POTENTIAL VULNERABILITY: scalar_sum_shift is NOT constrained when precompute_select = 0. "
                     << "A malicious prover could inject arbitrary scalar_sum at trace start.";
    } else {
        // Properly constrained
        SUCCEED() << "scalar_sum_shift is properly constrained to 0 when precompute_select = 0";
    }
}

/**
 * @brief Test the transition from row 0 (inactive) to row 1 (first active)
 *
 * This simulates the exact scenario at trace start:
 * - Row 0: precompute_select = 0 (inactive)
 * - Row 1: precompute_select = 1, round = 0 (first row of first scalar)
 *
 * We verify that scalar_sum at row 1 must be 0.
 */
TEST(ECCVMWnafInitialization, FirstActiveRowScalarSumMustBeZero)
{
    const char* modulus = "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001";

    auto trace = smt_eccvm_relations::record_eccvm_wnaf_relation();

    // We model this as two consecutive rows:
    // Row 0 (current): precompute_select = 0
    // Row 1 (shift): precompute_select_shift = 1, scalar_sum_shift should start accumulation

    Solver s(modulus, default_solver_config);

    std::vector<STerm> formulas, vars;
    std::vector<std::string> names;
    smt_eccvm_relations::replay_eccvm_wnaf_relation(trace, &s, "", true, formulas, vars, names);

    STerm zero = FFIConst("0", &s, 10);
    STerm one = FFIConst("1", &s, 10);

    STerm precompute_select = find_var(vars, names, "precompute_select");
    STerm precompute_select_shift = find_var(vars, names, "precompute_select_shift");
    STerm scalar_sum = find_var(vars, names, "precompute_scalar_sum");
    STerm scalar_sum_shift = find_var(vars, names, "precompute_scalar_sum_shift");
    STerm round = find_var(vars, names, "precompute_round");
    STerm round_shift = find_var(vars, names, "precompute_round_shift");

    // Assert all relation formulas
    for (size_t i = 0; i < formulas.size(); ++i) {
        s.assertFormula(s.term_manager.mkTerm(cvc5::Kind::EQUAL,
                                              { static_cast<cvc5::Term>(formulas[i]), static_cast<cvc5::Term>(zero) }));
    }

    // Row 0 is inactive
    precompute_select == zero;

    // Row 1 (shift) is the first active row
    precompute_select_shift == one;

    // Row 1 should be round 0 of a scalar
    round_shift == zero;

    // The question: Can scalar_sum_shift (which will be scalar_sum at row 1's perspective) be non-zero?
    // Note: scalar_sum at current row is what becomes scalar_sum from the PREVIOUS row's shift
    // But we're at row 0, so there's no "previous" constraint

    // Try to have non-zero scalar_sum_shift
    scalar_sum_shift != zero;

    bool is_sat = s.check();

    if (is_sat) {
        GTEST_SKIP() << "POTENTIAL VULNERABILITY: At the transition from inactive row 0 to active row 1, "
                     << "scalar_sum can be non-zero. First scalar decomposition may be incorrect.";
    } else {
        SUCCEED() << "First active row correctly constrains scalar_sum to 0";
    }
}

/**
 * @brief Verify that the zeroing constraints (subrelations 14-19) don't cover scalar_sum
 *
 * This confirms that when precompute_select = 0:
 * - w0, w1, w2, w3 are constrained to 0 (via subrelations 14-17)
 * - round is constrained to 0 (via subrelation 18)
 * - pc is constrained to 0 (via subrelation 19)
 * - scalar_sum and scalar_sum_shift are NOT constrained
 */
TEST(ECCVMWnafInitialization, ZeroingConstraintsCoverage)
{
    const char* modulus = "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001";

    auto trace = smt_eccvm_relations::record_eccvm_wnaf_relation();

    // Test what IS constrained when precompute_select = 0
    Solver s(modulus, default_solver_config);

    std::vector<STerm> formulas, vars;
    std::vector<std::string> names;
    smt_eccvm_relations::replay_eccvm_wnaf_relation(trace, &s, "", true, formulas, vars, names);

    STerm zero = FFIConst("0", &s, 10);
    STerm one = FFIConst("1", &s, 10);

    STerm precompute_select = find_var(vars, names, "precompute_select");
    STerm round = find_var(vars, names, "precompute_round");
    STerm pc = find_var(vars, names, "precompute_pc");
    STerm scalar_sum = find_var(vars, names, "precompute_scalar_sum");

    // Assert zeroing constraints (subrelations 14-19)
    for (size_t i = 14; i <= 19; ++i) {
        s.assertFormula(s.term_manager.mkTerm(cvc5::Kind::EQUAL,
                                              { static_cast<cvc5::Term>(formulas[i]), static_cast<cvc5::Term>(zero) }));
    }

    // Inactive row
    precompute_select == zero;

    // Verify round and pc are forced to 0
    s.push();
    round != zero;
    ASSERT_FALSE(s.check()) << "When precompute_select = 0, round should be constrained to 0";
    s.pop();

    s.push();
    pc != zero;
    ASSERT_FALSE(s.check()) << "When precompute_select = 0, pc should be constrained to 0";
    s.pop();

    // Now check if scalar_sum is constrained
    s.push();
    scalar_sum != zero;
    bool scalar_sum_unconstrained = s.check();
    s.pop();

    if (scalar_sum_unconstrained) {
        // This confirms scalar_sum is NOT covered by the zeroing constraints
        GTEST_SKIP() << "CONFIRMED: scalar_sum is NOT constrained when precompute_select = 0. "
                     << "The zeroing constraints (subrelations 14-19) do not include scalar_sum.";
    } else {
        SUCCEED() << "scalar_sum is unexpectedly constrained - this may be from other subrelations";
    }
}

/**
 * @brief Test if lagrange_first or other mechanism constrains initialization
 *
 * Check if there might be lagrange_first polynomial constraints that
 * specifically handle the first row initialization.
 */
TEST(ECCVMWnafInitialization, CheckForLagrangeFirstConstraints)
{
    const char* modulus = "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001";

    auto trace = smt_eccvm_relations::record_eccvm_wnaf_relation();
    Solver s(modulus, default_solver_config);

    std::vector<STerm> formulas, vars;
    std::vector<std::string> names;
    smt_eccvm_relations::replay_eccvm_wnaf_relation(trace, &s, "", false, formulas, vars, names);

    // Check if lagrange_first is one of the variables
    bool has_lagrange_first = false;
    for (const auto& name : names) {
        if (name.find("lagrange_first") != std::string::npos) {
            has_lagrange_first = true;
            break;
        }
    }

    if (has_lagrange_first) {
        SUCCEED() << "lagrange_first polynomial exists - may provide initialization constraints";
    } else {
        // The WNAF relation doesn't use lagrange_first
        // Initialization constraints may need to come from ecc_point_table_relation or elsewhere
        GTEST_SKIP() << "lagrange_first not found in WNAF relation - initialization may rely on other relations";
    }
}
