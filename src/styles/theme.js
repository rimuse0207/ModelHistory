import { css } from "styled-components";

const sizes = {
  mobile: "768px",
  tablet: "1024px",
};

// 미디어 쿼리 헬퍼 함수
const media = {
  mobile: (...args) => css`
    @media (max-width: ${sizes.mobile}) {
      ${css(...args)}
    }
  `,
  tablet: (...args) => css`
    @media (max-width: ${sizes.tablet}) {
      ${css(...args)}
    }
  `,
};

export const theme = {
  colors: {
    bgMain: "#f8fafc", // 메인 배경 (Slate 50)
    bgCard: "#ffffff", // 카드 배경
    primary: "#2563eb", // 신뢰감을 주는 블루 (Royal Blue)
    primaryLight: "#eff6ff", // 블루 연한 버전 (배경용)
    success: "#10b981", // 완료 (에메랄드 그린)
    warning: "#f59e0b", // 건너뜀/진행중 (오렌지)
    textMain: "#0f172a", // 주 텍스트 (Slate 900)
    textMuted: "#64748b", // 부 텍스트 (Slate 500)
    border: "#e2e8f0", // 경계선 (Slate 200)
  },
  media,
};
