import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";
import { useContractFunction } from "@usedapp/core";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setError } from "../../state/errorSlice";

const useContract = (
  address: string,
  abi: any,
  functionName: string,
  transactionName: string
) => {
  const dispatch = useDispatch();

  const { state, send } = useContractFunction(
    new Contract(address, new utils.Interface(abi)),
    functionName,
    {
      transactionName,
    }
  );

  useEffect(() => {
    if (state.status === "Fail") {
      dispatch(
        setError({
          header: "Transaction Failed",
          subHeader: state.errorMessage || "Please try again",
        })
      );
    } else if (state.status === "Exception") {
      dispatch(
        setError({
          header: "Transaction Failed",
          subHeader: state.errorMessage || "Please try again",
        })
      );
    }
  }, [state.status, dispatch, state.errorMessage]);

  return { state, send };
};

export default useContract;
