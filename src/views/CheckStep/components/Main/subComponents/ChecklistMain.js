import React from "react";
import { ContentArea } from "../../../Layout.styles";
import QuestionCard from "../../QuestionCard/QuestionCard";
import Controller from "./Controller";

function ChecklistMain({
  currentCategory,
  answers,
  handleAnswerChange,
  submissionId,
  lastSavedAnswersStr,
  setCurrentCatIndex,
  categories,
  setViewMode,
}) {
  if (!currentCategory) return null;

  const currentIdx = categories.indexOf(currentCategory);
  const isFirst = currentIdx === 0;
  const isLast = currentIdx === categories.length - 1;

  return (
    <ContentArea>
      {/* 문항 카드 컴포넌트 */}
      <QuestionCard
        currentCategory={currentCategory}
        answers={answers}
        onAnswerChange={handleAnswerChange}
        isSaved={
          !!submissionId && lastSavedAnswersStr === JSON.stringify(answers)
        }
      />

      {/* 💡 [복구 완료] 클릭 함수 매핑 복원 및 깔끔한 제어권 복귀 */}
      <Controller
        onPrev={() => setCurrentCatIndex((prev) => Math.max(0, prev - 1))}
        onNext={() =>
          setCurrentCatIndex((prev) =>
            Math.min(categories.length - 1, prev + 1),
          )
        }
        onSkip={() =>
          setCurrentCatIndex((prev) =>
            Math.min(categories.length - 1, prev + 1),
          )
        }
        onReview={() => setViewMode("REVIEW")}
        isFirst={isFirst}
        isLast={isLast}
      />
    </ContentArea>
  );
}

export default ChecklistMain;
