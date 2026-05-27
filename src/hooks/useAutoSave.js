import { useEffect, useRef } from "react";
import { Request_Post_Axios } from "../API";

export function useAutoSave({
  selectedModel,
  selectedLine,
  answers,
  lastSavedAnswersStr,
  setLastSavedAnswersStr,
  currentCatIndex,
  viewMode,
  submissionId,
  setSubmissionId,
  USER_ID,
  hasAnyInputData,
}) {
  const prevIndexRef = useRef(currentCatIndex);
  const prevViewModeRef = useRef(viewMode);

  useEffect(() => {
    if (!selectedModel || !selectedLine) {
      updateRefs();
      return;
    }

    const currentAnswersStr = JSON.stringify(answers);
    const isDataChanged = currentAnswersStr !== lastSavedAnswersStr;
    const hasData = hasAnyInputData(answers);

    if (!isDataChanged || !hasData) {
      updateRefs();
      return;
    }

    const isIndexChanged = prevIndexRef.current !== currentCatIndex;
    const isMovedToReview =
      prevViewModeRef.current === "CHECK" && viewMode === "REVIEW";

    if (isIndexChanged || isMovedToReview) {
      async function autoTempSave() {
        try {
          const response = await Request_Post_Axios(`/checklist/save`, {
            submissionId,
            userId: USER_ID,
            modelNo: selectedModel,
            lineNo: selectedLine,
            status: "TEMP",
            answers,
          });

          if (response.status) {
            setSubmissionId(response.data.submissionId);
            setLastSavedAnswersStr(currentAnswersStr);
            console.log(
              `[자동 저장 완료] 변경사항이 DB에 임시 저장되었습니다.`,
            );
          }
        } catch (e) {
          console.error("자동 임시 저장 실패:", e);
        }
      }
      autoTempSave();
    }

    updateRefs();
  }, [
    currentCatIndex,
    viewMode,
    selectedModel,
    selectedLine,
    answers,
    lastSavedAnswersStr,
    submissionId,
  ]);

  const updateRefs = () => {
    prevIndexRef.current = currentCatIndex;
    prevViewModeRef.current = viewMode;
  };
}
