import { useEffect, useState } from "react";

import { BigNumber, ethers } from "ethers";
import { JsonRpcSigner } from "@ethersproject/providers";
import { useEthers } from "@usedapp/core";
import Safe from "@gnosis.pm/safe-core-sdk";
import {
  AllTransactionsListResponse,
  OwnerResponse,
  SafeBalanceUsdResponse,
  SafeMultisigTransactionListResponse,
  SafeMultisigTransactionResponse,
  TokenInfoListResponse,
} from "@gnosis.pm/safe-service-client";

import { contract } from "../constants";
import { createEthersAdapter, safeServiceClient } from "../services";
import { useRouter } from "next/router";

/**
 * Get Signer
 */
export function useGetSigner() {
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const { account } = useEthers();

  useEffect(() => {
    if (!window?.ethereum && !account) return;
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

  useEffect(() => {
    if (!signer) return;
    // IIFE
    (async () => {
      const ownerAddress = await signer?.getAddress();
      const safeService = safeServiceClient(signer);
      const safes: OwnerResponse = await safeService.getSafesByOwner(ownerAddress);
      setWalletList(safes?.safes);
    })();
  }, [signer]);

  return walletList;
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
export function useGetTotalBalance(signer: JsonRpcSigner | undefined, walletAddress: string | string[] | undefined) {
  const router = useRouter();
  const [balance, setBalance] = useState<number>(0);
  const [tokensBalance, setTokensBalance] = useState<SafeBalanceUsdResponse[]>();

  const getTokenBalance = async () => {
    if (!walletAddress || Array.isArray(walletAddress) || !signer) return;

    const safeService = safeServiceClient(signer);
    const usdBalances: SafeBalanceUsdResponse[] = await safeService.getUsdBalances(walletAddress);
    console.log("usdBalances", usdBalances);
    setTokensBalance(usdBalances);
    setBalance(() => usdBalances?.reduce((prev, token) => prev + parseFloat(token?.fiatBalance), 0));
  };

  useEffect(() => {
    getTokenBalance();
  }, [signer, walletAddress, router?.asPath]);

  return { balance, tokensBalance, refetch: () => getTokenBalance() };
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
      // console.log("ownerAddresses", ownerAddresses);
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
      console.log("tokenList", tokenList);
      setTokenList(tokenList);
    })();
  }, [signer]);

  return tokenList;
}

/**
 * Get Transaction Information
 */
export function useGetTxInfo(signer: JsonRpcSigner | undefined, safeTxHash: string) {
  const [txInfo, setTxInfoo] = useState<SafeMultisigTransactionResponse>();

  useEffect(() => {
    if (!signer || !safeTxHash) return;
    // IIFE
    (async () => {
      const safeService = safeServiceClient(signer);
      const txInfo: SafeMultisigTransactionResponse = await safeService.getTransaction(safeTxHash);
      console.log("txInfo ---- ", txInfo);
      setTxInfoo(txInfo);
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
    console.log("pendingTxs ---- ", pendingTxs);
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
    console.log("allTxs ---- ", allTxs);
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
      console.log("threshold", threshold);
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
    console.log("approvedTxOwnerList ", ownerAddresses);
    setOwnerAddresses(ownerAddresses);
  };

  useEffect(() => {
    getOwnersWhoApprovedTxHash();
  }, [signer, walletAddress, txHash]);

  return { results: ownerAddresses, refetch: () => getOwnersWhoApprovedTxHash() };
}
