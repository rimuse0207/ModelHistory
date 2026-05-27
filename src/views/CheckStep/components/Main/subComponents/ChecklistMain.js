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

  return (
    <ContentArea>
      <QuestionCard
        currentCategory={currentCategory}
        answers={answers}
        onAnswerChange={handleAnswerChange}
        isSaved={
          !!submissionId && lastSavedAnswersStr === JSON.stringify(answers)
        }
      />

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
        isFirst={categories.indexOf(currentCategory) === 0}
        isLast={categories.indexOf(currentCategory) === categories.length - 1}
      />
    </ContentArea>
  );
}

export default ChecklistMain;
