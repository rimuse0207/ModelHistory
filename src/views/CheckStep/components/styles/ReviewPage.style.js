import styled, { keyframes } from "styled-components";
import { theme } from "../../../../styles/theme";

const mobileBreakpoint = theme.media?.sizes?.mobile || "768px";

export const ValuesDisplayGrid = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
  @media (max-width: ${mobileBreakpoint}) {
    width: 100%;
    justify-content: flex-start;
    margin-top: 8px;
  }
`;

// export const MiniValueChip = styled.div`
//   display: flex;
//   flex-direction: column;
//   background-color: #f8fafc;
//   border-radius: 10px;
//   padding: 10px 14px;
//   min-width: 160px;
//   border: 1px solid
//     ${(p) => (p.$isError ? "#fca5a5" : p.$isMissing ? "#cbd5e1" : "#e2e8f0")};
//   background-color: ${(p) =>
//     p.$isError ? "#fef2f2" : p.$isMissing ? "#f8fafc" : "#ffffff"};
//   transition: all 0.2s ease;
//   &:hover {
//     background-color: ${(p) => (p.$isError ? "#fee2e2" : "#f1f5f9")};
//     transform: translateY(-1px);
//   }
//   .field-name {
//     font-size: 11px;
//     font-weight: 700;
//     color: ${(p) => (p.$isError ? "#991b1b" : "#475569")};
//     margin-bottom: 6px;
//     border-bottom: 1px solid ${(p) => (p.$isError ? "#fee2e2" : "#e2e8f0")};
//     padding-bottom: 4px;
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//   }
//   .io-box {
//     display: flex;
//     justify-content: space-between;
//     gap: 12px;
//     font-size: 13px;
//   }
//   .sub-label {
//     font-size: 9px;
//     font-weight: 600;
//     color: ${(p) => (p.$isError ? "#fca5a5" : "#94a3b8")};
//     text-transform: uppercase;
//   }
//   .val {
//     font-size: 14px;
//     font-weight: 700;
//   }
//   @media (max-width: ${mobileBreakpoint}) {
//     flex: 1;
//     min-width: 140px;
//   }
// `;

// 💡 1. [🆕 핵심 추가] 한 줄에 딱 3개씩 이쁘게 바둑판 배열해주는 부모 그리드 박스
export const ValueGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(
    3,
    minmax(0, 1fr)
  ); /* 무조건 한 줄에 똑같이 3등분 정렬 */
  gap: 12px; /* 칩과 칩 사이의 간격 격자 */
  width: 100%;

  /* 태블릿이나 모바일 화면으로 갈 때 너무 좁아지면 2줄, 1줄로 반응형 처리 가드 */
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 640px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
`;

// 💡 2. 레이블 밑으로 값이 내려가도록 세로 정렬 가공한 자식 칩 박스
export const MiniValueChip = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
  border-radius: 10px;
  padding: 12px 14px;
  border: 1px solid
    ${(p) => (p.$isError ? "#fca5a5" : p.$isMissing ? "#cbd5e1" : "#e2e8f0")};
  background-color: ${(p) =>
    p.$isError ? "#fef2f2" : p.$isMissing ? "#f8fafc" : "#ffffff"};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(p) => (p.$isError ? "#fee2e2" : "#f1f5f9")};
    transform: translateY(-1px);
  }

  .field-name {
    font-size: 11px;
    font-weight: 700;
    color: ${(p) => (p.$isError ? "#991b1b" : "#475569")};
    margin-bottom: 8px;
    border-bottom: 1px solid ${(p) => (p.$isError ? "#fee2e2" : "#e2e8f0")};
    padding-bottom: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .io-box {
    display: flex;
    justify-content: space-around; /* 정렬 균형감을 위해 배치 분산 */
    align-items: flex-start;
    gap: 8px;
  }

  /* 💡 [핵심] 레이블과 값이 세로로 물 흐르듯 떨어지게 플렉스 차원 변경 */
  .before-segment,
  .after-segment {
    display: flex;
    flex-direction: column;
    align-items: center; /* 한가운데 정렬 */
    text-align: center;
    flex: 1;
  }

  .sub-label {
    font-size: 9px;
    font-weight: 600;
    color: ${(p) => (p.$isError ? "#fca5a5" : "#94a3b8")};
    text-transform: uppercase;
    margin-bottom: 2px; /* 레이블과 값 사이의 미세 틈새 보정 */
  }

  .val {
    font-size: 14px;
    font-weight: 700;
  }
`;
export const ReviewContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px 100px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  @media (max-width: ${mobileBreakpoint}) {
    padding: 20px 16px 100px 16px;
  }
