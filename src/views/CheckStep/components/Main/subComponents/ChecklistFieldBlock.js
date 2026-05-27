import React from "react";
import styled from "styled-components";
import { FiAlertCircle, FiCheckCircle, FiX } from "react-icons/fi";
import { getValidationGuide } from "../../../../../utils/checklistValidator";
import { theme } from "../../../../../styles/theme";

const mobileBreakpoint = theme.media?.sizes?.mobile || "768px";

const FieldBlock = styled.div`
  flex: 1;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 6px;

  @media (max-width: ${mobileBreakpoint}) {
    min-width: 100%;
  }
`;

const InputPairRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;
const DynamicInputPairRow = styled.div`
  display: grid;
  grid-template-columns: ${(props) => (props.$showBefore ? "1fr 1fr" : "1fr")};
  gap: 10px;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InputLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px 28px 10px 10px;
  font-size: 14px;
  border-radius: 6px;
  outline: none;
  text-align: ${(props) => (props.type === "number" ? "center" : "left")};
  background-color: ${(props) => (props.$isError ? "#fff5f5" : "#ffffff")};
  border: 1px solid ${(props) => (props.$isError ? "#ef4444" : "#e2e8f0")};
  transition: all 0.2s ease;

  &:focus {
    border-color: ${(props) => (props.$isError ? "#ef4444" : "#3b82f6")};
    box-shadow: 0 0 0 2px ${(props) => (props.$isError ? "#ffeeee" : "#e0f2fe")};
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 10px 28px 10px 10px;
  font-size: 14px;
  border-radius: 6px;
  outline: none;
  background-color: ${(props) => (props.$isError ? "#fff5f5" : "#ffffff")};
  border: 1px solid ${(props) => (props.$isError ? "#ef4444" : "#e2e8f0")};
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;

  &:focus {
    border-color: ${(props) => (props.$isError ? "#ef4444" : "#3b82f6")};
    box-shadow: 0 0 0 2px ${(props) => (props.$isError ? "#ffeeee" : "#e0f2fe")};
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 6px;
  top: 29px;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border-radius: 50%;
  z-index: 5;

  &:hover {
    background-color: #f1f5f9;
    color: #475569;
  }
`;

function ChecklistFieldBlock({ field, fIdx, cellData, onValueChange }) {
  // 💡 [변경] 자체 validateField를 제거하고 부모가 이미 연산해서 answers에 구워준 플래그를 가져옵니다.
  const isBeforeError = cellData.before_fail === "Y";
  const isAfterError = cellData.after_fail === "Y";

  // 만약 훅 데이터 구조에 메시지를 함께 구워두지 않았다면 디폴트 문구를 설정합니다.
  const errMessage = cellData.after_message || "허용 편차 기준 초과";
  const guideText = getValidationGuide(field.validation);

  const showBefore = field.showBefore !== false;

  const handleBlurCheck = (keyType, val) => {
    if (!val || val.trim() === "") {
      onValueChange(fIdx, keyType, "");
    }
  };

  const renderInputField = (keyType, currentValue) => {
    // 해당 타겟(before/after)에 맞는 에러 상태 설정
    const currentHasError = keyType === "before" ? isBeforeError : isAfterError;

    if (field.type === "select") {
      return (
        <StyledSelect
          value={currentValue ?? ""}
          $isError={currentHasError}
          onChange={(e) => onValueChange(fIdx, keyType, e.target.value)}
        >
          <option value="">선택</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </StyledSelect>
      );
    }

    return (
      <StyledInput
        type={field.type === "number" ? "number" : "text"}
        placeholder={keyType === "before" ? "측정치" : "최종치"}
        value={currentValue ?? ""}
        $isError={currentHasError}
        onChange={(e) => onValueChange(fIdx, keyType, e.target.value)}
        onBlur={(e) => handleBlurCheck(keyType, e.target.value)}
      />
    );
  };

  return (
    <FieldBlock>
      {/* 타이틀 및 스펙 표시 가이드라인 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "12px",
          marginBottom: "2px",
        }}
      >
        <span style={{ fontWeight: "700", color: "#334155" }}>{field.col}</span>
        <span
          style={{
            color: field.validation ? "#0284c7" : "#64748b",
            fontWeight: "500",
            fontSize: "11px",
          }}
        >
          {guideText}
        </span>
      </div>

      {/* 작업 전 (Before) */}
      <DynamicInputPairRow $showBefore={showBefore}>
        {showBefore && (
          <InputWrapper>
            <InputLabel
              style={{ color: isBeforeError ? "#ef4444" : "#64748b" }}
            >
              작업 전 (Before)
            </InputLabel>
            {renderInputField("before", cellData.before)}
            {cellData.before !== "" && field.type !== "select" && (
              <ClearButton
                type="button"
                onClick={() => onValueChange(fIdx, "before", "")}
              >
                <FiX size={12} />
              </ClearButton>
            )}
          </InputWrapper>
        )}

        {/* 작업 후 (After) */}
        <InputWrapper>
          <InputLabel style={{ color: isAfterError ? "#ef4444" : "#0284c7" }}>
            작업 후 (After)
          </InputLabel>
          {renderInputField("after", cellData.after)}
          {cellData.after !== "" && field.type !== "select" && (
            <ClearButton
              type="button"
              onClick={() => onValueChange(fIdx, "after", "")}
            >
              <FiX size={12} />
            </ClearButton>
          )}
        </InputWrapper>
      </DynamicInputPairRow>

      {/* 상태 하단 피드백 텍스트 */}
      {isAfterError ? (
        <span
          style={{
            color: "#ef4444",
            fontSize: "11px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            marginTop: "2px",
            fontWeight: "500",
          }}
        >
          <FiAlertCircle size={12} /> {errMessage}
        </span>
      ) : (
        // 💡 값이 하나라도 존재하고, 에러가 없는 정상 스펙 충족 상태일 때
        (cellData.before !== "" || cellData.after !== "") &&
        field.validation && (
          <span
            style={{
              color: "#10b981",
              fontSize: "11px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              marginTop: "2px",
              fontWeight: "500",
            }}
          >
            <FiCheckCircle size={12} /> 조건 충족
          </span>
        )
      )}
    </FieldBlock>
  );
}

export default ChecklistFieldBlock;
