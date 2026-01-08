// SPDX-License-Identifier: Apache-2.0
// Copyright 2024 Aztec Labs.
pragma solidity >=0.8.27;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";

import {IInstance} from "@aztec/core/interfaces/IInstance.sol";
import {IRegistry} from "@aztec/governance/interfaces/IRegistry.sol";

import {RegisterNewRollupVersionPayload} from "@aztec/periphery/RegisterNewRollupVersionPayload.sol";

/// @title CreateRollupUpgradePayload
/// @author Aztec Labs
/// @notice Script to create a RegisterNewRollupVersionPayload for governance.
///
/// Required environment variables:
///   - REGISTRY_ADDRESS: Address of the Registry contract
///   - ROLLUP_ADDRESS: Address of the new Rollup to register
///
/// Outputs the deployed payload address.
contract CreateRollupUpgradePayload is Script {
  function run() public {
    address registryAddress = vm.envAddress("REGISTRY_ADDRESS");
    address rollupAddress = vm.envAddress("ROLLUP_ADDRESS");

    vm.startBroadcast();
    RegisterNewRollupVersionPayload payload =
      new RegisterNewRollupVersionPayload(IRegistry(registryAddress), IInstance(rollupAddress));
    vm.stopBroadcast();

    console.log("PAYLOAD_ADDRESS:", address(payload));
  }
}
