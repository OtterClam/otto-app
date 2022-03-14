import { useDispatch, useSelector } from "react-redux";
import { changeNetwork } from "../app/lib/web3";
import { clearError, ErrorButtonType, selectError } from "../state/errorSlice";
import Popup from "./Popup";

const Error = () => {
  const dispatch = useDispatch();
  const error = useSelector(selectError);

  if (!error) return null;

  return (
    <Popup
      show
      header={error.header}
      subHeader={error.subHeader}
      buttonText={
        error.button === ErrorButtonType.SWITCH_TO_MAINNET
          ? "Switch to Mainnet"
          : undefined
      }
      buttonAction={
        error.button === ErrorButtonType.SWITCH_TO_MAINNET
          ? () => changeNetwork(1)
          : undefined
      }
      close={() => dispatch(clearError())}
    />
  );
};

export default Error;
