import { useState } from "react";
import styled from "@emotion/styled";
import { connectWallet } from "../utils/web3";

export default function Header() {
  const [account, setAccount] = useState<string | null>(null);

  const handleLogin = async () => {
    const walletData = await connectWallet();

    // 지갑 연결에 성공하면 주소를 상태에 저장
    if (walletData) {
      setAccount(walletData.address);
    }
  };

  return (
    <Container>
      <Logo>Lockt</Logo>
      <Button onClick={handleLogin}>
        {account
          ? `${account.substring(0, 6)}...${account.substring(
              account.length - 4
            )}`
          : "지갑 연결"}
      </Button>
    </Container>
  );
}

// --- Styles (Emotion) ---
const Container = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 2rem;
`;

const Button = styled.button`
  background-color: #3182ce;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: #2b6cb0;
  }
`;
