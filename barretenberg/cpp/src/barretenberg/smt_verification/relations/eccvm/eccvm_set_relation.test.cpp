/**
 * @file eccvm_set_relation.test.cpp
 * @brief SMT-based tests for the ECCVM Set relation.
 *
 * The Set relation performs multiset equality checks between three tables:
 * 1. Precompute table (WNAF slices, point coordinates)
 * 2. MSM table (scalar multiplication results)
 * 3. Transcript table (VM operations)
 *
 * It has 2 subrelations:
 * - Subrelation 0 (degree 22): Grand product construction
 *   (z_perm + lagrange_first) * numerator - (z_perm_shift + lagrange_last) * denominator = 0
 * - Subrelation 1 (degree 3): Final z_perm constraint
 *   lagrange_last * z_perm_shift = 0
 *
 * This relation is critical for security as it validates that:
 * - WNAF decomposition matches scalar multipliers from transcript
 * - MSM outputs match what's recorded in transcript
 * - Point table entries are correctly linked
 */

#include "eccvm_relations.hpp"
#include <gtest/gtest.h>

using namespace smt_solver;
using namespace smt_terms;
using namespace smt_eccvm_relations;

// Helper function to find a variable by name
static STerm find_var(const std::vector<STerm>& vars, const std::vector<std::string>& names, const std::string& target)
{
    for (size_t i = 0; i < names.size(); ++i) {
        if (names[i] == target) {
            return vars[i];
        }
    }
    throw std::runtime_error("Variable not found: " + target);
}

// Solver configuration for set relation tests
static SolverConfiguration set_solver_config = { .produce_models = true,
                                                 .timeout = 30000,
                                                 .debug = false,
                                                 .ff_elim_disjunctive_bit = true,
                                                 .ff_solver = "gb",
                                                 .lookup_enabled = false };

/**
 * @brief Test that the Set relation has exactly 2 subrelations
 */
TEST(ECCVMSetRelation, Has2Subrelations)
{
    auto trace = smt_eccvm_relations::record_eccvm_set_relation();
    ASSERT_EQ(trace.accumulator_results.size(), 2) << "Set relation should have 2 subrelations";
}

/**
 * @brief Test that the final z_perm constraint is enforced
 *
 * Subrelation 1: lagrange_last * z_perm_shift = 0
 * At the last row, z_perm_shift must be 0 (the grand product must equal 1)
 */
TEST(ECCVMSetRelation, FinalZPermMustBeZero)
{
    const char* modulus = "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001";
    auto trace = smt_eccvm_relations::record_eccvm_set_relation();

    Solver s(modulus, set_solver_config);
    std::vector<STerm> formulas, vars;
    std::vector<std::string> names;
    smt_eccvm_relations::replay_eccvm_set_relation(trace, &s, "", false, formulas, vars, names);

    STerm lagrange_last = find_var(vars, names, "lagrange_last");
    STerm z_perm_shift = find_var(vars, names, "z_perm_shift");
    STerm zero = FFConst("0", &s, 10);
    STerm one = FFConst("1", &s, 10);

    // Assert subrelation 1 holds
    formulas[1] == zero;

    // At the last row (lagrange_last = 1)
    lagrange_last == one;

    // Try to set z_perm_shift != 0
    z_perm_shift != zero;

    // Should be UNSAT: at last row, z_perm_shift must be 0
    ASSERT_FALSE(s.check()) << "At last row, z_perm_shift must be 0";
}

/**
 * @brief Test that z_perm_shift can be non-zero when not at last row
 */
TEST(ECCVMSetRelation, ZPermShiftCanBeNonZeroWhenNotLastRow)
{
    const char* modulus = "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001";
    auto trace = smt_eccvm_relations::record_eccvm_set_relation();

    Solver s(modulus, set_solver_config);
    std::vector<STerm> formulas, vars;
    std::vector<std::string> names;
    smt_eccvm_relations::replay_eccvm_set_relation(trace, &s, "", false, formulas, vars, names);

    STerm lagrange_last = find_var(vars, names, "lagrange_last");
    STerm z_perm_shift = find_var(vars, names, "z_perm_shift");
    STerm zero = FFConst("0", &s, 10);
    STerm one = FFConst("1", &s, 10);

    // Assert subrelation 1 holds
    formulas[1] == zero;

    // Not at the last row (lagrange_last = 0)
    lagrange_last == zero;

    // Set z_perm_shift to a non-zero value
    z_perm_shift == FFConst("12345", &s, 10);

    // Should be SAT: z_perm_shift can be non-zero when not at last row
    ASSERT_TRUE(s.check()) << "z_perm_shift can be non-zero when lagrange_last = 0";
}

