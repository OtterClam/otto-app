import { useEtherBalance, useEthers, useTokenBalance } from "@usedapp/core";
import { useState } from "react";
import styled from "styled-components";
import { utils } from "ethers";

import { useTokenSymbol } from "../contracts/views";

const StyledTokenInput = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const InputContainer = styled.div`
  width: 100%;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: solid 1px teal;
`;

const Input = styled.input`
  width: 100%;
  font-size: 1.8rem;

  ::-webkit-outer-spin-button {
    display: none;
  }
  ::-webkit-inner-spin-button {
    display: none;
  }
`;

const Balance = styled.button`
  font-size: 1.5rem;
  color: var(--sub);
  cursor: pointer;
  white-space: nowrap;
  margin-left: 1rem;
`;

const Error = styled.div`
  color: var(--error);
  margin-top: 0.5rem;
  font-size: 1.5rem;
`;

interface Props {
  value: string;
  token: string;
  setValue: (v: string) => void;
  eth?: boolean;
}

const TokenInput = ({ value, token, setValue, eth }: Props) => {
  const { account } = useEthers();
  const etherBalance = useEtherBalance(account);
  const tokenBalance = useTokenBalance(token, account);
  const symbol = useTokenSymbol(token);
  const [error, setError] = useState("");

  const balance = eth
    ? utils.formatEther(etherBalance?.toString() || "1")
    : tokenBalance;
  const balanceString = balance?.toString() || "0";

  const validate = (value: string) => {
    if (!value) return "";
    if (Number(value) === 0) return "Must be greater than 0";
    if (Number(value) > Number(balanceString)) return "Insufficient balance";
    return "";
  };

  return (
    <StyledTokenInput>
      <InputContainer>
        <Input
          placeholder="0"
          type="number"
          value={value}
          onChange={(e) => {
            setError(validate(e.target.value));
            setValue(e.target.value);
          }}
        />
        <Balance
          onClick={() => setValue(balanceString)}
        >{`balance: ${balanceString} ${eth ? "ETH" : symbol}`}</Balance>
      </InputContainer>
      {error && <Error>{error}</Error>}
    </StyledTokenInput>
  );
};

export default TokenInput;
