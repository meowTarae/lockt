import Header from "./components/Header";
import EscrowDetail from "./components/EscrowDetail";
import styled from "@emotion/styled";

function App() {
  return (
    <AppContainer>
      {/* 상단: 로고 및 지갑 연결 버튼 */}
      <Header />

      <Main>
        {/* 중간: 서비스 소개 멘트 */}
        <HeroSection>
          <h2>안전한 에스크로 거래, LockT로 시작하세요. 🔒</h2>
          <p>
            블록체인 스마트 컨트랙트를 통해 중개자 없이 안전하게 자산을
            보호합니다.
            <br />
            아래 대시보드에서 거래 상태를 확인하고 입금을 진행해 보세요.
          </p>
        </HeroSection>

        {/* 하단: 핵심 기능 (대시보드) */}
        <ContentArea>
          <EscrowDetail />
        </ContentArea>
      </Main>
    </AppContainer>
  );
}

export default App;

// --- Styles (Emotion) ---

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f7fafc; /* 부드러운 회색 배경 */
  display: flex;
  flex-direction: column;
  width: 100vw;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem;
`;

const HeroSection = styled.section`
  text-align: center;
  margin-bottom: 2rem;

  h2 {
    font-size: 2rem;
    color: #2d3748;
    margin-bottom: 1rem;
    font-weight: 800;
  }

  p {
    color: #718096;
    font-size: 1.1rem;
    line-height: 1.6;
  }
`;

const ContentArea = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
