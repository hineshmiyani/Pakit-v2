import { useEffect, useState } from "react";

import { ethers } from "ethers";
import { JsonRpcSigner } from "@ethersproject/providers";
import { useCall, useCalls } from "@usedapp/core";
import Safe from "@gnosis.pm/safe-core-sdk";
import { OwnerResponse } from "@gnosis.pm/safe-service-client";

import { contract } from "../constants";
import { createEthersAdapter, safeServiceClient } from "../services";

export function useGetOwners(args: any[]) {
  const { value, error } =
    useCall({
      contract: contract,
      method: "getOwners",
      args: args,
    }) ?? {};

  if (error) {
    console.log("Error: ", error.message);
    return undefined;
  }
  return value;
}

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

export function useNumConfirmationsRequired(args: any[]) {
  const { value, error } =
    useCall({
      contract: contract,
      method: "returnNumConfirmationsRequired",
      args: args,
    }) ?? {};

  if (error) {
    console.log("Error: ", error.message);
    return undefined;
  }
  return value;
}

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
