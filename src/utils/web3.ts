import { ethers } from 'ethers';

// 1. Window 객체에 ethereum이 있다고 알려주는 타입 정의
// (TypeScript라서 필요한 부분입니다)
declare global {
  interface Window {
    ethereum?: any;
  }
}

// 2. 지갑 연결 함수
export const connectWallet = async () => {
  // 메타마스크가 깔려있는지 확인
  if (!window.ethereum) {
    alert("메타마스크를 먼저 설치해주세요!");
    return null;
  }

  try {
    // 지갑 연결 요청 (팝업 뜸)
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    // 연결된 지갑의 주소와 서명자(Signer) 객체 반환
    return { address, signer, provider };
  } catch (error) {
    console.error("지갑 연결 실패:", error);
    return null;
  }
};

// 3. 스마트 컨트랙트 가져오는 함수
// (나중에 계약서에 서명하거나 정보를 읽어올 때 씁니다)
export const getContract = (contractAddress: string, abi: any, signer: any) => {
  return new ethers.Contract(contractAddress, abi, signer);
};