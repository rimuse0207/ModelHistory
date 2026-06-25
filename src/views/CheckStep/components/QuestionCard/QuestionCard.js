import React from "react";
import styled from "styled-components";
import { FiAlertCircle, FiCheckCircle, FiSave, FiEdit3 } from "react-icons/fi";
import { theme } from "../../../../styles/theme";
import ChecklistFieldBlock from "../Main/subComponents/ChecklistFieldBlock";

const mobileBreakpoint = theme.media?.sizes?.mobile || "768px";

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
  background-color: ${(props) => props.$bgColor};
  color: ${(props) => props.$color};
`;

const FlexibleRow = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 24px;
  padding: 24px 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: ${mobileBreakpoint}) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 18px 0;
  }
`;

const FieldsContainer = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  width: 100%;
`;

function QuestionCard({
  currentCategory,
  answers,
  onAnswerChange,
  isSaved = false,
}) {
  const catId = currentCategory.id;
  let missingFieldsCount = 0;

  // 1. 누락 항목 집계 파트
  currentCategory.points?.forEach((point) => {
    const answerKey = `${catId}_${point.pointId}`;
    const currentValues = answers[answerKey]?.values || [];

    point.fields?.forEach((field, fIdx) => {
      const cellData = currentValues[fIdx] || { before: "", after: "" };

      // 마스터 정보의 showBefore 가이드를 100% 신뢰
      const showBefore = field.showBefore !== false;

      const isAfterEmpty =
        !cellData.after || String(cellData.after).trim() === "";
      const isBeforeEmpty =
        showBefore && field.type !== "select"
          ? !cellData.before || String(cellData.before).trim() === ""
          : false;

      // 규격 검증 종류가 'none'(자율입력)이 아닌 필수 기입 대상인데 비어있는 경우 집계

      if (isAfterEmpty || isBeforeEmpty) {
        missingFieldsCount++;
      }
    });
  });

  const isCategoryIncomplete = missingFieldsCount > 0;

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#fff",
        borderRadius: "14px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "8px",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#0f172a",
              marginBottom: "4px",
            }}
          >
            {currentCategory.category}
          </h3>
          <p style={{ color: "#64748b", fontSize: "14px" }}>
            {currentCategory.title}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "6px",
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          {isSaved ? (
            <StatusBadge $bgColor="#e0f2fe" $color="#0369a1">
              <FiSave size={12} /> 임시저장됨
            </StatusBadge>
          ) : (
            <StatusBadge $bgColor="#f8fafc" $color="#64748b">
              <FiEdit3 size={12} /> 작성 중
            </StatusBadge>
          )}

          {isCategoryIncomplete ? (
            <StatusBadge $bgColor="#fff7ed" $color="#c2410c">
              <FiAlertCircle size={12} /> 누락 {missingFieldsCount}건
            </StatusBadge>
          ) : (
            <StatusBadge $bgColor="#ecfdf5" $color="#047857">
              <FiCheckCircle size={12} /> 누락 없음
            </StatusBadge>
          )}
        </div>
      </div>

      <div style={{ marginTop: "12px" }}>
        {currentCategory.points?.map((point) => {
          const answerKey = `${catId}_${point.pointId}`;
          const fieldsCount = point.fields?.length || 0;

          // 💡 [핵심 수정] 하드코딩(5)을 제거하고, 실제 백엔드가 내려준 가변 필드 수(fieldsCount)만큼 배열을 동적으로 밀어줍니다.
          const currentValues =
            answers[answerKey]?.values ||
            Array(fieldsCount)
              .fill(null)
              .map(() => ({
                before: "",
                after: "",
                before_fail: "N",
                after_fail: "N",
                before_message: "",
                after_message: "",
              }));

          const handleNestedValueChange = (fIdx, keyType, val) => {
            const nextVals = [...currentValues];
            nextVals[fIdx] = { ...nextVals[fIdx], [keyType]: val };
            onAnswerChange(answerKey, nextVals);
          };

          return (
            <FlexibleRow key={point.pointId || point.name}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifycontent: "center",
                }}
              >
                <span
                  style={{
                    fontWeight: "600",
                    color: "#1e293b",
                    fontSize: "15px",
                  }}
                >
                  {point.name}
                </span>
              </div>

              <FieldsContainer>
                {point.fields?.map((field, fIdx) => {
                  const cellData = currentValues[fIdx] || {
                    before: "",
                    after: "",
                    before_fail: "N",
                    after_fail: "N",
                    after_message: "",
                  };

                  return (
                    <ChecklistFieldBlock
                      key={fIdx}
                      field={field}
                      fIdx={fIdx}
                      cellData={cellData}
                      currentValues={currentValues}
                      isBeforeFail={cellData.before_fail === "Y"}
                      isAfterFail={cellData.after_fail === "Y"}
                      errorMessage={cellData.after_message || ""}
                      onValueChange={(fieldIndex, keyType, value) => {
                        handleNestedValueChange(fieldIndex, keyType, value);
                      }}
                    />
                  );
                })}
              </FieldsContainer>
            </FlexibleRow>
          );
        })}
      </div>
    </div>
  );
}

export default QuestionCard;
