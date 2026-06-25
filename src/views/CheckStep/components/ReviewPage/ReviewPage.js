import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import { theme } from "../../../../styles/theme";

import { useReview } from "../../../../hooks/useReview";
import { ReviewSummaryAlert } from "./components/ReviewSummaryAlert";
import { ReviewCategoryCard } from "./components/ReviewCategoryCard";
import { SubmitConfirmModal } from "./modal/SubmitConfirmModal";

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
  const { missingCount, totalErrorCount } = reviewProps;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFinalSubmitClick = () => {
    if (missingCount > 0) {
      alert(
        `🚨 미입력된 누락 항목이 총 ${missingCount}건 존재합니다.\n모든 필수 항목의 측정을 완료해야 최종 제출이 가능합니다.`,
      );
      return;
    }

    setIsModalOpen(true);
  };

  const handleModalSubmit = (metaData) => {
    setIsModalOpen(false);

    onSave(metaData);
  };

  return (
    <ThemeProvider theme={theme}>
      <ReviewContainer>
        <Header>
          <Title>점검 이력 최종 확인</Title>
          <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>
            제출 전 입력하신 데이터를 최종 검토해 주세요. 스펙 오차 범위나 제한
            문구를 위반한 항목은 적색으로 표시됩니다.
          </p>
        </Header>

        <ReviewSummaryAlert
          missingCount={missingCount}
          totalErrorCount={totalErrorCount}
        />

        {categories.map((cat) => (
          <ReviewCategoryCard
            key={cat.id || cat.cat_id || ""}
            cat={cat}
            {...reviewProps}
          />
        ))}

        <FixedFooter>
          <FooterContent>
            <ActionButton onClick={onBack}>
              <FiArrowLeft /> 수정하기
            </ActionButton>
            <ActionButton $primary onClick={handleFinalSubmitClick}>
              <FiSave /> 최종 저장하기
            </ActionButton>
          </FooterContent>
        </FixedFooter>

        <SubmitConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      </ReviewContainer>
    </ThemeProvider>
  );
}

export default ReviewPage;
