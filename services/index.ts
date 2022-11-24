import { ethers } from "ethers";
import { JsonRpcSigner } from "@ethersproject/providers";
import { Interface } from "@ethersproject/abi";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import { SafeTransactionDataPartial } from "@gnosis.pm/safe-core-sdk-types";
import Safe, { SafeFactory, type DeploySafeProps } from "@gnosis.pm/safe-core-sdk";
import SafeServiceClient, { SafeMultisigTransactionResponse } from "@gnosis.pm/safe-service-client";

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

/**
 * Confirm a  Transaction
 */
export const confirmTx = async (signer: JsonRpcSigner, walletAddress: string, safeTxHash: string) => {
  const ethAdapter = createEthersAdapter(signer);
  // const safeService = safeServiceClient(signer);
  const safeSdk = await Safe.create({ ethAdapter, safeAddress: walletAddress });

  // let signature = await safeSdk.signTransactionHash(safeTxHash);
  // const signatureResponse: SignatureResponse = await safeService.confirmTransaction(safeTxHash, signature.data);

  // console.log({ signature });
  // console.log({ signatureResponse });

  //* Approve Tx by created tx owner
  const txResponse = await safeSdk.approveTransactionHash(safeTxHash);
  const txReceipt = await txResponse.transactionResponse?.wait();

  console.log({ txResponse });
  console.log({ txReceipt });
};

/**
 * Reject a  Transaction
 */
export const rejectTx = async (signer: JsonRpcSigner, walletAddress: string, nonce: number) => {
  debugger;
  const ethAdapter = createEthersAdapter(signer);
  const safeSdk = await Safe.create({ ethAdapter, safeAddress: walletAddress });

  //* Reject Tx
  const rejectionTransaction = await safeSdk.createRejectionTransaction(nonce);
  console.log({ rejectionTransaction });
};

/**
 * Execute a  Transaction
 */
export const executeTx = async (signer: JsonRpcSigner, walletAddress: string, tx: SafeMultisigTransactionResponse) => {
  const ethAdapter = createEthersAdapter(signer);
  const safeSdk = await Safe.create({ ethAdapter, safeAddress: walletAddress });

  const modifiedTx: any = {
    signatures: new Map(),
    data: {
      to: tx?.to,
      value: tx?.value,
      data: tx?.data,
      operation: tx?.operation,
      baseGas: tx?.baseGas,
      gasPrice: tx?.baseGas,
      gasToken: tx?.gasToken,
      refundReceiver: tx?.refundReceiver,
      nonce: tx?.nonce,
      safeTxGas: tx?.safeTxGas,
    },
  };

  //* Execute Tx
  const executeTxResponse = await safeSdk.executeTransaction(modifiedTx);
  await executeTxResponse.transactionResponse?.wait();
  console.log({ executeTxResponse });
};

/**
 * ERC20 Token Transfer Data
 */
export const encodeERC20TokenTransferData = (to: string, value: string): string => {
  const erc20Abi = ["function transfer(address to, uint256 value)"];
  const contractInterface = new Interface(erc20Abi);
  return contractInterface.encodeFunctionData("transfer", [to, value]);
};
