import React from "react";
import styled from "styled-components";

const FooterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;

  ${({ theme }) => theme.media.mobile`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: ${({ theme }) => theme.colors.bgCard};
    padding: 16px;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    z-index: 20;
  `}
`;

const BaseButton = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.2s;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const NavButton = styled(BaseButton)`
  background-color: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMain};
  &:not(:disabled):hover {
    background-color: #f1f5f9;
  }
`;

const SkipButton = styled(BaseButton)`
  color: ${({ theme }) => theme.colors.textMuted};
  &:hover {
    color: ${({ theme }) => theme.colors.textMain};
  }
`;

const SubmitButton = styled(BaseButton)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}dd;
  }
`;

function Controller({ onPrev, onNext, onSkip, onReview, isFirst, isLast }) {
  return (
    <FooterBar>
      <div style={{ display: "flex", gap: "8px" }}>
        <NavButton onClick={onPrev} disabled={isFirst}>
          이전
        </NavButton>
        <SkipButton onClick={onSkip}>건너뛰기</SkipButton>
      </div>

      {isLast ? (
        <SubmitButton onClick={onReview}>최종 확인하기</SubmitButton>
      ) : (
        <NavButton onClick={onNext}>다음</NavButton>
      )}
    </FooterBar>
  );
}

export default Controller;
