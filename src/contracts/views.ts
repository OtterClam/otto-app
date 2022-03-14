import { useContractCall } from "@usedapp/core";
import { utils } from "ethers";

import erc20Abi from "./erc20.json";

export const useTokenSymbol = (token: string) => {
  const [symbol] = useContractCall({
    abi: new utils.Interface(erc20Abi),
    address: token,
    method: "symbol",
    args: [],
  }) ?? ["---"];
  return symbol;
};
