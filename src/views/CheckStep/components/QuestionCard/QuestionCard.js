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

  currentCategory.points.forEach((point) => {
    const answerKey = `${catId}_${point.pointId}`;
    const currentValues = answers[answerKey]?.values || [];

    point.fields.forEach((field, fIdx) => {
      const cellData = currentValues[fIdx] || { before: "", after: "" };
      const showBefore = field.showBefore !== false;
      const isAfterEmpty =
        !cellData.after || String(cellData.after).trim() === "";
      const isBeforeEmpty =
        showBefore && field.type !== "select"
          ? !cellData.before || String(cellData.before).trim() === ""
          : false;

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
      {/* 상단 뷰 제어 헤더 명세 배지 영역 */}
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

      {/* 내부 실시간 대시보드 리스트 바디 */}
      <div style={{ marginTop: "12px" }}>
        {currentCategory.points.map((point) => {
          const answerKey = `${catId}_${point.pointId}`;
          const currentValues =
            answers[answerKey]?.values ||
            Array(point.fields.length)
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
              {/* 좌측: 항목 텍스트 라벨 파트 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
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
                <span
                  style={{
                    fontSize: "12px",
                    color: "#94a3b8",
                    marginTop: "4px",
                  }}
                >
                  과거 이력:{" "}
                  {point.fields
                    .map((f) => `${f.col}(${f.prevValue || "-"})`)
                    .join(", ")}
                </span>
              </div>

              <FieldsContainer>
                {point.fields.map((field, fIdx) => {
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
                      isBeforeFail={cellData.before_fail === "Y"}
                      isAfterFail={cellData.after_fail === "Y"}
                      errorMessage={cellData.after_message || ""}
                      // 💡 [핵심 수정] 하위 인풋 블록에서 올라오는 이벤트를 명확한 인자 구조로 매핑합니다.
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
