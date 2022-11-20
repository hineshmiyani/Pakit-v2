import { utils } from "ethers";
import { Contract } from "@ethersproject/contracts";
import multiSigFactoryAbi from "./MultiSigFactoryAbi.json";
import contractAddresses from "./ContractAddresses.json";

const contractAddressList: any = contractAddresses;
export const multiSigFactoryInterface = new utils.Interface(multiSigFactoryAbi);
export const multiSigFactoryAddress =
  contractAddressList?.["5"]?.["MultiSigFactory"][0];

export const contract = new Contract(
  multiSigFactoryAddress,
  multiSigFactoryInterface
);

export const APP_NAME = "Pakit";
