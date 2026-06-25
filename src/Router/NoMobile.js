import React from "react";
import styled from "styled-components";
import { MdComputer } from "react-icons/md";

const NoMobile = () => {
  return (
    <Container>
      <ContentBox>
        <IconWrapper>
          <ComputerIcon />
          <PhoneIcon />
          <BlockLine />
        </IconWrapper>

        <Title>PC 환경에 최적화된 페이지입니다</Title>
        <Description>
          요청하신 페이지는 화면 크기와 기능 제약으로 인해 <br />
          <strong>모바일 및 태블릿 기기를 지원하지 않습니다.</strong>
        </Description>

        <InfoText>
          이용을 위해서는 <br />
          데스크톱(PC) 브라우저로 접속해 주시기 바랍니다.
        </InfoText>

        {/* 이전 페이지로 이동하거나 메인으로 이동하는 버튼 */}
        <HomeButton onClick={() => (window.location.href = "/Home")}>
          메인 페이지로 이동
        </HomeButton>
      </ContentBox>
    </Container>
  );
};

export default NoMobile;

// --- Styled Components ---

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background-color: #f8f9fa;
  padding: 20px;
  box-sizing: border-box;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
    sans-serif;
`;

const ContentBox = styled.div`
  max-width: 480px;
  width: 100%;
  text-align: center;
  background: #ffffff;
  padding: 40px 24px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
`;

const IconWrapper = styled.div`
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
`;

const ComputerIcon = styled(MdComputer)`
  font-size: 64px;
  color: #4f46e5; /* 메인 브랜드 컬러 (보라/블루 계열) */
`;

const PhoneIcon = styled`
  font-size: 40px;
  color: #9ca3af; /* 비활성화된 느낌의 그레이 */
  align-self: flex-end;
`;

const BlockLine = styled.div`
  position: absolute;
  width: 45px;
  height: 4px;
  background-color: #ef4444; /* 경고 레드 컬러 */
  transform: rotate(-45deg);
  bottom: 12px;
  right: -2px;
  border-radius: 2px;
  border: 2px solid #ffffff;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 16px 0;
  letter-spacing: -0.5px;
`;

const Description = styled.p`
  font-size: 15px;
  color: #4b5563;
  line-height: 1.6;
  margin: 0 0 24px 0;

  strong {
    color: #ef4444;
    font-weight: 600;
  }
`;

const InfoText = styled.p`
  font-size: 13px;
  color: #9ca3af;
  line-height: 1.5;
  margin: 0 0 32px 0;
  background-color: #f9fafb;
  padding: 12px;
  border-radius: 8px;
`;

const HomeButton = styled.button`
  width: 100%;
  padding: 14px;
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
  background-color: #4f46e5;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #4338ca;
  }

  &:active {
    background-color: #3730a3;
  }
`;
