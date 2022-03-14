import { useEthers } from "@usedapp/core";
import { ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { selectError } from "../state/errorSlice";

interface ButtonProps {
  primary?: boolean;
}

const StyledButton = styled.button`
  padding: 1rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: ${(props: ButtonProps) => (props.primary ? "0" : "1px")} solid
    var(--main);
  background-color: ${(props: ButtonProps) =>
    props.primary ? "var(--primary)" : "var(--bg)"};

  font-size: 1.6rem;

  :disabled {
    cursor: auto;
    background-color: var(--sub);
  }
`;

interface Props {
  click: () => void;
  primary?: boolean;
  disabled?: boolean;
  loading?: boolean;
  children?: ReactNode;
}

const Button = ({ children, click, primary, disabled, loading }: Props) => {
  const { account, activateBrowserWallet } = useEthers();
  const error = useSelector(selectError);
  const [pending, setPending] = useState(false);

  const isWeb3 = loading !== undefined;

  useEffect(() => {
    if (error || loading) setPending(false);
  }, [error, loading]);

  return (
    <StyledButton
      onClick={() => {
        if (loading || disabled || pending) return;
        if (isWeb3) setPending(true);
        if (isWeb3 && !account) activateBrowserWallet();
        else click();
      }}
      disabled={disabled || loading || pending}
      primary={primary}
    >
      {isWeb3 && !account
        ? "Connect Wallet"
        : loading
        ? "Loading..."
        : children}
    </StyledButton>
  );
};

export default Button;
