/**
 * @file eccvm_lookup_relation.test.cpp
 * @brief SMT-based tests for the ECCVM Lookup relation.
 *
 * The Lookup relation handles log-derivative lookup table operations:
 * - Table writes: Point table entries {pc, slice, x, y}
 * - Table reads: MSM slice lookups
 *
 * It has 2 subrelations (both length 9):
 * - Subrelation 0: Grand product construction for log-derivative lookup
 * - Subrelation 1: Left-shiftable polynomial constraint
 */

#include "eccvm_relations.hpp"
#include <gtest/gtest.h>

using namespace smt_solver;
using namespace smt_terms;
using namespace smt_eccvm_relations;

// Solver configuration for lookup relation tests
static SolverConfiguration lookup_solver_config = { .produce_models = true,
                                                    .timeout = 30000,
                                                    .debug = false,
                                                    .ff_elim_disjunctive_bit = true,
                                                    .ff_solver = "gb",
                                                    .lookup_enabled = false };

/**
 * @brief Test that the Lookup relation has exactly 2 subrelations
 */
TEST(ECCVMLookupRelation, Has2Subrelations)
{
    auto trace = smt_eccvm_relations::record_eccvm_lookup_relation();
    ASSERT_EQ(trace.accumulator_results.size(), 2) << "Lookup relation should have 2 subrelations";
}

/**
 * @brief Test that relation parameters are symbolic
 */
TEST(ECCVMLookupRelation, RelationParametersAreSymbolic)
{
    const char* modulus = "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001";
    auto trace = smt_eccvm_relations::record_eccvm_lookup_relation();

    Solver s(modulus, lookup_solver_config);
    std::vector<STerm> formulas, vars;
    std::vector<std::string> names;
    smt_eccvm_relations::replay_eccvm_lookup_relation(trace, &s, "", false, formulas, vars, names);

    // Check that relation parameters are present
    bool found_gamma = false;
    bool found_beta = false;
    bool found_beta_sqr = false;
    bool found_beta_cube = false;
    for (const auto& name : names) {
        if (name == "gamma")
            found_gamma = true;
        if (name == "beta")
            found_beta = true;
        if (name == "beta_sqr")
            found_beta_sqr = true;
        if (name == "beta_cube")
            found_beta_cube = true;
    }

    ASSERT_TRUE(found_gamma) << "gamma should be a symbolic variable";
    ASSERT_TRUE(found_beta) << "beta should be a symbolic variable";
    ASSERT_TRUE(found_beta_sqr) << "beta_sqr should be a symbolic variable";
    ASSERT_TRUE(found_beta_cube) << "beta_cube should be a symbolic variable";
}

/**
 * @brief Test that lookup_inverses is a symbolic variable
 */
TEST(ECCVMLookupRelation, LookupInversesIsSymbolic)
{
    const char* modulus = "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001";
    auto trace = smt_eccvm_relations::record_eccvm_lookup_relation();

    Solver s(modulus, lookup_solver_config);
    std::vector<STerm> formulas, vars;
    std::vector<std::string> names;
    smt_eccvm_relations::replay_eccvm_lookup_relation(trace, &s, "", false, formulas, vars, names);

    bool found_lookup_inverses = false;
    for (const auto& name : names) {
        if (name == "lookup_inverses") {
            found_lookup_inverses = true;
            break;
        }
    }

    ASSERT_TRUE(found_lookup_inverses) << "lookup_inverses should be a symbolic variable";
}

/**
 * @brief Test that precompute_select affects the lookup writes
 */
TEST(ECCVMLookupRelation, PrecomputeSelectVariablePresent)
{
    const char* modulus = "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001";
    auto trace = smt_eccvm_relations::record_eccvm_lookup_relation();

    Solver s(modulus, lookup_solver_config);
    std::vector<STerm> formulas, vars;
    std::vector<std::string> names;
    smt_eccvm_relations::replay_eccvm_lookup_relation(trace, &s, "", false, formulas, vars, names);

    bool found_precompute_select = false;
    for (const auto& name : names) {
        if (name == "precompute_select") {
            found_precompute_select = true;
            break;
        }
    }

    ASSERT_TRUE(found_precompute_select) << "precompute_select should be a symbolic variable";
}

/**
 * @brief Test that MSM slice variables are present for reads
 */
TEST(ECCVMLookupRelation, MsmSliceVariablesPresent)
{
    const char* modulus = "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001";
    auto trace = smt_eccvm_relations::record_eccvm_lookup_relation();

    Solver s(modulus, lookup_solver_config);
    std::vector<STerm> formulas, vars;
    std::vector<std::string> names;
    smt_eccvm_relations::replay_eccvm_lookup_relation(trace, &s, "", false, formulas, vars, names);

    bool found_msm_slice1 = false;
    bool found_msm_x1 = false;
    bool found_msm_y1 = false;
    for (const auto& name : names) {
        if (name == "msm_slice1")
            found_msm_slice1 = true;
        if (name == "msm_x1")
            found_msm_x1 = true;
        if (name == "msm_y1")
            found_msm_y1 = true;
    }

    ASSERT_TRUE(found_msm_slice1) << "msm_slice1 should be a symbolic variable";
    ASSERT_TRUE(found_msm_x1) << "msm_x1 should be a symbolic variable";
    ASSERT_TRUE(found_msm_y1) << "msm_y1 should be a symbolic variable";
}

/**
 * @brief Test that subrelation 1 is satisfiable (simpler)
 *
 * Note: The full log-derivative lookup (subrelation 0) is complex and times out.
 * We test only the simpler left-shiftable polynomial constraint.
 */
TEST(ECCVMLookupRelation, Subrelation1IsSatisfiable)
{
    const char* modulus = "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001";
    auto trace = smt_eccvm_relations::record_eccvm_lookup_relation();

    Solver s(modulus, lookup_solver_config);
    std::vector<STerm> formulas, vars;
    std::vector<std::string> names;
    smt_eccvm_relations::replay_eccvm_lookup_relation(trace, &s, "", false, formulas, vars, names);

    STerm zero = FFConst("0", &s, 10);

    // Assert only subrelation 1 holds (simpler constraint)
    formulas[1] == zero;

    // Should be SAT with some valid assignment
    ASSERT_TRUE(s.check()) << "Subrelation 1 should be satisfiable";
}

/**
 * @brief Test that lookup_read_counts variables are present
 */
TEST(ECCVMLookupRelation, LookupReadCountsVariablesPresent)
{
    const char* modulus = "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001";
    auto trace = smt_eccvm_relations::record_eccvm_lookup_relation();

    Solver s(modulus, lookup_solver_config);
    std::vector<STerm> formulas, vars;
    std::vector<std::string> names;
    smt_eccvm_relations::replay_eccvm_lookup_relation(trace, &s, "", false, formulas, vars, names);

    bool found_read_counts_0 = false;
    bool found_read_counts_1 = false;
    for (const auto& name : names) {
        if (name == "lookup_read_counts_0")
            found_read_counts_0 = true;
        if (name == "lookup_read_counts_1")
            found_read_counts_1 = true;
    }

    ASSERT_TRUE(found_read_counts_0) << "lookup_read_counts_0 should be a symbolic variable";
    ASSERT_TRUE(found_read_counts_1) << "lookup_read_counts_1 should be a symbolic variable";
}

