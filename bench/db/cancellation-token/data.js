window.BENCHMARK_DATA = {
  "lastUpdate": 1766507696539,
  "repoUrl": "https://github.com/AztecProtocol/aztec-packages",
  "entries": {
    "Aztec Benchmarks": [
      {
        "commit": {
          "author": {
            "name": "AztecProtocol",
            "username": "AztecProtocol"
          },
          "committer": {
            "name": "AztecProtocol",
            "username": "AztecProtocol"
          },
          "id": "1f9601f7f9a9f56e5a044ab1057e13db08753b3e",
          "message": "chore: public processor should not do slow Tx.clone - second attempt",
          "timestamp": "2025-12-23T15:48:03Z",
          "url": "https://github.com/AztecProtocol/aztec-packages/pull/19221/commits/1f9601f7f9a9f56e5a044ab1057e13db08753b3e"
        },
        "date": 1766507622633,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "barretenberg/cpp/bb-micro-bench/wasm/ultra_honk_zk/seconds",
            "value": 20765.111777,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/bb-micro-bench/wasm/ultra_honk_zk/memory",
            "value": "1496",
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/bb-micro-bench/wasm/chonk/seconds",
            "value": 38982.072582,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/bb-micro-bench/wasm/chonk/memory",
            "value": "1257",
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/bb-micro-bench/wasm/ultra_honk/seconds",
            "value": 16272.612506000001,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/bb-micro-bench/wasm/ultra_honk/memory",
            "value": "1461",
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/bb-micro-bench/native/ultra_honk_zk/seconds",
            "value": 7084.109530000205,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/bb-micro-bench/native/ultra_honk_zk/memory",
            "value": "1519",
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/bb-micro-bench/native/chonk/seconds",
            "value": 15681.376396999894,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/bb-micro-bench/native/chonk/memory",
            "value": "749",
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/bb-micro-bench/native/ultra_honk/seconds",
            "value": 7221.17210200031,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/bb-micro-bench/native/ultra_honk/memory",
            "value": "1332",
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/bb-micro-bench/native/chonk_verify/seconds",
            "value": 199.73248424992107,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/bb-micro-bench/native/chonk_verify/memory",
            "value": "742",
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+transfer_1_recursions+sponsored_fpc/wasm/seconds",
            "value": 22110,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+transfer_1_recursions+sponsored_fpc/wasm/memory",
            "value": 358,
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+transfer_1_recursions+sponsored_fpc/wasm/proof-size",
            "value": 49,
            "unit": "KB"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+transfer_1_recursions+sponsored_fpc/native/seconds",
            "value": 8516,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+transfer_1_recursions+sponsored_fpc/native/memory",
            "value": 317,
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+transfer_1_recursions+sponsored_fpc/native/proof-size",
            "value": 49,
            "unit": "KB"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+transfer_0_recursions+sponsored_fpc/chrome-wasm/memory",
            "value": 338.06,
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+transfer_0_recursions+sponsored_fpc/chrome-wasm/time",
            "value": 30011,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+transfer_0_recursions+sponsored_fpc/wasm/seconds",
            "value": 19030,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+transfer_0_recursions+sponsored_fpc/wasm/memory",
            "value": 347,
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+transfer_0_recursions+sponsored_fpc/wasm/proof-size",
            "value": 49,
            "unit": "KB"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+transfer_0_recursions+sponsored_fpc/native/seconds",
            "value": 8428,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+transfer_0_recursions+sponsored_fpc/native/memory",
            "value": 317,
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+transfer_0_recursions+sponsored_fpc/native/proof-size",
            "value": 49,
            "unit": "KB"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+token_bridge_claim_private+sponsored_fpc/wasm/seconds",
            "value": 22550,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+token_bridge_claim_private+sponsored_fpc/wasm/memory",
            "value": 355,
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+token_bridge_claim_private+sponsored_fpc/wasm/proof-size",
            "value": 48,
            "unit": "KB"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+token_bridge_claim_private+sponsored_fpc/native/seconds",
            "value": 9012,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+token_bridge_claim_private+sponsored_fpc/native/memory",
            "value": 314,
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+token_bridge_claim_private+sponsored_fpc/native/proof-size",
            "value": 48,
            "unit": "KB"
          },
          {
            "name": "barretenberg/cpp/app-proving/deploy_ecdsar1+sponsored_fpc/wasm/seconds",
            "value": 28724,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/app-proving/deploy_ecdsar1+sponsored_fpc/wasm/memory",
            "value": 900,
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/app-proving/deploy_ecdsar1+sponsored_fpc/wasm/proof-size",
            "value": 48,
            "unit": "KB"
          },
          {
            "name": "barretenberg/cpp/app-proving/deploy_ecdsar1+sponsored_fpc/native/seconds",
            "value": 9507,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/app-proving/deploy_ecdsar1+sponsored_fpc/native/memory",
            "value": 327,
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/app-proving/deploy_ecdsar1+sponsored_fpc/native/proof-size",
            "value": 48,
            "unit": "KB"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+transfer_1_recursions+private_fpc/wasm/seconds",
            "value": 36862,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+transfer_1_recursions+private_fpc/wasm/memory",
            "value": 620,
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+transfer_1_recursions+private_fpc/wasm/proof-size",
            "value": 51,
            "unit": "KB"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+transfer_1_recursions+private_fpc/native/seconds",
            "value": 15403,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+transfer_1_recursions+private_fpc/native/memory",
            "value": 572,
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+transfer_1_recursions+private_fpc/native/proof-size",
            "value": 50,
            "unit": "KB"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+amm_add_liquidity_1_recursions+sponsored_fpc/wasm/seconds",
            "value": 40888,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+amm_add_liquidity_1_recursions+sponsored_fpc/wasm/memory",
            "value": 603,
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+amm_add_liquidity_1_recursions+sponsored_fpc/wasm/proof-size",
            "value": 51,
            "unit": "KB"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+amm_add_liquidity_1_recursions+sponsored_fpc/native/seconds",
            "value": 15775,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+amm_add_liquidity_1_recursions+sponsored_fpc/native/memory",
            "value": 556,
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+amm_add_liquidity_1_recursions+sponsored_fpc/native/proof-size",
            "value": 51,
            "unit": "KB"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+deploy_tokenContract_with_registration+sponsored_fpc/wasm/seconds",
            "value": 25501,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+deploy_tokenContract_with_registration+sponsored_fpc/wasm/memory",
            "value": 539,
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+deploy_tokenContract_with_registration+sponsored_fpc/wasm/proof-size",
            "value": 48,
            "unit": "KB"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+deploy_tokenContract_with_registration+sponsored_fpc/native/seconds",
            "value": 10274,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+deploy_tokenContract_with_registration+sponsored_fpc/native/memory",
            "value": 502,
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+deploy_tokenContract_with_registration+sponsored_fpc/native/proof-size",
            "value": 48,
            "unit": "KB"
          },
          {
            "name": "barretenberg/cpp/app-proving/schnorr+deploy_tokenContract_with_registration+sponsored_fpc/wasm/seconds",
            "value": 24776,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/app-proving/schnorr+deploy_tokenContract_with_registration+sponsored_fpc/wasm/memory",
            "value": 542,
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/app-proving/schnorr+deploy_tokenContract_with_registration+sponsored_fpc/wasm/proof-size",
            "value": 48,
            "unit": "KB"
          },
          {
            "name": "barretenberg/cpp/app-proving/schnorr+deploy_tokenContract_with_registration+sponsored_fpc/native/seconds",
            "value": 9416,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/app-proving/schnorr+deploy_tokenContract_with_registration+sponsored_fpc/native/memory",
            "value": 481,
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/app-proving/schnorr+deploy_tokenContract_with_registration+sponsored_fpc/native/proof-size",
            "value": 48,
            "unit": "KB"
          },
          {
            "name": "barretenberg/cpp/app-proving/deploy_schnorr+sponsored_fpc/wasm/seconds",
            "value": 22936,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/app-proving/deploy_schnorr+sponsored_fpc/wasm/memory",
            "value": 352,
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/app-proving/deploy_schnorr+sponsored_fpc/wasm/proof-size",
            "value": 48,
            "unit": "KB"
          },
          {
            "name": "barretenberg/cpp/app-proving/deploy_schnorr+sponsored_fpc/native/seconds",
            "value": 9091,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/app-proving/deploy_schnorr+sponsored_fpc/native/memory",
            "value": 312,
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/app-proving/deploy_schnorr+sponsored_fpc/native/proof-size",
            "value": 48,
            "unit": "KB"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+transfer_0_recursions+private_fpc/wasm/seconds",
            "value": 32083,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+transfer_0_recursions+private_fpc/wasm/memory",
            "value": 530,
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+transfer_0_recursions+private_fpc/wasm/proof-size",
            "value": 50,
            "unit": "KB"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+transfer_0_recursions+private_fpc/native/seconds",
            "value": 12715,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+transfer_0_recursions+private_fpc/native/memory",
            "value": 489,
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/app-proving/ecdsar1+transfer_0_recursions+private_fpc/native/proof-size",
            "value": 50,
            "unit": "KB"
          },
          {
            "name": "barretenberg/sol/Add2HonkVerifier",
            "value": 959468,
            "unit": "gas"
          },
          {
            "name": "barretenberg/sol/Add2HonkZKVerifier",
            "value": 1871742,
            "unit": "gas"
          },
          {
            "name": "barretenberg/sol/BlakeHonkVerifier",
            "value": 1438985,
            "unit": "gas"
          },
          {
            "name": "barretenberg/sol/BlakeHonkZKVerifier",
            "value": 2418874,
            "unit": "gas"
          },
          {
            "name": "barretenberg/sol/EcdsaHonkVerifier",
            "value": 1494912,
            "unit": "gas"
          },
          {
            "name": "barretenberg/sol/EcdsaHonkZKVerifier",
            "value": 2482256,
            "unit": "gas"
          },
          {
            "name": "barretenberg/sol/RecursiveHonkVerifier",
            "value": 1700651,
            "unit": "gas"
          },
          {
            "name": "barretenberg/sol/RecursiveHonkZKVerifier",
            "value": 2717787,
            "unit": "gas"
          },
          {
            "name": "barretenberg/sol/BlakeOptHonkVerifier",
            "value": 585536,
            "unit": "gas"
          },
          {
            "name": "yarn-project/bb-prover/AvmTest/bulk_testing/0/totalDurationMs",
            "value": 288.67800099999977,
            "unit": "ms"
          },
          {
            "name": "yarn-project/bb-prover/AvmTest/bulk_testing/0/manaUsed",
            "value": 2036317,
            "unit": "mana"
          },
          {
            "name": "yarn-project/bb-prover/AvmTest/bulk_testing/0/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/bb-prover/AvmTest/bulk_testing/0/proverSimulationStepMs",
            "value": 624,
            "unit": "ms"
          },
          {
            "name": "yarn-project/bb-prover/AvmTest/bulk_testing/0/proverProvingStepMs",
            "value": 16635,
            "unit": "ms"
          },
          {
            "name": "yarn-project/bb-prover/AvmTest/bulk_testing/0/proverTraceGenerationStepMs",
            "value": 2893,
            "unit": "ms"
          },
          {
            "name": "yarn-project/bb-prover/AvmTest/bulk_testing/0/traceGenerationInteractionsMs",
            "value": 497,
            "unit": "ms"
          },
          {
            "name": "yarn-project/bb-prover/AvmTest/bulk_testing/0/traceGenerationTracesMs",
            "value": 2377,
            "unit": "ms"
          },
          {
            "name": "yarn-project/bb-prover/AvmTest/bulk_testing/0/provingSumcheckMs",
            "value": 6121,
            "unit": "ms"
          },
          {
            "name": "yarn-project/bb-prover/AvmTest/bulk_testing/0/provingPcsMs",
            "value": 2871,
            "unit": "ms"
          },
          {
            "name": "yarn-project/bb-prover/AvmTest/bulk_testing/0/provingLogDerivativeInverseMs",
            "value": 465,
            "unit": "ms"
          },
          {
            "name": "yarn-project/bb-prover/AvmTest/bulk_testing/0/provingLogDerivativeInverseCommitmentsMs",
            "value": 2104,
            "unit": "ms"
          },
          {
            "name": "yarn-project/bb-prover/AvmTest/bulk_testing/0/provingWireCommitmentsMs",
            "value": 3975,
            "unit": "ms"
          },
          {
            "name": "yarn-project/kv-store/Map/Individual insertion",
            "value": 2.147754839,
            "unit": "ms"
          },
          {
            "name": "yarn-project/kv-store/Map/Batch insertion of 1000 items",
            "value": 13.499447559999998,
            "unit": "ms"
          },
          {
            "name": "yarn-project/kv-store/Map/Individual read",
            "value": 59.18889719999997,
            "unit": "us"
          },
          {
            "name": "yarn-project/kv-store/Map/Iterator per item read of 10000 items",
            "value": 16.88233650000002,
            "unit": "us"
          },
          {
            "name": "yarn-project/kv-store/Map/Read size of 10000 items",
            "value": 385.5699489999997,
            "unit": "us"
          },
          {
            "name": "yarn-project/p2p/TxPool/1 txs/addTxs/dbSize_after_10_batches",
            "value": 1654784,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/p2p/TxPool/1 txs/addTxs/avg",
            "value": 17.9,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/1 txs/addTxs/p50",
            "value": 17,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/1 txs/addTxs/p95",
            "value": 24,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/1 txs/getTxsByHash/avg",
            "value": 4.4,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/1 txs/getTxsByHash/p50",
            "value": 4,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/1 txs/getTxsByHash/p95",
            "value": 6,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/1 txs/deleteTxs/avg",
            "value": 6.2,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/1 txs/deleteTxs/p50",
            "value": 6,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/1 txs/deleteTxs/p95",
            "value": 7,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/4 txs/addTxs/dbSize_after_10_batches",
            "value": 6520832,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/p2p/TxPool/4 txs/addTxs/avg",
            "value": 49,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/4 txs/addTxs/p50",
            "value": 48,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/4 txs/addTxs/p95",
            "value": 53,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/4 txs/getTxsByHash/avg",
            "value": 13.5,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/4 txs/getTxsByHash/p50",
            "value": 13,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/4 txs/getTxsByHash/p95",
            "value": 15,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/4 txs/deleteTxs/avg",
            "value": 18.8,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/4 txs/deleteTxs/p50",
            "value": 18,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/4 txs/deleteTxs/p95",
            "value": 22,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/8 txs/addTxs/dbSize_after_10_batches",
            "value": 12992512,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/p2p/TxPool/8 txs/addTxs/avg",
            "value": 92.9,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/8 txs/addTxs/p50",
            "value": 88,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/8 txs/addTxs/p95",
            "value": 136,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/8 txs/getTxsByHash/avg",
            "value": 26.8,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/8 txs/getTxsByHash/p50",
            "value": 27,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/8 txs/getTxsByHash/p95",
            "value": 28,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/8 txs/deleteTxs/avg",
            "value": 33.6,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/8 txs/deleteTxs/p50",
            "value": 33,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/8 txs/deleteTxs/p95",
            "value": 36,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/20 txs/addTxs/dbSize_after_10_batches",
            "value": 32374784,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/p2p/TxPool/20 txs/addTxs/avg",
            "value": 210.3,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/20 txs/addTxs/p50",
            "value": 204,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/20 txs/addTxs/p95",
            "value": 243,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/20 txs/getTxsByHash/avg",
            "value": 80.2,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/20 txs/getTxsByHash/p50",
            "value": 76,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/20 txs/getTxsByHash/p95",
            "value": 115,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/20 txs/deleteTxs/avg",
            "value": 76,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/20 txs/deleteTxs/p50",
            "value": 75,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/20 txs/deleteTxs/p95",
            "value": 80,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/40 txs/addTxs/dbSize_after_10_batches",
            "value": 64671744,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/p2p/TxPool/40 txs/addTxs/avg",
            "value": 414,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/40 txs/addTxs/p50",
            "value": 402,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/40 txs/addTxs/p95",
            "value": 460,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/40 txs/getTxsByHash/avg",
            "value": 155.3,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/40 txs/getTxsByHash/p50",
            "value": 145,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/40 txs/getTxsByHash/p95",
            "value": 204,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/40 txs/deleteTxs/avg",
            "value": 151.2,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/40 txs/deleteTxs/p50",
            "value": 152,
            "unit": "ms"
          },
          {
            "name": "yarn-project/p2p/TxPool/40 txs/deleteTxs/p95",
            "value": 155,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/Sequencer/aztec.sequencer.block.build_duration",
            "value": 599,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/Sequencer/aztec.sequencer.block.time_per_mana",
            "value": 0.024810740569592576,
            "unit": "us/mana"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+token_bridge_claim_private+sponsored_fpc/witgen",
            "value": 2347.5794349999924,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+token_bridge_claim_private+sponsored_fpc/total",
            "value": 2804.73789199999,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+token_bridge_claim_private+sponsored_fpc/sync",
            "value": 3.735370000009425,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+token_bridge_claim_private+sponsored_fpc/unaccounted",
            "value": 453.4230869999883,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+token_bridge_claim_private+sponsored_fpc/total_gate_count",
            "value": 807441,
            "unit": "gates"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+token_bridge_claim_private+sponsored_fpc/rpc",
            "value": 0,
            "unit": "calls"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+transfer_0_recursions+sponsored_fpc/witgen",
            "value": 1757.423186,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+transfer_0_recursions+sponsored_fpc/total",
            "value": 2260.981431999993,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+transfer_0_recursions+sponsored_fpc/sync",
            "value": 32.63148999999976,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+transfer_0_recursions+sponsored_fpc/unaccounted",
            "value": 470.9267559999935,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+transfer_0_recursions+sponsored_fpc/total_gate_count",
            "value": 635351,
            "unit": "gates"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+transfer_0_recursions+sponsored_fpc/rpc",
            "value": 0,
            "unit": "calls"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+transfer_0_recursions+private_fpc/witgen",
            "value": 4001.3193539999775,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+transfer_0_recursions+private_fpc/total",
            "value": 5071.762937000007,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+transfer_0_recursions+private_fpc/sync",
            "value": 12.33412299999327,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+transfer_0_recursions+private_fpc/unaccounted",
            "value": 1058.109460000036,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+transfer_0_recursions+private_fpc/total_gate_count",
            "value": 1309160,
            "unit": "gates"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+transfer_0_recursions+private_fpc/rpc",
            "value": 0,
            "unit": "calls"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+amm_add_liquidity_1_recursions+sponsored_fpc/witgen",
            "value": 5187.139970000004,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+amm_add_liquidity_1_recursions+sponsored_fpc/total",
            "value": 6476.294362000044,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+amm_add_liquidity_1_recursions+sponsored_fpc/sync",
            "value": 36.04866299999412,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+amm_add_liquidity_1_recursions+sponsored_fpc/unaccounted",
            "value": 1253.1057290000463,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+amm_add_liquidity_1_recursions+sponsored_fpc/total_gate_count",
            "value": 1841895,
            "unit": "gates"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+amm_add_liquidity_1_recursions+sponsored_fpc/rpc",
            "value": 0,
            "unit": "calls"
          },
          {
            "name": "yarn-project/end-to-end/schnorr+deploy_tokenContract_with_registration+sponsored_fpc/witgen",
            "value": 2548.4767759999813,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/schnorr+deploy_tokenContract_with_registration+sponsored_fpc/total",
            "value": 2797.189925999999,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/schnorr+deploy_tokenContract_with_registration+sponsored_fpc/sync",
            "value": 8.575704000002588,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/schnorr+deploy_tokenContract_with_registration+sponsored_fpc/unaccounted",
            "value": 240.1374460000152,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/schnorr+deploy_tokenContract_with_registration+sponsored_fpc/total_gate_count",
            "value": 896606,
            "unit": "gates"
          },
          {
            "name": "yarn-project/end-to-end/schnorr+deploy_tokenContract_with_registration+sponsored_fpc/rpc",
            "value": 0,
            "unit": "calls"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+transfer_1_recursions+private_fpc/witgen",
            "value": 5039.543460999994,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+transfer_1_recursions+private_fpc/total",
            "value": 6397.692991999997,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+transfer_1_recursions+private_fpc/sync",
            "value": 10.286040000006324,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+transfer_1_recursions+private_fpc/unaccounted",
            "value": 1347.8634909999964,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+transfer_1_recursions+private_fpc/total_gate_count",
            "value": 1578688,
            "unit": "gates"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+transfer_1_recursions+private_fpc/rpc",
            "value": 0,
            "unit": "calls"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Private Transfer/Snappy/Compression Duration",
            "value": 0.09939912000001641,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Private Transfer/Snappy/Decompression Duration",
            "value": 0.0929334000000381,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Private Transfer/Snappy/Compressed Size",
            "value": 55812,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Private Transfer/Snappy/Uncompressed Size",
            "value": 105507,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Private Transfer/Snappy/Chonk Proof Size",
            "value": 62820,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Private Transfer/Snappy/Chonk Proof Size Compressed",
            "value": 51349,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Private Transfer/Zstd/Compression Duration",
            "value": 0.5845971799999825,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Private Transfer/Zstd/Decompression Duration",
            "value": 0.31989747999992685,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Private Transfer/Zstd/Compressed Size",
            "value": 49529,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Private Transfer/Zstd/Uncompressed Size",
            "value": 105507,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Private Transfer/Zstd/Chonk Proof Size",
            "value": 62820,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Private Transfer/Zstd/Chonk Proof Size Compressed",
            "value": 47194,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Private Transfer/Deflate/Compression Duration",
            "value": 1.1977810600001249,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Private Transfer/Deflate/Decompression Duration",
            "value": 0.2316380599999684,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Private Transfer/Deflate/Compressed Size",
            "value": 50614,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Private Transfer/Deflate/Uncompressed Size",
            "value": 105507,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Private Transfer/Deflate/Chonk Proof Size",
            "value": 62820,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Private Transfer/Deflate/Chonk Proof Size Compressed",
            "value": 48001,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Private Transfer/Brotli/Compression Duration",
            "value": 262.07934998000013,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Private Transfer/Brotli/Decompression Duration",
            "value": 0.5339388200000394,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Private Transfer/Brotli/Compressed Size",
            "value": 48851,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Private Transfer/Brotli/Uncompressed Size",
            "value": 105507,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Private Transfer/Brotli/Chonk Proof Size",
            "value": 62820,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Private Transfer/Brotli/Chonk Proof Size Compressed",
            "value": 46492,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Public Transfer/Snappy/Compression Duration",
            "value": 0.12671716000011657,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Public Transfer/Snappy/Decompression Duration",
            "value": 0.14703758000017841,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Public Transfer/Snappy/Compressed Size",
            "value": 55829,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Public Transfer/Snappy/Uncompressed Size",
            "value": 153964,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Public Transfer/Snappy/Chonk Proof Size",
            "value": 62820,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Public Transfer/Snappy/Chonk Proof Size Compressed",
            "value": 51332,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Public Transfer/Zstd/Compression Duration",
            "value": 0.5572560800000792,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Public Transfer/Zstd/Decompression Duration",
            "value": 0.22283385999995517,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Public Transfer/Zstd/Compressed Size",
            "value": 47540,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Public Transfer/Zstd/Uncompressed Size",
            "value": 153964,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Public Transfer/Zstd/Chonk Proof Size",
            "value": 62820,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Public Transfer/Zstd/Chonk Proof Size Compressed",
            "value": 46972,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Public Transfer/Deflate/Compression Duration",
            "value": 1.290055439999851,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Public Transfer/Deflate/Decompression Duration",
            "value": 0.21825849999993807,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Public Transfer/Deflate/Compressed Size",
            "value": 49123,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Public Transfer/Deflate/Uncompressed Size",
            "value": 153964,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Public Transfer/Deflate/Chonk Proof Size",
            "value": 62820,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Public Transfer/Deflate/Chonk Proof Size Compressed",
            "value": 47997,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Public Transfer/Brotli/Compression Duration",
            "value": 244.4739132200001,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Public Transfer/Brotli/Decompression Duration",
            "value": 0.5538097399999969,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Public Transfer/Brotli/Compressed Size",
            "value": 47108,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Public Transfer/Brotli/Uncompressed Size",
            "value": 153964,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Public Transfer/Brotli/Chonk Proof Size",
            "value": 62820,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx Compression/Public Transfer/Brotli/Chonk Proof Size Compressed",
            "value": 46494,
            "unit": "bytes"
          },
          {
            "name": "yarn-project/end-to-end/Tx IVC Verification/Single Private Transaction/IVC Verification Time",
            "value": 270.58870075000084,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/Tx IVC Verification/Single Private Transaction/Total Verification Time (includes serde)",
            "value": 275.94913470000245,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/Tx IVC Verification/Single Public Transaction/IVC Verification Time",
            "value": 252.09071544999605,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/Tx IVC Verification/Single Public Transaction/Total Verification Time (includes serde)",
            "value": 257.31989744999737,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/Tx IVC Verification/60 Seconds @10TPS/Avg IVC Verification Time",
            "value": 258.06481298500074,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/Tx IVC Verification/60 Seconds @10TPS/Min IVC Verification Time",
            "value": 242.91466599999694,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/Tx IVC Verification/60 Seconds @10TPS/Max IVC Verification Time",
            "value": 1135.864143999992,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/Tx IVC Verification/60 Seconds @10TPS/Avg Total Verification Time (includes serde)",
            "value": 264.02059306666655,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/Tx IVC Verification/60 Seconds @10TPS/Min Total Verification Time  (includes serde)",
            "value": 246.01397400000133,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/Tx IVC Verification/60 Seconds @10TPS/Max Total Verification Time  (includes serde)",
            "value": 1139.2531369999924,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/Tx IVC Verification/60 Seconds @10TPS/Overall Tx Verification Time",
            "value": 60278.42928499999,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/deploy_ecdsar1+sponsored_fpc/witgen",
            "value": 2288.310207999988,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/deploy_ecdsar1+sponsored_fpc/total",
            "value": 2584.925747999998,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/deploy_ecdsar1+sponsored_fpc/sync",
            "value": 9.973511000000144,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/deploy_ecdsar1+sponsored_fpc/unaccounted",
            "value": 286.64202900000964,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/deploy_ecdsar1+sponsored_fpc/total_gate_count",
            "value": 891878,
            "unit": "gates"
          },
          {
            "name": "yarn-project/end-to-end/deploy_ecdsar1+sponsored_fpc/rpc",
            "value": 0,
            "unit": "calls"
          },
          {
            "name": "yarn-project/end-to-end/deploy_schnorr+sponsored_fpc/witgen",
            "value": 2250.744632999995,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/deploy_schnorr+sponsored_fpc/total",
            "value": 2545.9923169999856,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/deploy_schnorr+sponsored_fpc/sync",
            "value": 12.246744000000035,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/deploy_schnorr+sponsored_fpc/unaccounted",
            "value": 283.0009399999908,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/deploy_schnorr+sponsored_fpc/total_gate_count",
            "value": 818026,
            "unit": "gates"
          },
          {
            "name": "yarn-project/end-to-end/deploy_schnorr+sponsored_fpc/rpc",
            "value": 0,
            "unit": "calls"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+deploy_tokenContract_with_registration+sponsored_fpc/witgen",
            "value": 2541.438752000009,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+deploy_tokenContract_with_registration+sponsored_fpc/total",
            "value": 2820.285339000002,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+deploy_tokenContract_with_registration+sponsored_fpc/sync",
            "value": 11.953659999999218,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+deploy_tokenContract_with_registration+sponsored_fpc/unaccounted",
            "value": 266.8929269999935,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+deploy_tokenContract_with_registration+sponsored_fpc/total_gate_count",
            "value": 964009,
            "unit": "gates"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+deploy_tokenContract_with_registration+sponsored_fpc/rpc",
            "value": 0,
            "unit": "calls"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+transfer_1_recursions+sponsored_fpc/witgen",
            "value": 2699.5639089999895,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+transfer_1_recursions+sponsored_fpc/total",
            "value": 3409.994842,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+transfer_1_recursions+sponsored_fpc/sync",
            "value": 21.065701999992598,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+transfer_1_recursions+sponsored_fpc/unaccounted",
            "value": 689.365231000018,
            "unit": "ms"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+transfer_1_recursions+sponsored_fpc/total_gate_count",
            "value": 827924,
            "unit": "gates"
          },
          {
            "name": "yarn-project/end-to-end/ecdsar1+transfer_1_recursions+sponsored_fpc/rpc",
            "value": 0,
            "unit": "calls"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/1_block, 8 transactions_single_epoch/avg_latency",
            "value": 55.345015838709706,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/1_block, 8 transactions_single_epoch/median_latency",
            "value": 54.871122000000014,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/1_block, 8 transactions_single_epoch/p95_latency",
            "value": 59.056399000000056,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/1_block, 8 transactions_single_epoch/total_duration",
            "value": 60.686499999999796,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/1_block, 8 transactions_single_epoch/jobs_per_sec",
            "value": 510.8220114852579,
            "unit": "jobs/s"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/1_block, 8 transactions_random_epochs/avg_latency",
            "value": 12.522974967741947,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/1_block, 8 transactions_random_epochs/median_latency",
            "value": 10.091969000000063,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/1_block, 8 transactions_random_epochs/p95_latency",
            "value": 10.402515000000221,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/1_block, 8 transactions_random_epochs/total_duration",
            "value": 56.0160350000001,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/1_block, 8 transactions_random_epochs/jobs_per_sec",
            "value": 553.4129646984107,
            "unit": "jobs/s"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/1_block, 8 transactions_interleaved_epochs/avg_latency",
            "value": 10.72160022580641,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/1_block, 8 transactions_interleaved_epochs/median_latency",
            "value": 9.466848999999911,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/1_block, 8 transactions_interleaved_epochs/p95_latency",
            "value": 9.526174999999967,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/1_block, 8 transactions_interleaved_epochs/total_duration",
            "value": 55.95313899999974,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/1_block, 8 transactions_interleaved_epochs/jobs_per_sec",
            "value": 554.0350470775222,
            "unit": "jobs/s"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/6_blocks, 48 transactions_single_epoch/avg_latency",
            "value": 28.92360787581699,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/6_blocks, 48 transactions_single_epoch/median_latency",
            "value": 22.436389999999847,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/6_blocks, 48 transactions_single_epoch/p95_latency",
            "value": 50.62105199999996,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/6_blocks, 48 transactions_single_epoch/total_duration",
            "value": 66.099604,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/6_blocks, 48 transactions_single_epoch/jobs_per_sec",
            "value": 2314.6886023704465,
            "unit": "jobs/s"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/6_blocks, 48 transactions_random_epochs/avg_latency",
            "value": 21.811111581699343,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/6_blocks, 48 transactions_random_epochs/median_latency",
            "value": 21.739884000000075,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/6_blocks, 48 transactions_random_epochs/p95_latency",
            "value": 26.65856900000017,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/6_blocks, 48 transactions_random_epochs/total_duration",
            "value": 73.1061450000002,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/6_blocks, 48 transactions_random_epochs/jobs_per_sec",
            "value": 2092.84732494101,
            "unit": "jobs/s"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/6_blocks, 48 transactions_interleaved_epochs/avg_latency",
            "value": 25.076401013071894,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/6_blocks, 48 transactions_interleaved_epochs/median_latency",
            "value": 24.849974000000202,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/6_blocks, 48 transactions_interleaved_epochs/p95_latency",
            "value": 27.607344999999896,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/6_blocks, 48 transactions_interleaved_epochs/total_duration",
            "value": 74.63356699999986,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/6_blocks, 48 transactions_interleaved_epochs/jobs_per_sec",
            "value": 2050.0159130810443,
            "unit": "jobs/s"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/20_blocks, 400 transactions_single_epoch/avg_latency",
            "value": 109.66649755045117,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/20_blocks, 400 transactions_single_epoch/median_latency",
            "value": 109.982935,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/20_blocks, 400 transactions_single_epoch/p95_latency",
            "value": 183.32939899999974,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/20_blocks, 400 transactions_single_epoch/total_duration",
            "value": 235.4472310000001,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/20_blocks, 400 transactions_single_epoch/jobs_per_sec",
            "value": 5177.380913857507,
            "unit": "jobs/s"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/20_blocks, 400 transactions_random_epochs/avg_latency",
            "value": 134.43458936751443,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/20_blocks, 400 transactions_random_epochs/median_latency",
            "value": 133.09078899999986,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/20_blocks, 400 transactions_random_epochs/p95_latency",
            "value": 164.5142890000002,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/20_blocks, 400 transactions_random_epochs/total_duration",
            "value": 267.2357710000001,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/20_blocks, 400 transactions_random_epochs/jobs_per_sec",
            "value": 4561.515082499937,
            "unit": "jobs/s"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/20_blocks, 400 transactions_interleaved_epochs/avg_latency",
            "value": 172.9560962879413,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/20_blocks, 400 transactions_interleaved_epochs/median_latency",
            "value": 173.41723299999967,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/20_blocks, 400 transactions_interleaved_epochs/p95_latency",
            "value": 185.42805700000008,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/20_blocks, 400 transactions_interleaved_epochs/total_duration",
            "value": 343.34583699999985,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/20_blocks, 400 transactions_interleaved_epochs/jobs_per_sec",
            "value": 3550.3561384377604,
            "unit": "jobs/s"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/32_blocks, 6400 transactions_single_epoch/avg_latency",
            "value": 1243.376693542789,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/32_blocks, 6400 transactions_single_epoch/median_latency",
            "value": 1237.803452,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/32_blocks, 6400 transactions_single_epoch/p95_latency",
            "value": 1862.5923599999996,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/32_blocks, 6400 transactions_single_epoch/total_duration",
            "value": 2478.339733,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/32_blocks, 6400 transactions_single_epoch/jobs_per_sec",
            "value": 7754.788314165321,
            "unit": "jobs/s"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/32_blocks, 6400 transactions_random_epochs/avg_latency",
            "value": 1904.5890989110876,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/32_blocks, 6400 transactions_random_epochs/median_latency",
            "value": 1915.618405000001,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/32_blocks, 6400 transactions_random_epochs/p95_latency",
            "value": 2004.3948469999996,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/32_blocks, 6400 transactions_random_epochs/total_duration",
            "value": 3753.573587,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/32_blocks, 6400 transactions_random_epochs/jobs_per_sec",
            "value": 5120.187350678946,
            "unit": "jobs/s"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/32_blocks, 6400 transactions_interleaved_epochs/avg_latency",
            "value": 2851.265067438157,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/32_blocks, 6400 transactions_interleaved_epochs/median_latency",
            "value": 2877.2558419999987,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/32_blocks, 6400 transactions_interleaved_epochs/p95_latency",
            "value": 3396.927785,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/32_blocks, 6400 transactions_interleaved_epochs/total_duration",
            "value": 5561.892159999999,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/32_blocks, 6400 transactions_interleaved_epochs/jobs_per_sec",
            "value": 3455.4787196737025,
            "unit": "jobs/s"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/32_blocks, 12,800 transactions_single_epoch/avg_latency",
            "value": 2882.285607106993,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/32_blocks, 12,800 transactions_single_epoch/median_latency",
            "value": 2924.6641139999992,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/32_blocks, 12,800 transactions_single_epoch/p95_latency",
            "value": 3998.082460999998,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/32_blocks, 12,800 transactions_single_epoch/total_duration",
            "value": 5598.222110999999,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/32_blocks, 12,800 transactions_single_epoch/jobs_per_sec",
            "value": 6860.392324294474,
            "unit": "jobs/s"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/32_blocks, 12,800 transactions_random_epochs/avg_latency",
            "value": 4637.641204905195,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/32_blocks, 12,800 transactions_random_epochs/median_latency",
            "value": 4700.042867,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/32_blocks, 12,800 transactions_random_epochs/p95_latency",
            "value": 4807.114893000002,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/32_blocks, 12,800 transactions_random_epochs/total_duration",
            "value": 9003.922779999997,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/32_blocks, 12,800 transactions_random_epochs/jobs_per_sec",
            "value": 4265.4741648062,
            "unit": "jobs/s"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/32_blocks, 12,800 transactions_interleaved_epochs/avg_latency",
            "value": 6415.708631324762,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/32_blocks, 12,800 transactions_interleaved_epochs/median_latency",
            "value": 6496.226375999999,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/32_blocks, 12,800 transactions_interleaved_epochs/p95_latency",
            "value": 7815.791837999997,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/32_blocks, 12,800 transactions_interleaved_epochs/total_duration",
            "value": 12558.248572999997,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/enqueue/32_blocks, 12,800 transactions_interleaved_epochs/jobs_per_sec",
            "value": 3058.2290019782054,
            "unit": "jobs/s"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/minimum_epoch_1agents_1agents/queue_empty_time",
            "value": 1.0401829999973415,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/minimum_epoch_1agents_1agents/avg_dequeue_latency",
            "value": 0.030081354838799715,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/minimum_epoch_1agents_1agents/median_dequeue_latency",
            "value": 0.01460199999564793,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/minimum_epoch_1agents_1agents/p95_dequeue_latency",
            "value": 0.049832999997306615,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/minimum_epoch_10agents_10agents/queue_empty_time",
            "value": 0.7226379999992787,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/minimum_epoch_10agents_10agents/avg_dequeue_latency",
            "value": 0.17049454838824232,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/minimum_epoch_10agents_10agents/median_dequeue_latency",
            "value": 0.1753030000036233,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/minimum_epoch_10agents_10agents/p95_dequeue_latency",
            "value": 0.1867050000000745,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/minimum_epoch_50agents_50agents/queue_empty_time",
            "value": 1.1827550000016345,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/minimum_epoch_50agents_50agents/avg_dequeue_latency",
            "value": 0.721291064516399,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/minimum_epoch_50agents_50agents/median_dequeue_latency",
            "value": 0.7293379999973695,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/minimum_epoch_50agents_50agents/p95_dequeue_latency",
            "value": 0.7907829999967362,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/small_epoch_1agents_1agents/queue_empty_time",
            "value": 2.0576040000014473,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/small_epoch_1agents_1agents/avg_dequeue_latency",
            "value": 0.012825738562075452,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/small_epoch_1agents_1agents/median_dequeue_latency",
            "value": 0.011341000004904345,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/small_epoch_1agents_1agents/p95_dequeue_latency",
            "value": 0.016831000000820495,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/small_epoch_10agents_10agents/queue_empty_time",
            "value": 2.0460729999977048,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/small_epoch_10agents_10agents/avg_dequeue_latency",
            "value": 0.12320991503266888,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/small_epoch_10agents_10agents/median_dequeue_latency",
            "value": 0.11719900000025518,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/small_epoch_10agents_10agents/p95_dequeue_latency",
            "value": 0.14899200000218116,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/small_epoch_50agents_50agents/queue_empty_time",
            "value": 2.601278000001912,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/small_epoch_50agents_50agents/avg_dequeue_latency",
            "value": 0.6281789019611608,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/small_epoch_50agents_50agents/median_dequeue_latency",
            "value": 0.6034680000011576,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/small_epoch_50agents_50agents/p95_dequeue_latency",
            "value": 0.7520500000027823,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/medium_epoch_1agents_1agents/queue_empty_time",
            "value": 15.59926500000438,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/medium_epoch_1agents_1agents/avg_dequeue_latency",
            "value": 0.01232046513519932,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/medium_epoch_1agents_1agents/median_dequeue_latency",
            "value": 0.01102099999843631,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/medium_epoch_1agents_1agents/p95_dequeue_latency",
            "value": 0.012989999995625112,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/medium_epoch_10agents_10agents/queue_empty_time",
            "value": 12.377008000003116,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/medium_epoch_10agents_10agents/avg_dequeue_latency",
            "value": 0.0997900730106265,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/medium_epoch_10agents_10agents/median_dequeue_latency",
            "value": 0.09643800000048941,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/medium_epoch_10agents_10agents/p95_dequeue_latency",
            "value": 0.11606899999605957,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/medium_epoch_50agents_50agents/queue_empty_time",
            "value": 14.641989000003377,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/medium_epoch_50agents_50agents/avg_dequeue_latency",
            "value": 0.57453768826908,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/medium_epoch_50agents_50agents/median_dequeue_latency",
            "value": 0.5041500000006636,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/medium_epoch_50agents_50agents/p95_dequeue_latency",
            "value": 0.6510720000005676,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/large_epoch_1agents_1agents/queue_empty_time",
            "value": 203.543995,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/large_epoch_1agents_1agents/avg_dequeue_latency",
            "value": 0.010245633851895197,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/large_epoch_1agents_1agents/median_dequeue_latency",
            "value": 0.009461000001465436,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/large_epoch_1agents_1agents/p95_dequeue_latency",
            "value": 0.010780999997223262,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/large_epoch_10agents_10agents/queue_empty_time",
            "value": 205.46753799999715,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/large_epoch_10agents_10agents/avg_dequeue_latency",
            "value": 0.10648923253025908,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/large_epoch_10agents_10agents/median_dequeue_latency",
            "value": 0.09959699999308214,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/large_epoch_10agents_10agents/p95_dequeue_latency",
            "value": 0.11761899999692105,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/large_epoch_50agents_50agents/queue_empty_time",
            "value": 213.4408140000014,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/large_epoch_50agents_50agents/avg_dequeue_latency",
            "value": 0.5532992813361873,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/large_epoch_50agents_50agents/median_dequeue_latency",
            "value": 0.5233220000009169,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/large_epoch_50agents_50agents/p95_dequeue_latency",
            "value": 0.7242079999996349,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/maximum_epoch_1agents_1agents/queue_empty_time",
            "value": 428.9929869999978,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/maximum_epoch_1agents_1agents/avg_dequeue_latency",
            "value": 0.010820238165934092,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/maximum_epoch_1agents_1agents/median_dequeue_latency",
            "value": 0.009940999996615574,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/maximum_epoch_1agents_1agents/p95_dequeue_latency",
            "value": 0.011060999997425824,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/maximum_epoch_10agents_10agents/queue_empty_time",
            "value": 429.7129649999988,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/maximum_epoch_10agents_10agents/avg_dequeue_latency",
            "value": 0.11150517325414615,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/maximum_epoch_10agents_10agents/median_dequeue_latency",
            "value": 0.10411899999598972,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/maximum_epoch_10agents_10agents/p95_dequeue_latency",
            "value": 0.12279999999736901,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/maximum_epoch_50agents_50agents/queue_empty_time",
            "value": 448.2229490000027,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/maximum_epoch_50agents_50agents/avg_dequeue_latency",
            "value": 0.5823262512107423,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/maximum_epoch_50agents_50agents/median_dequeue_latency",
            "value": 0.5524350000050617,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/dequeue/maximum_epoch_50agents_50agents/p95_dequeue_latency",
            "value": 0.5933070000028238,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/initialization/minimum_epoch/startup_time",
            "value": 21.814727999997558,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/initialization/minimum_epoch/jobs_per_sec",
            "value": 1421.0582868603024,
            "unit": "jobs/s"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/initialization/minimum_epoch/no_epoch_deletion_cleanup_time",
            "value": 0.03265199999441393,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/initialization/minimum_epoch/full_epoch_deletion_cleanup_time",
            "value": 1.1132490000018151,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/initialization/small_epoch/startup_time",
            "value": 71.5396810000093,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/initialization/small_epoch/jobs_per_sec",
            "value": 2138.6732210894274,
            "unit": "jobs/s"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/initialization/small_epoch/no_epoch_deletion_cleanup_time",
            "value": 0.06763499999942724,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/initialization/small_epoch/full_epoch_deletion_cleanup_time",
            "value": 0.7043260000064038,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/initialization/medium_epoch/startup_time",
            "value": 525.8546940000087,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/initialization/medium_epoch/jobs_per_sec",
            "value": 2318.1308713391077,
            "unit": "jobs/s"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/initialization/medium_epoch/no_epoch_deletion_cleanup_time",
            "value": 0.30512399999133777,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/initialization/medium_epoch/full_epoch_deletion_cleanup_time",
            "value": 1.4954690000013215,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/initialization/large_epoch/startup_time",
            "value": 8204.553256,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/initialization/large_epoch/jobs_per_sec",
            "value": 2342.479767066552,
            "unit": "jobs/s"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/initialization/large_epoch/no_epoch_deletion_cleanup_time",
            "value": 2.307654000003822,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/initialization/large_epoch/full_epoch_deletion_cleanup_time",
            "value": 8.730176000011852,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/initialization/maximum_epoch/startup_time",
            "value": 17304.255850999994,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/initialization/maximum_epoch/jobs_per_sec",
            "value": 2219.45400777119,
            "unit": "jobs/s"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/initialization/maximum_epoch/no_epoch_deletion_cleanup_time",
            "value": 3.8077049999992596,
            "unit": "ms"
          },
          {
            "name": "yarn-project/prover-client/proving_broker/initialization/maximum_epoch/full_epoch_deletion_cleanup_time",
            "value": 19.074798000001465,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/constructor/0/totalDurationMs",
            "value": 195.7813839999999,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/constructor/0/manaUsed",
            "value": 412668,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/constructor/0/totalInstructionsExecuted",
            "value": 18293,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/constructor/0/nonRevertiblePrivateInsertionsUs",
            "value": 3816.9840000000477,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/constructor/0/revertiblePrivateInsertionsUs",
            "value": 207.39600000024438,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/mint_to_public/1/totalDurationMs",
            "value": 41.16254000000026,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/mint_to_public/1/manaUsed",
            "value": 30545,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/mint_to_public/1/totalInstructionsExecuted",
            "value": 1243,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/mint_to_public/1/nonRevertiblePrivateInsertionsUs",
            "value": 2319.2940000003546,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/mint_to_public/1/revertiblePrivateInsertionsUs",
            "value": 190.33500000023196,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/balance_of_public/2/totalDurationMs",
            "value": 32.448175999999876,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/balance_of_public/2/manaUsed",
            "value": 11112,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/balance_of_public/2/totalInstructionsExecuted",
            "value": 502,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/balance_of_public/2/nonRevertiblePrivateInsertionsUs",
            "value": 2107.8370000000177,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/balance_of_public/2/revertiblePrivateInsertionsUs",
            "value": 69.64500000003682,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/transfer_in_public/3/totalDurationMs",
            "value": 38.30376299999989,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/transfer_in_public/3/manaUsed",
            "value": 39707,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/transfer_in_public/3/totalInstructionsExecuted",
            "value": 1680,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/transfer_in_public/3/nonRevertiblePrivateInsertionsUs",
            "value": 1933.1039999997301,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/transfer_in_public/3/revertiblePrivateInsertionsUs",
            "value": 64.62499999997817,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/balance_of_public/4/totalDurationMs",
            "value": 27.775473000000147,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/balance_of_public/4/manaUsed",
            "value": 11112,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/balance_of_public/4/totalInstructionsExecuted",
            "value": 502,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/balance_of_public/4/nonRevertiblePrivateInsertionsUs",
            "value": 2486.797999999908,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/balance_of_public/4/revertiblePrivateInsertionsUs",
            "value": 124.3200000003526,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/balance_of_public/5/totalDurationMs",
            "value": 24.606521000000157,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/balance_of_public/5/manaUsed",
            "value": 11112,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/balance_of_public/5/totalInstructionsExecuted",
            "value": 502,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/balance_of_public/5/nonRevertiblePrivateInsertionsUs",
            "value": 2011.471000000256,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/balance_of_public/5/revertiblePrivateInsertionsUs",
            "value": 59.944999999970605,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/burn_public/6/totalDurationMs",
            "value": 32.63212999999996,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/burn_public/6/manaUsed",
            "value": 24749,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/burn_public/6/totalInstructionsExecuted",
            "value": 972,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/burn_public/6/nonRevertiblePrivateInsertionsUs",
            "value": 1749.2489999999634,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/burn_public/6/revertiblePrivateInsertionsUs",
            "value": 75.63600000003134,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/balance_of_public/7/totalDurationMs",
            "value": 26.17331699999977,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/balance_of_public/7/manaUsed",
            "value": 11112,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/balance_of_public/7/totalInstructionsExecuted",
            "value": 502,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/balance_of_public/7/nonRevertiblePrivateInsertionsUs",
            "value": 1855.5380000002515,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/Token contract tests/Token/balance_of_public/7/revertiblePrivateInsertionsUs",
            "value": 57.28499999986525,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/Token/constructor/0/totalDurationMs",
            "value": 146.91815799999995,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/Token/constructor/0/manaUsed",
            "value": 412668,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/Token/constructor/0/totalInstructionsExecuted",
            "value": 18293,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/Token/constructor/0/nonRevertiblePrivateInsertionsUs",
            "value": 1862.6680000002125,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/Token/constructor/0/revertiblePrivateInsertionsUs",
            "value": 60.974999999871216,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/Token/constructor/1/totalDurationMs",
            "value": 119.72770200000014,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/Token/constructor/1/manaUsed",
            "value": 412668,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/Token/constructor/1/totalInstructionsExecuted",
            "value": 18293,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/Token/constructor/1/nonRevertiblePrivateInsertionsUs",
            "value": 2007.9500000001644,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/Token/constructor/1/revertiblePrivateInsertionsUs",
            "value": 58.97499999991851,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/Token/constructor/2/totalDurationMs",
            "value": 120.15499599999976,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/Token/constructor/2/manaUsed",
            "value": 412668,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/Token/constructor/2/totalInstructionsExecuted",
            "value": 18293,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/Token/constructor/2/nonRevertiblePrivateInsertionsUs",
            "value": 1845.7279999997809,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/Token/constructor/2/revertiblePrivateInsertionsUs",
            "value": 59.883999999783555,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/AMM/constructor/3/totalDurationMs",
            "value": 48.68834100000004,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/AMM/constructor/3/manaUsed",
            "value": 54222,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/AMM/constructor/3/totalInstructionsExecuted",
            "value": 1969,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/AMM/constructor/3/nonRevertiblePrivateInsertionsUs",
            "value": 2104.1880000002493,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/AMM/constructor/3/revertiblePrivateInsertionsUs",
            "value": 59.96400000003632,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/AMM/set_minter/4/totalDurationMs",
            "value": 24.62698300000011,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/AMM/set_minter/4/manaUsed",
            "value": 13729,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/AMM/set_minter/4/totalInstructionsExecuted",
            "value": 544,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/AMM/set_minter/4/nonRevertiblePrivateInsertionsUs",
            "value": 1711.5960000000996,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/AMM/set_minter/4/revertiblePrivateInsertionsUs",
            "value": 57.63500000011845,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/AMM/add_liquidity/5/totalDurationMs",
            "value": 116.04111900000044,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/AMM/add_liquidity/5/manaUsed",
            "value": 159585,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/AMM/add_liquidity/5/totalInstructionsExecuted",
            "value": 5972,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/AMM/add_liquidity/5/nonRevertiblePrivateInsertionsUs",
            "value": 1858.6089999998876,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/AMM/add_liquidity/5/revertiblePrivateInsertionsUs",
            "value": 63.50499999962267,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/AMM/swap_exact_tokens_for_tokens/6/totalDurationMs",
            "value": 76.03315999999995,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/AMM/swap_exact_tokens_for_tokens/6/manaUsed",
            "value": 96003,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/AMM/swap_exact_tokens_for_tokens/6/totalInstructionsExecuted",
            "value": 3655,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/AMM/swap_exact_tokens_for_tokens/6/nonRevertiblePrivateInsertionsUs",
            "value": 1898.251000000073,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/AMM/swap_exact_tokens_for_tokens/6/revertiblePrivateInsertionsUs",
            "value": 57.1340000001328,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/AMM/remove_liquidity/7/totalDurationMs",
            "value": 128.21814900000027,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/AMM/remove_liquidity/7/manaUsed",
            "value": 177796,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/AMM/remove_liquidity/7/totalInstructionsExecuted",
            "value": 6633,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/AMM/remove_liquidity/7/nonRevertiblePrivateInsertionsUs",
            "value": 2007.409999999254,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AMM contract tests/AMM/remove_liquidity/7/revertiblePrivateInsertionsUs",
            "value": 58.58399999942776,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmTest contract tests/AvmTest/bulk_testing/0/totalDurationMs",
            "value": 459.51447199999984,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AvmTest contract tests/AvmTest/bulk_testing/0/manaUsed",
            "value": 2036317,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AvmTest contract tests/AvmTest/bulk_testing/0/totalInstructionsExecuted",
            "value": 86864,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AvmTest contract tests/AvmTest/bulk_testing/0/nonRevertiblePrivateInsertionsUs",
            "value": 3465.655999999399,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmTest contract tests/AvmTest/bulk_testing/0/revertiblePrivateInsertionsUs",
            "value": 2992.1379999996134,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmTest contract tests/AvmTest/mega_bulk_testing/0/totalDurationMs",
            "value": 1169.450291,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AvmTest contract tests/AvmTest/mega_bulk_testing/0/manaUsed",
            "value": 5175135,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AvmTest contract tests/AvmTest/mega_bulk_testing/0/totalInstructionsExecuted",
            "value": 191106,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AvmTest contract tests/AvmTest/mega_bulk_testing/0/nonRevertiblePrivateInsertionsUs",
            "value": 2949.254999999539,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmTest contract tests/AvmTest/mega_bulk_testing/0/revertiblePrivateInsertionsUs",
            "value": 3033.661999999822,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmTest contract tests/AvmTest/nested_call_large_calldata/0/totalDurationMs",
            "value": 237.9632649999994,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AvmTest contract tests/AvmTest/nested_call_large_calldata/0/manaUsed",
            "value": 1347378,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AvmTest contract tests/AvmTest/nested_call_large_calldata/0/totalInstructionsExecuted",
            "value": 62969,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AvmTest contract tests/AvmTest/nested_call_large_calldata/0/nonRevertiblePrivateInsertionsUs",
            "value": 1761.6109999999026,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmTest contract tests/AvmTest/nested_call_large_calldata/0/revertiblePrivateInsertionsUs",
            "value": 59.70500000057655,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_10/0/totalDurationMs",
            "value": 46.824211000000105,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_10/0/manaUsed",
            "value": 105210,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_10/0/totalInstructionsExecuted",
            "value": 4334,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_10/0/nonRevertiblePrivateInsertionsUs",
            "value": 1784.3119999997725,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_10/0/revertiblePrivateInsertionsUs",
            "value": 66.90600000001723,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_20/0/totalDurationMs",
            "value": 48.96306199999981,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_20/0/manaUsed",
            "value": 125265,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_20/0/totalInstructionsExecuted",
            "value": 5151,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_20/0/nonRevertiblePrivateInsertionsUs",
            "value": 1662.4119999996765,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_20/0/revertiblePrivateInsertionsUs",
            "value": 60.54500000027474,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_30/0/totalDurationMs",
            "value": 50.058898999999656,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_30/0/manaUsed",
            "value": 151521,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_30/0/totalInstructionsExecuted",
            "value": 6279,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_30/0/nonRevertiblePrivateInsertionsUs",
            "value": 1568.0249999995794,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_30/0/revertiblePrivateInsertionsUs",
            "value": 72.74600000073406,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_40/0/totalDurationMs",
            "value": 53.07562000000053,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_40/0/manaUsed",
            "value": 175026,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_40/0/totalInstructionsExecuted",
            "value": 7293,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_40/0/nonRevertiblePrivateInsertionsUs",
            "value": 1535.613000000012,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_40/0/revertiblePrivateInsertionsUs",
            "value": 60.9150000000227,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_50/0/totalDurationMs",
            "value": 69.55202300000019,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_50/0/manaUsed",
            "value": 201408,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_50/0/totalInstructionsExecuted",
            "value": 8423,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_50/0/nonRevertiblePrivateInsertionsUs",
            "value": 2028.6919999998645,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_50/0/revertiblePrivateInsertionsUs",
            "value": 65.08500000018103,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_60/0/totalDurationMs",
            "value": 68.8688089999996,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_60/0/manaUsed",
            "value": 239517,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_60/0/totalInstructionsExecuted",
            "value": 9535,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_60/0/nonRevertiblePrivateInsertionsUs",
            "value": 6676.311999999598,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_60/0/revertiblePrivateInsertionsUs",
            "value": 67.84600000173668,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_70/0/totalDurationMs",
            "value": 67.82990600000085,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_70/0/manaUsed",
            "value": 277131,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_70/0/totalInstructionsExecuted",
            "value": 11032,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_70/0/nonRevertiblePrivateInsertionsUs",
            "value": 1754.4199999992998,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_70/0/revertiblePrivateInsertionsUs",
            "value": 56.56499999895459,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_80/0/totalDurationMs",
            "value": 69.80613300000005,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_80/0/manaUsed",
            "value": 301962,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_80/0/totalInstructionsExecuted",
            "value": 12086,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_80/0/nonRevertiblePrivateInsertionsUs",
            "value": 1528.9219999995112,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_80/0/revertiblePrivateInsertionsUs",
            "value": 67.66500000048836,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_90/0/totalDurationMs",
            "value": 73.1498100000008,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_90/0/manaUsed",
            "value": 329598,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_90/0/totalInstructionsExecuted",
            "value": 13255,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_90/0/nonRevertiblePrivateInsertionsUs",
            "value": 1535.012000000279,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_90/0/revertiblePrivateInsertionsUs",
            "value": 56.553999998868676,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_100/0/totalDurationMs",
            "value": 77.80852199999936,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_100/0/manaUsed",
            "value": 354429,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_100/0/totalInstructionsExecuted",
            "value": 14309,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_100/0/nonRevertiblePrivateInsertionsUs",
            "value": 1531.1120000005758,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_100/0/revertiblePrivateInsertionsUs",
            "value": 61.58499999946798,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_255/0/totalDurationMs",
            "value": 135.14620099999956,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_255/0/manaUsed",
            "value": 807798,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_255/0/totalInstructionsExecuted",
            "value": 31943,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_255/0/nonRevertiblePrivateInsertionsUs",
            "value": 1785.9730000000127,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_255/0/revertiblePrivateInsertionsUs",
            "value": 59.675000000424916,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_256/0/totalDurationMs",
            "value": 137.68205300000045,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_256/0/manaUsed",
            "value": 807990,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_256/0/totalInstructionsExecuted",
            "value": 32261,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_256/0/nonRevertiblePrivateInsertionsUs",
            "value": 1683.3239999996295,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_256/0/revertiblePrivateInsertionsUs",
            "value": 55.97499999930733,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_511/0/totalDurationMs",
            "value": 236.0705739999994,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_511/0/manaUsed",
            "value": 1541757,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_511/0/totalInstructionsExecuted",
            "value": 60940,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_511/0/nonRevertiblePrivateInsertionsUs",
            "value": 1736.5179999997054,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_511/0/revertiblePrivateInsertionsUs",
            "value": 58.434000000488595,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_512/0/totalDurationMs",
            "value": 235.8845990000009,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_512/0/manaUsed",
            "value": 1546128,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_512/0/totalInstructionsExecuted",
            "value": 61354,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_512/0/nonRevertiblePrivateInsertionsUs",
            "value": 1800.2440000000206,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_512/0/revertiblePrivateInsertionsUs",
            "value": 62.20500000017637,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_1024/0/totalDurationMs",
            "value": 430.0777760000001,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_1024/0/manaUsed",
            "value": 3014337,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_1024/0/totalInstructionsExecuted",
            "value": 119526,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_1024/0/nonRevertiblePrivateInsertionsUs",
            "value": 1795.243999999002,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_1024/0/revertiblePrivateInsertionsUs",
            "value": 58.70399999912479,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_1536/0/totalDurationMs",
            "value": 616.3085380000011,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_1536/0/manaUsed",
            "value": 4482654,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_1536/0/totalInstructionsExecuted",
            "value": 177699,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_1536/0/nonRevertiblePrivateInsertionsUs",
            "value": 1715.8570000010513,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_1536/0/revertiblePrivateInsertionsUs",
            "value": 73.63599999916914,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/keccak_hash/0/totalDurationMs",
            "value": 61.91784499999994,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/keccak_hash/0/manaUsed",
            "value": 266127,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/keccak_hash/0/totalInstructionsExecuted",
            "value": 8959,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/keccak_hash/0/nonRevertiblePrivateInsertionsUs",
            "value": 1875.7900000000518,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/keccak_hash/0/revertiblePrivateInsertionsUs",
            "value": 57.664999998451094,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/keccak_hash_1400/0/totalDurationMs",
            "value": 677.5657499999998,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/keccak_hash_1400/0/manaUsed",
            "value": 5099175,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/keccak_hash_1400/0/totalInstructionsExecuted",
            "value": 194571,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/keccak_hash_1400/0/nonRevertiblePrivateInsertionsUs",
            "value": 1757.8799999992043,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/keccak_hash_1400/0/revertiblePrivateInsertionsUs",
            "value": 62.67499999921711,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/keccak_f1600/0/totalDurationMs",
            "value": 41.75616799999989,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/keccak_f1600/0/manaUsed",
            "value": 123084,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/keccak_f1600/0/totalInstructionsExecuted",
            "value": 3003,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/keccak_f1600/0/nonRevertiblePrivateInsertionsUs",
            "value": 2329.3050000011135,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/keccak_f1600/0/revertiblePrivateInsertionsUs",
            "value": 58.75500000001921,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/poseidon2_hash/0/totalDurationMs",
            "value": 39.208074000000124,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/poseidon2_hash/0/manaUsed",
            "value": 47805,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/poseidon2_hash/0/totalInstructionsExecuted",
            "value": 2263,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/poseidon2_hash/0/nonRevertiblePrivateInsertionsUs",
            "value": 2205.646999998862,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/poseidon2_hash/0/revertiblePrivateInsertionsUs",
            "value": 56.81499999991502,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/poseidon2_hash_1000fields/0/totalDurationMs",
            "value": 599.8221250000006,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/poseidon2_hash_1000fields/0/manaUsed",
            "value": 3730149,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/poseidon2_hash_1000fields/0/totalInstructionsExecuted",
            "value": 175319,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/poseidon2_hash_1000fields/0/nonRevertiblePrivateInsertionsUs",
            "value": 2308.2059999997,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/poseidon2_hash_1000fields/0/revertiblePrivateInsertionsUs",
            "value": 59.52400000023772,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/pedersen_hash/0/totalDurationMs",
            "value": 396.56674499999826,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/pedersen_hash/0/manaUsed",
            "value": 432249,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/pedersen_hash/0/totalInstructionsExecuted",
            "value": 22736,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/pedersen_hash/0/nonRevertiblePrivateInsertionsUs",
            "value": 1682.0349999998143,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/pedersen_hash/0/revertiblePrivateInsertionsUs",
            "value": 56.684999999561114,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/pedersen_hash_with_index/0/totalDurationMs",
            "value": 327.5142969999997,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/pedersen_hash_with_index/0/manaUsed",
            "value": 433203,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/pedersen_hash_with_index/0/totalInstructionsExecuted",
            "value": 22771,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/pedersen_hash_with_index/0/nonRevertiblePrivateInsertionsUs",
            "value": 1701.3459999998304,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/AvmGadgetsTest contract tests/AvmGadgetsTest/pedersen_hash_with_index/0/revertiblePrivateInsertionsUs",
            "value": 64.70599999920523,
            "unit": "us"
          },
          {
            "name": "yarn-project/simulator/Cpp Token contract tests/Token/constructor/0/totalDurationMs",
            "value": 30.226284000000305,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp Token contract tests/Token/constructor/0/manaUsed",
            "value": 412668,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp Token contract tests/Token/constructor/0/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp Token contract tests/Token/mint_to_public/1/totalDurationMs",
            "value": 12.805856999999378,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp Token contract tests/Token/mint_to_public/1/manaUsed",
            "value": 30545,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp Token contract tests/Token/mint_to_public/1/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp Token contract tests/Token/balance_of_public/2/totalDurationMs",
            "value": 9.192807999999786,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp Token contract tests/Token/balance_of_public/2/manaUsed",
            "value": 11112,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp Token contract tests/Token/balance_of_public/2/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp Token contract tests/Token/transfer_in_public/3/totalDurationMs",
            "value": 12.102501000001212,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp Token contract tests/Token/transfer_in_public/3/manaUsed",
            "value": 39707,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp Token contract tests/Token/transfer_in_public/3/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp Token contract tests/Token/balance_of_public/4/totalDurationMs",
            "value": 9.402103000000352,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp Token contract tests/Token/balance_of_public/4/manaUsed",
            "value": 11112,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp Token contract tests/Token/balance_of_public/4/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp Token contract tests/Token/balance_of_public/5/totalDurationMs",
            "value": 10.518863000001147,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp Token contract tests/Token/balance_of_public/5/manaUsed",
            "value": 11112,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp Token contract tests/Token/balance_of_public/5/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp Token contract tests/Token/burn_public/6/totalDurationMs",
            "value": 10.627952999999252,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp Token contract tests/Token/burn_public/6/manaUsed",
            "value": 24749,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp Token contract tests/Token/burn_public/6/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp Token contract tests/Token/balance_of_public/7/totalDurationMs",
            "value": 8.789254999999685,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp Token contract tests/Token/balance_of_public/7/manaUsed",
            "value": 11112,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp Token contract tests/Token/balance_of_public/7/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AMM contract tests/Token/constructor/0/totalDurationMs",
            "value": 27.36843399999998,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AMM contract tests/Token/constructor/0/manaUsed",
            "value": 412668,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AMM contract tests/Token/constructor/0/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AMM contract tests/Token/constructor/1/totalDurationMs",
            "value": 27.593802999999753,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AMM contract tests/Token/constructor/1/manaUsed",
            "value": 412668,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AMM contract tests/Token/constructor/1/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AMM contract tests/Token/constructor/2/totalDurationMs",
            "value": 28.67120900000009,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AMM contract tests/Token/constructor/2/manaUsed",
            "value": 412668,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AMM contract tests/Token/constructor/2/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AMM contract tests/AMM/constructor/3/totalDurationMs",
            "value": 14.64207499999975,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AMM contract tests/AMM/constructor/3/manaUsed",
            "value": 54222,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AMM contract tests/AMM/constructor/3/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AMM contract tests/AMM/set_minter/4/totalDurationMs",
            "value": 9.926126999998814,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AMM contract tests/AMM/set_minter/4/manaUsed",
            "value": 13729,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AMM contract tests/AMM/set_minter/4/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AMM contract tests/AMM/add_liquidity/5/totalDurationMs",
            "value": 22.723502000000735,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AMM contract tests/AMM/add_liquidity/5/manaUsed",
            "value": 159585,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AMM contract tests/AMM/add_liquidity/5/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AMM contract tests/AMM/swap_exact_tokens_for_tokens/6/totalDurationMs",
            "value": 17.023925000001327,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AMM contract tests/AMM/swap_exact_tokens_for_tokens/6/manaUsed",
            "value": 96003,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AMM contract tests/AMM/swap_exact_tokens_for_tokens/6/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AMM contract tests/AMM/remove_liquidity/7/totalDurationMs",
            "value": 23.80685900000026,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AMM contract tests/AMM/remove_liquidity/7/manaUsed",
            "value": 177796,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AMM contract tests/AMM/remove_liquidity/7/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmTest contract tests/AvmTest/bulk_testing/0/totalDurationMs",
            "value": 70.16310700000031,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmTest contract tests/AvmTest/bulk_testing/0/manaUsed",
            "value": 2036317,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmTest contract tests/AvmTest/bulk_testing/0/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmTest contract tests/AvmTest/mega_bulk_testing/0/totalDurationMs",
            "value": 173.33034099999713,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmTest contract tests/AvmTest/mega_bulk_testing/0/manaUsed",
            "value": 5175135,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmTest contract tests/AvmTest/mega_bulk_testing/0/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmTest contract tests/AvmTest/nested_call_large_calldata/0/totalDurationMs",
            "value": 37.314063000001624,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmTest contract tests/AvmTest/nested_call_large_calldata/0/manaUsed",
            "value": 1347378,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmTest contract tests/AvmTest/nested_call_large_calldata/0/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_10/0/totalDurationMs",
            "value": 11.54845700000078,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_10/0/manaUsed",
            "value": 105210,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_10/0/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_20/0/totalDurationMs",
            "value": 11.04723599999852,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_20/0/manaUsed",
            "value": 125265,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_20/0/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_30/0/totalDurationMs",
            "value": 11.821908000001713,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_30/0/manaUsed",
            "value": 151521,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_30/0/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_40/0/totalDurationMs",
            "value": 12.103671000000759,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_40/0/manaUsed",
            "value": 175026,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_40/0/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_50/0/totalDurationMs",
            "value": 12.833909000000858,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_50/0/manaUsed",
            "value": 201408,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_50/0/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_60/0/totalDurationMs",
            "value": 13.969529999998485,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_60/0/manaUsed",
            "value": 239517,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_60/0/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_70/0/totalDurationMs",
            "value": 13.679027000001952,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_70/0/manaUsed",
            "value": 277131,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_70/0/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_80/0/totalDurationMs",
            "value": 14.692458000001352,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_80/0/manaUsed",
            "value": 301962,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_80/0/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_90/0/totalDurationMs",
            "value": 14.970611000000645,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_90/0/manaUsed",
            "value": 329598,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_90/0/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_100/0/totalDurationMs",
            "value": 15.1913080000013,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_100/0/manaUsed",
            "value": 354429,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_100/0/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_255/0/totalDurationMs",
            "value": 24.102963000001182,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_255/0/manaUsed",
            "value": 807798,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_255/0/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_256/0/totalDurationMs",
            "value": 23.879195000001346,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_256/0/manaUsed",
            "value": 807990,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_256/0/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_511/0/totalDurationMs",
            "value": 37.50909800000227,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_511/0/manaUsed",
            "value": 1541757,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_511/0/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_512/0/totalDurationMs",
            "value": 37.104756000000634,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_512/0/manaUsed",
            "value": 1546128,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_512/0/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_1024/0/totalDurationMs",
            "value": 64.42898699999932,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_1024/0/manaUsed",
            "value": 3014337,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_1024/0/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_1536/0/totalDurationMs",
            "value": 92.00188899999921,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_1536/0/manaUsed",
            "value": 4482654,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/sha256_hash_1536/0/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/keccak_hash/0/totalDurationMs",
            "value": 13.345860999997967,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/keccak_hash/0/manaUsed",
            "value": 266127,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/keccak_hash/0/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/keccak_hash_1400/0/totalDurationMs",
            "value": 97.2364579999994,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/keccak_hash_1400/0/manaUsed",
            "value": 5099175,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/keccak_hash_1400/0/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/keccak_f1600/0/totalDurationMs",
            "value": 10.425686000002315,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/keccak_f1600/0/manaUsed",
            "value": 123084,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/keccak_f1600/0/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/poseidon2_hash/0/totalDurationMs",
            "value": 9.999181999999564,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/poseidon2_hash/0/manaUsed",
            "value": 47805,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/poseidon2_hash/0/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/poseidon2_hash_1000fields/0/totalDurationMs",
            "value": 91.08673500000077,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/poseidon2_hash_1000fields/0/manaUsed",
            "value": 3730149,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/poseidon2_hash_1000fields/0/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/pedersen_hash/0/totalDurationMs",
            "value": 55.170774999998685,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/pedersen_hash/0/manaUsed",
            "value": 433095,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/pedersen_hash/0/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/pedersen_hash_with_index/0/totalDurationMs",
            "value": 54.46276800000123,
            "unit": "ms"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/pedersen_hash_with_index/0/manaUsed",
            "value": 432411,
            "unit": "mana"
          },
          {
            "name": "yarn-project/simulator/Cpp AvmGadgetsTest contract tests/AvmGadgetsTest/pedersen_hash_with_index/0/totalInstructionsExecuted",
            "value": 0,
            "unit": "#instructions"
          },
          {
            "name": "yarn-project/world-state/Block Sync/36 txs/1 leaves per tx",
            "value": 87.63713899999993,
            "unit": "ms"
          },
          {
            "name": "yarn-project/world-state/Block Sync/36 txs/8 leaves per tx",
            "value": 109.00230199999987,
            "unit": "ms"
          },
          {
            "name": "yarn-project/world-state/Block Sync/36 txs/64 leaves per tx",
            "value": 297.12824049999927,
            "unit": "ms"
          },
          {
            "name": "yarn-project/world-state/Block Sync/360 txs/8 leaves per tx",
            "value": 738.335454,
            "unit": "ms"
          },
          {
            "name": "yarn-project/world-state/Tree Insertion/PUBLIC_DATA_TREE/SEQUENTIAL/1 leaves",
            "value": 1.0975473749999765,
            "unit": "ms"
          },
          {
            "name": "yarn-project/world-state/Tree Insertion/PUBLIC_DATA_TREE/SEQUENTIAL/8 leaves",
            "value": 4.996601937500145,
            "unit": "ms"
          },
          {
            "name": "yarn-project/world-state/Tree Insertion/PUBLIC_DATA_TREE/SEQUENTIAL/64 leaves",
            "value": 38.49309399999993,
            "unit": "ms"
          },
          {
            "name": "yarn-project/world-state/Tree Insertion/NULLIFIER_TREE/BATCH/1 leaves",
            "value": 5.831138875000079,
            "unit": "ms"
          },
          {
            "name": "yarn-project/world-state/Tree Insertion/NULLIFIER_TREE/BATCH/8 leaves",
            "value": 7.576196937499844,
            "unit": "ms"
          },
          {
            "name": "yarn-project/world-state/Tree Insertion/NULLIFIER_TREE/BATCH/64 leaves",
            "value": 24.503982687499956,
            "unit": "ms"
          },
          {
            "name": "yarn-project/world-state/Tree Insertion/NOTE_HASH_TREE/BATCH/1 leaves",
            "value": 1.5603363750001336,
            "unit": "ms"
          },
          {
            "name": "yarn-project/world-state/Tree Insertion/NOTE_HASH_TREE/BATCH/8 leaves",
            "value": 1.5806286249999175,
            "unit": "ms"
          },
          {
            "name": "yarn-project/world-state/Tree Insertion/NOTE_HASH_TREE/BATCH/64 leaves",
            "value": 1.592220187500061,
            "unit": "ms"
          },
          {
            "name": "yarn-project/world-state/Data Retrieval/SIBLING_PATH",
            "value": 129.93205175781242,
            "unit": "us"
          },
          {
            "name": "yarn-project/world-state/Data Retrieval/LEAF_PREIMAGE",
            "value": 141.0602128906291,
            "unit": "us"
          },
          {
            "name": "yarn-project/world-state/Data Retrieval/LEAF_VALUE",
            "value": 107.44239355468466,
            "unit": "us"
          },
          {
            "name": "yarn-project/world-state/Data Retrieval/LEAF_INDICES",
            "value": 79.88208984374978,
            "unit": "us"
          },
          {
            "name": "yarn-project/world-state/Data Retrieval/LOW_LEAF",
            "value": 74.11782031250169,
            "unit": "us"
          },
          {
            "name": "yarn-project/stdlib/Tx/private/getTxHash/avg",
            "value": 9.15,
            "unit": "ms"
          },
          {
            "name": "yarn-project/stdlib/Tx/private/getTxHash/p50",
            "value": 9,
            "unit": "ms"
          },
          {
            "name": "yarn-project/stdlib/Tx/private/getTxHash/p95",
            "value": 10,
            "unit": "ms"
          },
          {
            "name": "yarn-project/stdlib/Tx/public/getTxHash/avg",
            "value": 18.61,
            "unit": "ms"
          },
          {
            "name": "yarn-project/stdlib/Tx/public/getTxHash/p50",
            "value": 19,
            "unit": "ms"
          },
          {
            "name": "yarn-project/stdlib/Tx/public/getTxHash/p95",
            "value": 19,
            "unit": "ms"
          },
          {
            "name": "l1-contracts/alpha/no_validators/gasPerSecond",
            "value": 7306.3,
            "unit": "gas/second"
          },
          {
            "name": "l1-contracts/alpha/no_validators/propose",
            "value": 219131,
            "unit": "gas"
          },
          {
            "name": "l1-contracts/alpha/no_validators/setupEpoch",
            "value": 31963,
            "unit": "gas"
          },
          {
            "name": "l1-contracts/alpha/no_validators/submitEpochRootProof",
            "value": 686324,
            "unit": "gas"
          },
          {
            "name": "l1-contracts/alpha/validators/gasPerSecond",
            "value": 11230.3,
            "unit": "gas/second"
          },
          {
            "name": "l1-contracts/alpha/validators/propose",
            "value": 346872,
            "unit": "gas"
          },
          {
            "name": "l1-contracts/alpha/validators/proposeAndVote",
            "value": 404959,
            "unit": "gas"
          },
          {
            "name": "l1-contracts/alpha/validators/setupEpoch",
            "value": 46425,
            "unit": "gas"
          },
          {
            "name": "l1-contracts/alpha/validators/submitEpochRootProof",
            "value": 895503,
            "unit": "gas"
          },
          {
            "name": "l1-contracts/ignition/no_validators/gasPerSecond",
            "value": 854,
            "unit": "gas/second"
          },
          {
            "name": "l1-contracts/ignition/no_validators/propose",
            "value": 139918,
            "unit": "gas"
          },
          {
            "name": "l1-contracts/ignition/no_validators/setupEpoch",
            "value": 31281,
            "unit": "gas"
          },
          {
            "name": "l1-contracts/ignition/no_validators/submitEpochRootProof",
            "value": 561565,
            "unit": "gas"
          },
          {
            "name": "l1-contracts/ignition/validators/gasPerSecond",
            "value": 1279.6,
            "unit": "gas/second"
          },
          {
            "name": "l1-contracts/ignition/validators/propose",
            "value": 216829,
            "unit": "gas"
          },
          {
            "name": "l1-contracts/ignition/validators/proposeAndVote",
            "value": 275055,
            "unit": "gas"
          },
          {
            "name": "l1-contracts/ignition/validators/setupEpoch",
            "value": 36749,
            "unit": "gas"
          },
          {
            "name": "l1-contracts/ignition/validators/submitEpochRootProof",
            "value": 674356,
            "unit": "gas"
          }
        ]
      }
    ]
  }
}