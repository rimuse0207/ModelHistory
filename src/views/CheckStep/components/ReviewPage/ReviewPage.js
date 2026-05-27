import React from "react";
import { ThemeProvider } from "styled-components";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import { theme } from "../../../../styles/theme";

// 훅 및 새로 쪼갠 컴포넌트 임포트
import { useReview } from "../../../../hooks/useReview";
import { ReviewSummaryAlert } from "./components/ReviewSummaryAlert";
import { ReviewCategoryCard } from "./components/ReviewCategoryCard";

import {
  ReviewContainer,
  Header,
  Title,
  FixedFooter,
  FooterContent,
  ActionButton,
} from "../styles/ReviewPage.style";

function ReviewPage({ categories = [], answers = {}, onBack, onSave }) {
  const reviewProps = useReview(categories, answers);
  const { missingCount, totalErrorCount, openSections } = reviewProps;

  return (
    <ThemeProvider theme={theme}>
      <ReviewContainer>
        <Header>
          <Title>📋 점검 이력 최종 확인</Title>
          <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>
            제출 전 입력하신 데이터를 최종 검토해 주세요. 스펙 오차 범위나 제한
            문구를 위반한 항목은 적색으로 표시됩니다.
          </p>
        </Header>

        {/* 1. 상단 종합 상태 스태터스 바 영역 */}
        <ReviewSummaryAlert
          missingCount={missingCount}
          totalErrorCount={totalErrorCount}
        />

        {/* 2. 대분류 카테고리 반복 루프 영역 */}
        {categories.map((cat) => (
          <ReviewCategoryCard
            key={cat.id || cat.cat_id || ""}
            cat={cat}
            {...reviewProps} // 훅에서 반환된 함수셋 그대로 전달
          />
        ))}

        {/* 3. 하단 고정 액션 바 영역 */}
        <FixedFooter>
          <FooterContent>
            <ActionButton onClick={onBack}>
              <FiArrowLeft /> 수정하기
            </ActionButton>
            <ActionButton $primary onClick={onSave}>
              <FiSave /> 최종 저장하기
            </ActionButton>
          </FooterContent>
        </FixedFooter>
      </ReviewContainer>
    </ThemeProvider>
  );
}

export default ReviewPage;
