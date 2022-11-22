import { ethers } from "ethers";
import { JsonRpcSigner } from "@ethersproject/providers";
import { SafeFactory, type DeploySafeProps } from "@gnosis.pm/safe-core-sdk";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import SafeServiceClient, { OwnerResponse } from "@gnosis.pm/safe-service-client";

/**
 * Initialize an EthAdapter
 */
export const createEthersAdapter = (signer: JsonRpcSigner) => {
  return new EthersAdapter({
    ethers,
    signer: signer,
  });
};

/**
 * Initialize the SafeServiceClient
 */
export const safeServiceClient = (signer: JsonRpcSigner) => {
  const ethAdapter = createEthersAdapter(signer);
  return new SafeServiceClient({
    txServiceUrl: "https://safe-transaction-goerli.safe.global/",
    ethAdapter,
  });
};

/**
 * Create a wallet
 */
export const createNewWallet = async (signer: JsonRpcSigner, props: DeploySafeProps) => {
  const ethAdapter = createEthersAdapter(signer);
  const safeFactory = await SafeFactory.create({ ethAdapter });
  return safeFactory?.deploySafe(props);
};
