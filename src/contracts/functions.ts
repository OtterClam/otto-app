import wethAbi from "./weth.json";
import useGlobals from "../app/hooks/use-globals";
import useContract from "../app/hooks/use-contract";

export const useWrap = () => {
  const globals = useGlobals();

  const { state: wrapState, send: wrap } = useContract(
    globals.WETH,
    wethAbi,
    "deposit",
    "Wrap"
  );
  return { wrapState, wrap };
};
