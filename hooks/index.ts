import { useEffect, useState } from "react";

import { JsonRpcSigner } from "@ethersproject/providers";
import Safe from "@safe-global/safe-core-sdk";
import {
  AllTransactionsListResponse,
  OwnerResponse,
  SafeBalanceResponse,
  SafeBalanceUsdResponse,
  SafeMultisigTransactionListResponse,
  TokenInfoListResponse,
} from "@safe-global/safe-service-client";
import { useEthers } from "@usedapp/core";
import { BigNumber, ethers } from "ethers";

import { SafeMultisigTransactionResponse } from "@safe-global/safe-core-sdk-types";
import { useRouter } from "next/router";
import { createEthersAdapter, safeServiceClient } from "../services";

/**
 * Get Signer
 */
export function useGetSigner() {
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const { account } = useEthers();

  useEffect(() => {
    if (!window?.ethereum || !account) return;
    const provider = new ethers.providers.Web3Provider(window?.ethereum);

    const accountsChanged = async (accounts: string[]) => {
      await provider.send("eth_requestAccounts", []);
      const safeOwner = provider.getSigner(0);
      setSigner(safeOwner);
    };

    (async () => {
      await provider.send("eth_requestAccounts", []);
      const safeOwner = provider.getSigner(0);
      setSigner(safeOwner);
      window?.ethereum?.on("accountsChanged", accountsChanged);
    })();

    return () => window?.ethereum?.removeListener("accountsChanged", accountsChanged);
  }, []);

  return signer;
}

/**
 * Get Wallets By Owner
 */
export function useGetWallets(signer: JsonRpcSigner | undefined) {
  const [walletList, setWalletList] = useState<string[]>([]);

  const getWallets = async () => {
    if (!signer) return;

    const ownerAddress = await signer?.getAddress();
    const safeService = safeServiceClient(signer);
    const safes: OwnerResponse = await safeService.getSafesByOwner(ownerAddress);
    setWalletList(safes?.safes);
  };

  useEffect(() => {
    getWallets();
  }, [signer]);

  return { walletList, refetch: () => getWallets() };
}

/**
 * Checks if a specific address is an owner of the current wallet
 */
export function useIsOwner(signer: JsonRpcSigner | undefined, walletAddress: string | string[] | undefined) {
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!walletAddress || Array.isArray(walletAddress) || !signer) return;
    // IIFE
    (async () => {
      const ethAdapter = createEthersAdapter(signer);
      const ownerAddress = await signer?.getAddress();
      const safeSdk = await Safe.create({ ethAdapter, safeAddress: walletAddress });
      const isOwner = await safeSdk.isOwner(ownerAddress);
      setIsOwner(isOwner);
    })();
  }, [signer, walletAddress]);

  return isOwner;
}

/**
 * Get Multisig Wallet ETH Balance
 */
export function useGetWalletBalance(signer: JsonRpcSigner | undefined, walletAddress: string | string[] | undefined) {
  const [balance, setBalance] = useState<BigNumber>();

  useEffect(() => {
    if (!walletAddress || Array.isArray(walletAddress) || !signer) return;
    // IIFE
    (async () => {
      const ethAdapter = createEthersAdapter(signer);
      const safeSdk = await Safe.create({ ethAdapter, safeAddress: walletAddress });
      const balance = await safeSdk.getBalance();
      setBalance(balance);
    })();
  }, [signer, walletAddress]);

  return balance;
}

/**
 * Get Multisig Wallet All Token ETH Balance
 */
export function useGetBalances(signer: JsonRpcSigner | undefined, walletAddress: string | string[] | undefined) {
  const router = useRouter();
  const [tokensBalances, setTokensBalance] = useState<SafeBalanceResponse[]>();

  const getTokenBalances = async () => {
    if (!walletAddress || Array.isArray(walletAddress) || !signer) return;

    const safeService = safeServiceClient(signer);
    const balances: SafeBalanceResponse[] = await safeService.getBalances(walletAddress);
    setTokensBalance(balances);
    console.log("Balances: ", balances);
  };

  useEffect(() => {
    getTokenBalances();
  }, [signer, walletAddress, router?.asPath]);

  return { tokensBalances, refetch: () => getTokenBalances() };
}

/**
 * Get Multisig Wallet Owner
 */
