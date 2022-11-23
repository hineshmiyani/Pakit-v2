import { ethers } from "ethers";
import { JsonRpcSigner } from "@ethersproject/providers";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import { SafeTransactionDataPartial } from "@gnosis.pm/safe-core-sdk-types";
import Safe, { SafeFactory, type DeploySafeProps } from "@gnosis.pm/safe-core-sdk";
import SafeServiceClient, { OwnerResponse } from "@gnosis.pm/safe-service-client";
import { Co2Sharp } from "@mui/icons-material";

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

/**
 * Create a New Transaction
 */
export const createNewTransaction = async (
  signer: JsonRpcSigner,
  walletAddress: string,
  safeTransactionData: SafeTransactionDataPartial,
) => {
  const ethAdapter = createEthersAdapter(signer);
  const safeService = safeServiceClient(signer);
  const safeSdk = await Safe.create({ ethAdapter, safeAddress: walletAddress });

  //* Create Tx
  const safeTransaction = await safeSdk.createTransaction({ safeTransactionData });
  const txHash = await safeSdk.getTransactionHash(safeTransaction);
  const senderSignature = await safeSdk.signTransactionHash(txHash);

  //* Propose Tx
  const proposeTx = await safeService.proposeTransaction({
    safeAddress: walletAddress,
    safeTransactionData: safeTransaction.data,
    safeTxHash: txHash,
    senderAddress: await signer.getAddress(),
    senderSignature: senderSignature.data,
  });

  //* Approve Tx by created tx owner
  const txResponse = await safeSdk.approveTransactionHash(txHash);
  const txReceipt = await txResponse.transactionResponse?.wait();

  console.log({ safeTransaction });
  console.log({ txHash });
  console.log({ senderSignature });
  console.log({ proposeTx });
  console.log({ txResponse });
  console.log({ txReceipt });
};
