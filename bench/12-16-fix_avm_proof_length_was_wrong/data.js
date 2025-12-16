window.BENCHMARK_DATA = {
  "lastUpdate": 1765917945534,
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
          "id": "92aa522957fe273982a0f9ae6393b8c32857f5eb",
          "message": "feat!: remove avm fallback and constrain public inputs validation",
          "timestamp": "2025-12-16T19:46:10Z",
          "url": "https://github.com/AztecProtocol/aztec-packages/pull/18957/commits/92aa522957fe273982a0f9ae6393b8c32857f5eb"
        },
        "date": 1765917874390,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "barretenberg/cpp/bb-micro-bench/wasm/ultra_honk_zk/seconds",
            "value": 17817.025880999998,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/bb-micro-bench/wasm/ultra_honk_zk/memory",
            "value": "1634",
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/bb-micro-bench/wasm/chonk/seconds",
            "value": 39607.480209,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/bb-micro-bench/wasm/chonk/memory",
            "value": "1309",
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/bb-micro-bench/wasm/ultra_honk/seconds",
            "value": 15718.696276,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/bb-micro-bench/wasm/ultra_honk/memory",
            "value": "1467",
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/bb-micro-bench/native/ultra_honk_zk/seconds",
            "value": 7192.759285999728,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/bb-micro-bench/native/ultra_honk_zk/memory",
            "value": "1525",
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/bb-micro-bench/native/chonk/seconds",
            "value": 15291.473983999822,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/bb-micro-bench/native/chonk/memory",
            "value": "743",
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/bb-micro-bench/native/ultra_honk/seconds",
            "value": 6263.1990989998485,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/bb-micro-bench/native/ultra_honk/memory",
            "value": "1328",
            "unit": "MB"
          },
          {
            "name": "barretenberg/cpp/bb-micro-bench/native/chonk_verify/seconds",
            "value": 213.26952275001076,
            "unit": "ms"
          },
          {
            "name": "barretenberg/cpp/bb-micro-bench/native/chonk_verify/memory",
            "value": "741",
            "unit": "MB"
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