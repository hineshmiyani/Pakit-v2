import { useEffect, useState } from "react";

import { BigNumber, ethers } from "ethers";
import { JsonRpcSigner } from "@ethersproject/providers";
import { useCall, useCalls } from "@usedapp/core";
import Safe from "@gnosis.pm/safe-core-sdk";
import {
  AllTransactionsListResponse,
  OwnerResponse,
  SafeBalanceUsdResponse,
  SafeMultisigConfirmationListResponse,
  SafeMultisigTransactionListResponse,
  SafeMultisigTransactionResponse,
  TokenInfoListResponse,
} from "@gnosis.pm/safe-service-client";

import { contract } from "../constants";
import { createEthersAdapter, safeServiceClient } from "../services";

// export function useGetOwners(args: any[]) {
//   const { value, error } =
//     useCall({
//       contract: contract,
//       method: "getOwners",
//       args: args,
//     }) ?? {};

//   if (error) {
//     console.log("Error: ", error.message);
//     return undefined;
//   }
//   return value;
// }

// export function useIsOwner(args: any[]) {
//   const { value, error } =
//     useCall(
//       args?.[0] &&
//         args?.[1] && {
//           contract: contract,
//           method: "isOwner",
//           args: args,
//         },
//     ) ?? {};

//   if (error) {
//     console.log("Error: ", error.message);
//     return undefined;
//   }
//   return value;
// }

export function useIsUserExists(args: any[]) {
  const { value, error } =
    useCall({
      contract: contract,
      method: "userExists",
      args: args,
    }) ?? {};

  if (error) {
    console.log("Error: ", error.message);
    return undefined;
  }
  return value;
}

export function useGetWalletName(args: any[]) {
  const { value, error } =
    useCall(
      args[0] && {
        contract: contract,
        method: "returnWalletName",
        args: args,
      },
    ) ?? {};

  if (error) {
    console.log("Error: ", error.message);
    return undefined;
  }
  return value;
}

export function useGetWalletsCount(args: any[]) {
  const { value, error } =
    useCall(
      args[0] && {
        contract: contract,
        method: "returnWalletCount",
        args: args,
      },
    ) ?? {};

  if (error) {
    console.log("Error: ", error.message);
    return undefined;
  }
  return value;
}

// export function useGetWallets(args: any[], totalWallet: number) {
//   const calls: any = totalWallet
//     ? Array(totalWallet)
//         ?.fill("")
//         ?.map((ele, index: number) => {
//           return {
//             contract: contract,
//             method: "returnWallet",
//             args: [...args, index],
//           };
//         })
//     : [];
//   const results: any = useCalls(calls && calls) ?? {};

//   results.forEach((result: any, idx: number) => {
//     if (result?.error) {
//       console.error(
//         `Error encountered calling 'returnWallet' on ${calls[idx]?.contract.address}: ${result.error.message}`,
//       );
//       return undefined;
//     }
//   });
//   // console.log({ results });
//   return results?.map((result: any) => result?.value?.[0]);
// }

export function useGetTransactionCount(args: any[]) {
  const { value, error } =
    useCall({
      contract: contract,
      method: "getTransactionCount",
      args: args,
    }) ?? {};

  if (error) {
    console.log("Error: ", error.message);
    return undefined;
  }
  return value;
}

export function useGetTransactions(args: any[], totalTransaction: number) {
  const calls: any = totalTransaction
    ? Array(totalTransaction)
        ?.fill("")
        ?.map((ele, index: number) => {
          return {
            contract: contract,
            method: "getTransaction",
            args: [...args, index],
          };
        })
    : [];
  const results: any = useCalls(calls && calls) ?? {};

  results.forEach((result: any, idx: number) => {
    if (result?.error) {
      console.error(
        `Error encountered calling 'getTransaction' on ${calls[idx]?.contract.address}: ${result.error.message}`,
      );
      return undefined;
    }
  });
  return results?.map((result: any) => result?.value);
}

// export function useNumConfirmationsRequired(args: any[]) {
//   const { value, error } =
//     useCall({
//       contract: contract,
//       method: "returnNumConfirmationsRequired",
//       args: args,
//     }) ?? {};

//   if (error) {
//     console.log("Error: ", error.message);
//     return undefined;
//   }
//   return value;
// }

export function useIsTxConfirmed(args: any[]) {
  const { value, error } =
    useCall({
      contract: contract,
      method: "isConfirmed",
      args: args,
    }) ?? {};

  if (error) {
    console.log("Error: ", error.message);
    return undefined;
  }
  return value;
}

/**
 * Get Signer
 */
export function useGetSigner() {
  const [signer, setSigner] = useState<JsonRpcSigner>();

  useEffect(() => {
    if (!window?.ethereum) return;
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
  const [balance, setBalance] = useState<number>();

  useEffect(() => {
    if (!walletAddress || Array.isArray(walletAddress) || !signer) return;
    // IIFE
    (async () => {
      const safeService = safeServiceClient(signer);
      const usdBalances: SafeBalanceUsdResponse[] = await safeService.getUsdBalances(walletAddress);
      console.log("usdBalances", usdBalances);
      setBalance(() => usdBalances?.reduce((prev, token) => prev + parseFloat(token?.fiatBalance), 0));
    })();
  }, [signer, walletAddress]);

  return balance;
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

  useEffect(() => {
    if (!walletAddress || Array.isArray(walletAddress) || !signer) return;
    // IIFE
    (async () => {
      const safeService = safeServiceClient(signer);
      const pendingTxs: SafeMultisigTransactionListResponse = await safeService.getPendingTransactions(walletAddress);
      console.log("pendingTxs ---- ", pendingTxs);
      setPendingTxs(pendingTxs);
    })();
  }, [signer, walletAddress]);

  return pendingTxs?.results;
}

/**
 * Get All Transactions
 */
export function useGetAllTxs(signer: JsonRpcSigner | undefined, walletAddress: string | string[] | undefined) {
  const [allTxs, setAllTxs] = useState<AllTransactionsListResponse>();

  useEffect(() => {
    if (!walletAddress || Array.isArray(walletAddress) || !signer) return;
    // IIFE
    (async () => {
      const safeService = safeServiceClient(signer);
      const allTxs: AllTransactionsListResponse = await safeService.getAllTransactions(walletAddress);
      console.log("allTxs ---- ", allTxs);
      setAllTxs(allTxs);
    })();
  }, [signer, walletAddress]);

  return allTxs?.results;
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

  useEffect(() => {
    if (!walletAddress || Array.isArray(walletAddress) || !signer || !txHash) return;
    // IIFE
    (async () => {
      const ethAdapter = createEthersAdapter(signer);
      const safeSdk = await Safe.create({ ethAdapter, safeAddress: walletAddress });
      const ownerAddresses = await safeSdk.getOwnersWhoApprovedTx(txHash);
      console.log("approvedTxOwnerList ", ownerAddresses);
      setOwnerAddresses(ownerAddresses);
    })();
  }, [signer, walletAddress, txHash]);

  return ownerAddresses;
}