export function useGetOwners(signer: JsonRpcSigner | undefined, walletAddress: string | string[] | undefined) {
  const [ownerAddresses, setOwnerAddresses] = useState<string[]>();

  useEffect(() => {
    if (!walletAddress || Array.isArray(walletAddress) || !signer) return;
    // IIFE
    (async () => {
      const ethAdapter = createEthersAdapter(signer);
      const safeSdk = await Safe.create({ ethAdapter, safeAddress: walletAddress });
      const ownerAddresses = await safeSdk.getOwners();
      setOwnerAddresses(ownerAddresses);
    })();
  }, [signer, walletAddress]);

  return ownerAddresses;
}

/**
 * Get Token List
 */
export function useGetTokenList(signer: JsonRpcSigner | undefined) {
  const [tokenList, setTokenList] = useState<TokenInfoListResponse>();

  useEffect(() => {
    if (!signer) return;
    // IIFE
    (async () => {
      const safeService = safeServiceClient(signer);
      const tokenList: TokenInfoListResponse = await safeService.getTokenList();
      setTokenList(tokenList);
    })();
  }, [signer]);

  return tokenList;
}

/**
 * Get Transaction Information
 */
export function useGetTxInfo(signer: JsonRpcSigner | undefined, safeTxHash: string) {
  const [txInfo, setTxInfo] = useState<SafeMultisigTransactionResponse>();

  useEffect(() => {
    if (!signer || !safeTxHash) return;
    // IIFE
    (async () => {
      const safeService = safeServiceClient(signer);
      const txInfo: SafeMultisigTransactionResponse = await safeService.getTransaction(safeTxHash);
      setTxInfo(txInfo);
    })();
  }, [signer, safeTxHash]);

  return txInfo;
}

/**
 * Get Pending Transactions
 */
export function useGetPendingTxs(signer: JsonRpcSigner | undefined, walletAddress: string | string[] | undefined) {
  const [pendingTxs, setPendingTxs] = useState<SafeMultisigTransactionListResponse>();

  const getPendingTxs = async () => {
    if (!walletAddress || Array.isArray(walletAddress) || !signer) return;

    const safeService = safeServiceClient(signer);
    const pendingTxs: SafeMultisigTransactionListResponse = await safeService.getPendingTransactions(walletAddress);
    setPendingTxs(pendingTxs);
  };

  useEffect(() => {
    getPendingTxs();
  }, [signer, walletAddress]);

  return { results: pendingTxs?.results, refetch: () => getPendingTxs() };
}

/**
 * Get All Transactions
 */
export function useGetAllTxs(signer: JsonRpcSigner | undefined, walletAddress: string | string[] | undefined) {
  const [allTxs, setAllTxs] = useState<AllTransactionsListResponse>();

  const getAllTxs = async () => {
    if (!walletAddress || Array.isArray(walletAddress) || !signer) return;

    const safeService = safeServiceClient(signer);
    const allTxs: AllTransactionsListResponse = await safeService.getAllTransactions(walletAddress);
    console.log("allTxs", allTxs);
    setAllTxs(allTxs);
  };

  useEffect(() => {
    getAllTxs();
  }, [signer, walletAddress]);

  return { results: allTxs?.results, refetch: () => getAllTxs() };
}

/**
 * Get Number of Confirmations Required
 */
export function useNumConfirmationsRequired(
  signer: JsonRpcSigner | undefined,
  walletAddress: string | string[] | undefined,
) {
  const [confirmations, setConfirmations] = useState<number>();

  useEffect(() => {
    if (!walletAddress || Array.isArray(walletAddress) || !signer) return;
    // IIFE
    (async () => {
      const ethAdapter = createEthersAdapter(signer);
      const safeSdk = await Safe.create({ ethAdapter, safeAddress: walletAddress });
      const threshold = await safeSdk.getThreshold();
      setConfirmations(threshold);
    })();
  }, [signer, walletAddress]);

  return confirmations;
}

/**
 * Get Owners Who Approved Tx
 */
export function useGetOwnersApprovedTx(
  signer: JsonRpcSigner | undefined,
  walletAddress: string | string[] | undefined,
  txHash: string,
) {
  const [ownerAddresses, setOwnerAddresses] = useState<string[]>();

  const getOwnersWhoApprovedTxHash = async () => {
    if (!walletAddress || Array.isArray(walletAddress) || !signer || !txHash) return;

    const ethAdapter = createEthersAdapter(signer);
    const safeSdk = await Safe.create({ ethAdapter, safeAddress: walletAddress });
    const ownerAddresses = await safeSdk.getOwnersWhoApprovedTx(txHash);
    setOwnerAddresses(ownerAddresses);
  };

  useEffect(() => {
    getOwnersWhoApprovedTxHash();
  }, [signer, walletAddress, txHash]);

  return { results: ownerAddresses, refetch: () => getOwnersWhoApprovedTxHash() };
}