/**
 * @brief Test that subrelation 1 (simpler) is satisfiable
 *
 * Note: The full grand product (subrelation 0, degree 22) is too complex
 * for SMT verification within reasonable time limits.
 */
TEST(ECCVMSetRelation, Subrelation1IsSatisfiable)
{
    const char* modulus = "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001";
    auto trace = smt_eccvm_relations::record_eccvm_set_relation();

    Solver s(modulus, set_solver_config);
    std::vector<STerm> formulas, vars;
    std::vector<std::string> names;
    smt_eccvm_relations::replay_eccvm_set_relation(trace, &s, "", false, formulas, vars, names);

    STerm zero = FFConst("0", &s, 10);

    // Assert only subrelation 1 holds (degree 3, manageable)
    formulas[1] == zero;

    // Should be SAT with some valid assignment
    ASSERT_TRUE(s.check()) << "Subrelation 1 should be satisfiable";
}

/**
 * @brief Verify that z_perm variables are present
 *
 * The full grand product verification is too complex for SMT (degree 22).
 * We verify the key variables are present in the symbolic representation.
 */
TEST(ECCVMSetRelation, ZPermVariablesArePresent)
{
    const char* modulus = "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001";
    auto trace = smt_eccvm_relations::record_eccvm_set_relation();

    Solver s(modulus, set_solver_config);
    std::vector<STerm> formulas, vars;
    std::vector<std::string> names;
    smt_eccvm_relations::replay_eccvm_set_relation(trace, &s, "", false, formulas, vars, names);

    // Check that z_perm variables are present
    bool found_z_perm = false;
    bool found_z_perm_shift = false;
    for (const auto& name : names) {
        if (name == "z_perm")
            found_z_perm = true;
        if (name == "z_perm_shift")
            found_z_perm_shift = true;
    }

    ASSERT_TRUE(found_z_perm) << "z_perm should be a symbolic variable";
    ASSERT_TRUE(found_z_perm_shift) << "z_perm_shift should be a symbolic variable";
}

/**
 * @brief Test that relation parameters (gamma, beta) are symbolic
 */
TEST(ECCVMSetRelation, RelationParametersAreSymbolic)
{
    const char* modulus = "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001";
    auto trace = smt_eccvm_relations::record_eccvm_set_relation();

    Solver s(modulus, set_solver_config);
    std::vector<STerm> formulas, vars;
    std::vector<std::string> names;
    smt_eccvm_relations::replay_eccvm_set_relation(trace, &s, "", false, formulas, vars, names);

    // Check that relation parameters are present
    bool found_gamma = false;
    bool found_beta = false;
    for (const auto& name : names) {
        if (name == "gamma")
            found_gamma = true;
        if (name == "beta")
            found_beta = true;
    }

    ASSERT_TRUE(found_gamma) << "gamma should be a symbolic variable";
    ASSERT_TRUE(found_beta) << "beta should be a symbolic variable";
}

/**
 * @brief Verify that eccvm_set_permutation_delta is a symbolic variable
 *
 * The full grand product verification with precompute_select is too complex
 * for SMT due to degree 22 constraints. We just verify the parameter exists.
 */
TEST(ECCVMSetRelation, EccvmSetPermutationDeltaIsSymbolic)
{
    const char* modulus = "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001";
    auto trace = smt_eccvm_relations::record_eccvm_set_relation();

    Solver s(modulus, set_solver_config);
    std::vector<STerm> formulas, vars;
    std::vector<std::string> names;
    smt_eccvm_relations::replay_eccvm_set_relation(trace, &s, "", false, formulas, vars, names);

    // Check that eccvm_set_permutation_delta is present as a symbolic variable
    bool found_delta = false;
    for (const auto& name : names) {
        if (name == "eccvm_set_permutation_delta") {
            found_delta = true;
            break;
        }
    }

    ASSERT_TRUE(found_delta) << "eccvm_set_permutation_delta should be a symbolic variable";
}
