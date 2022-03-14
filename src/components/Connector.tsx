import { shortenAddress, useEthers } from "@usedapp/core";
import { useDispatch } from "react-redux";
import { connectWallet } from "../state/uiSlice";
import Button from "./Button";

const Connector = () => {
  const dispatch = useDispatch();
  const { account } = useEthers();

  return (
    <Button click={() => dispatch(connectWallet())}>
      {account ? shortenAddress(account) : "Connect Wallet"}
    </Button>
  );
};

export default Connector;
