import { useState, useEffect, useCallback } from "react";
import styled from "@emotion/styled";
import { ethers } from "ethers";
import { getContract } from "../utils/web3";
import { ESCROW_ADDRESS } from "../constants/contracts";
import ABI from "../constants/abi.json";

const EscrowDetail = () => {
  const [info, setInfo] = useState<any>(null);
  const [status, setStatus] = useState<string>("");

  const STATE_MAP = [
    "생성됨 (입금 대기)",
    "잠김 (거래 중)",
    "종료 (정산 완료)",
  ];

  const fetchContractInfo = useCallback(async () => {
    if (!window.ethereum) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(ESCROW_ADDRESS, ABI, signer);

      const buyer = await contract.buyer();
      const seller = await contract.seller();
      const state = await contract.state();
      const value = await contract.value();

      setInfo({
        buyer,
        seller,
        state: Number(state),
        value: ethers.formatEther(value),
      });
    } catch (error) {
      console.error("정보 로딩 실패:", error);
    }
  }, []);

  // [기능 1] 입금하기
  const handleDeposit = async () => {
    try {
      if (!window.ethereum) return;
      setStatus("입금 처리 중... (지갑을 확인해주세요)");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(ESCROW_ADDRESS, ABI, signer);

      const amount = ethers.parseEther("0.001");
      const tx = await contract.deposit({ value: amount });

      setStatus("블록체인 기록 중...");
      await tx.wait();

      setStatus("입금 완료! 상태가 '잠김'으로 변경되었습니다.");
      fetchContractInfo();
    } catch (error) {
      console.error(error);
      setStatus("입금 실패 또는 취소됨");
    }
  };

  // [기능 2] 구매 확정 (새로 추가된 기능!)
  const handleConfirm = async () => {
    try {
      if (!window.ethereum) return;

      // 사용자에게 한 번 더 물어보는 UX
      if (
        !confirm(
          "물품을 확실히 받으셨나요? 확인을 누르면 판매자에게 돈이 지급됩니다."
        )
      )
        return;

      setStatus("구매 확정 처리 중...");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(ESCROW_ADDRESS, ABI, signer);

      // 스마트 컨트랙트의 confirmReceipt 함수 호출
      const tx = await contract.confirmReceipt();

      setStatus("송금 진행 중... (잠시만 기다려주세요)");
      await tx.wait();

      setStatus("거래 종료! 판매자에게 정산이 완료되었습니다. 🎉");
      fetchContractInfo();
    } catch (error) {
      console.error(error);
      setStatus("구매 확정 실패");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchContractInfo();
  }, [fetchContractInfo]);

  return (
    <Container>
      <Title>Escrow 대시보드</Title>

      {info ? (
        <InfoCard>
          <p>
            <strong>상태:</strong>{" "}
            <StatusBadge state={info.state}>
              {STATE_MAP[info.state]}
            </StatusBadge>
          </p>
          <p>
            <strong>구매자:</strong> {info.buyer}
          </p>
          <p>
            <strong>판매자:</strong> {info.seller}
          </p>
          <p>
            <strong>보관 금액:</strong> {info.value} ETH
          </p>
        </InfoCard>
      ) : (
        <p>컨트랙트 정보를 불러오는 중...</p>
      )}

      <ActionArea>
        {/* 상태 0: 입금 대기 */}
        {info && info.state === 0 && (
          <Button color="blue" onClick={handleDeposit}>
            0.001 ETH 입금하기 (Deposit)
          </Button>
        )}

        {/* 상태 1: 잠김 (구매 확정 가능) */}
        {info && info.state === 1 && (
          <Button color="green" onClick={handleConfirm}>
            📦 수령 확인 및 구매 확정
          </Button>
        )}

        {/* 상태 2: 종료 */}
        {info && info.state === 2 && (
          <CompleteMessage>
            ✅ 모든 거래가 안전하게 종료되었습니다.
          </CompleteMessage>
        )}

        <StatusMsg>{status}</StatusMsg>
      </ActionArea>

      <RefreshBtn onClick={fetchContractInfo}>🔄 정보 새로고침</RefreshBtn>
    </Container>
  );
};

export default EscrowDetail;

// --- Styles ---
// (기존 스타일에서 Button에 color prop 처리만 추가했습니다)

const Container = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2d3748;
`;

const InfoCard = styled.div`
  background: #f7fafc;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;

  p {
    margin: 0.5rem 0;
    word-break: break-all;
    font-size: 0.95rem;
    color: #4a5568;
  }

  strong {
    color: #2d3748;
    margin-right: 0.5rem;
  }
`;

const StatusBadge = styled.span<{ state: number }>`
  font-weight: bold;
  color: ${(props) =>
    props.state === 0 ? "#3182ce" : props.state === 1 ? "#e53e3e" : "#38a169"};
`;

const ActionArea = styled.div`
  text-align: center;
  margin-bottom: 1rem;
  min-height: 80px; /* 버튼 영역 높이 확보 */
`;

// 버튼 색상을 props로 받아서 처리
const Button = styled.button<{ color: string }>`
  background-color: ${(props) =>
    props.color === "blue" ? "#3182ce" : "#38a169"};
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.1s;

  &:hover {
    background-color: ${(props) =>
      props.color === "blue" ? "#2b6cb0" : "#2f855a"};
    transform: scale(1.02);
  }
`;

const CompleteMessage = styled.p`
  color: #38a169;
  font-weight: bold;
  font-size: 1.1rem;
`;

const RefreshBtn = styled.button`
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  display: block;
  margin: 0 auto;
  text-decoration: underline;
`;

const StatusMsg = styled.p`
  margin-top: 10px;
  font-size: 0.9rem;
  color: #d69e2e;
`;