`;
export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
`;
export const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${(p) => p.theme.colors?.textMain || "#0f172a"};
`;
export const StatusAlert = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${(p) => (p.$isWarning ? "#fffbeb" : "#f0fdf4")};
  border: 1px solid ${(p) => (p.$isWarning ? "#fef3c7" : "#bbf7d0")};
  color: ${(p) => (p.$isWarning ? "#b45309" : "#166534")};
`;
export const AccordionCard = styled.div`
  background-color: ${(p) => p.theme.colors?.bgCard || "#ffffff"};
  border-radius: 14px;
  border: 1px solid ${(p) => p.theme.colors?.border || "#e2e8f0"};
  box-shadow: ${(p) => p.theme.boxShadow || "0 4px 6px -1px rgba(0,0,0,0.05)"};
  overflow: hidden;
  margin-bottom: 16px;
  &:last-child {
    margin-bottom: 0;
  }
`;
export const AccordionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  cursor: pointer;
  background-color: ${(p) => (p.$isOpen ? "#f8fafc" : "transparent")};
  transition: background-color 0.2s;
  &:hover {
    background-color: #f8fafc;
  }
`;
export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  font-size: 16px;
  color: #1e293b;
`;
export const AccordionContent = styled.div`
  padding: 0 24px 20px 24px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #ffffff;
`;
export const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 0;
  border-bottom: 1px solid #f8fafc;
  gap: 16px;
  &:last-child {
    border-bottom: none;
  }
  @media (max-width: ${mobileBreakpoint}) {
    flex-direction: column;
    gap: 8px;
  }
`;
export const FixedFooter = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${(p) => p.theme.colors?.bgCard || "#ffffff"};
  padding: 16px 24px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.06);
  border-top: 1px solid ${(p) => p.theme.colors?.border || "#e2e8f0"};
  z-index: 30;
`;
export const FooterContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 16px;
`;
export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.2s;
  cursor: pointer;
  background-color: ${(p) =>
    p.$primary ? p.theme.colors?.primary || "#3b82f6" : "transparent"};
  color: ${(p) =>
    p.$primary ? "#ffffff" : p.theme.colors?.textMain || "#0f172a"};
  border: ${(p) =>
    p.$primary ? "none" : `1px solid ${p.theme.colors?.border || "#e2e8f0"}`};
  &:hover {
    background-color: ${(p) =>
      p.$primary
        ? p.theme.colors?.primary
          ? p.theme.colors.primary + "dd"
          : "#2563eb"
        : "#f1f5f9"};
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// 모달 전체 뒷배경 가림막 (뒷화면 살짝 블러 처리)
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.6); /* Slate-900 기반 투명도 */
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: ${fadeIn} 0.2s ease-out;
  padding: 16px;
`;

// 모달 메인 바디 박스
export const ModalBody = styled.div`
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 520px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: ${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const ModalHeader = styled.div`
  padding: 20px 24px;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;

  h3 {
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  p {
    font-size: 13px;
    color: #64748b;
    margin-top: 4px;
  }
`;

export const ModalContent = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-height: 70vh;
  overflow-y: auto;
`;

// 각 인풋 영역을 정렬해주는 로우 박스
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 12px;
    font-weight: 700;
    color: #475569;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  /* 네이티브 날짜/시간 인풋 스타일 세련되게 가공 */
  input[type="date"],
  input[type="time"],
  textarea {
    width: 100%;
    padding: 10px 14px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    font-size: 14px;
    color: #0f172a;
    background-color: #ffffff;
    transition: all 0.2s ease;
    outline: none;

    &:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }

  textarea {
    resize: none;
    min-height: 80px;
  }
`;

// 가로로 나란히 배치할 때 쓰는 그룹 (날짜 + 시간용)
export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const ModalFooter = styled.div`
  padding: 16px 24px;
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;
