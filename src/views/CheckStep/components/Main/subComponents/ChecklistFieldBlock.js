import React from "react";
import styled from "styled-components";
import { FiAlertCircle, FiCheckCircle, FiX } from "react-icons/fi";
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

// 💡 [프롭스 확장] 부모의 전체 입력 이력 배열인 currentValues를 수혈받습니다.
function ChecklistFieldBlock({
  field,
  fIdx,
  cellData,
  currentValues = [],
  onValueChange,
}) {
  const isBeforeError = cellData.before_fail === "Y";
  const isAfterError = cellData.after_fail === "Y";
  const errMessage = cellData.after_message || "확인 필요!";

  const showBefore = field.showBefore !== false;

  // 💡 [실시간 수치 연산 장치] 그룹 편차 및 각종 규격을 다이나믹하게 판별
  const checkHasError = (keyType) => {
    if (keyType === "before") return isBeforeError;
    if (keyType === "after" && isAfterError) return true;

    const val = cellData.after;
    if (val === "" || val === "-" || val === undefined || val === null)
      return false;

    const v = field.validation;
    if (!v || v.type === "none") return false;

    // ① 선택박스 불량어 검증
    if (v.type === "textCheck" && field.type === "select") {
      let rawFails = v.failValues || [];
      if (typeof rawFails === "string") rawFails = rawFails.split(",");
      const cleanSelected = String(val).trim();
      const cleanFails = Array.isArray(rawFails)
        ? rawFails.map((word) => String(word).trim())
        : [];
      if (cleanFails.includes(cleanSelected)) return true;
    }

    const numVal = Number(val);
    if (isNaN(numVal)) return false;

    // ② 최대/최소 범위 초과 체크
    if (v.type === "range") {
      const min = v.minRange ?? 0;
      const max = v.maxRange ?? 0;
      if (numVal < min || numVal > max) return true;
    }

    // ③ 최소 임계치 미달 체크
    if (v.type === "min") {
      const minLimit = v.minValue ?? 0;
      if (numVal < minLimit) return true;
    }

    // 💡 [신설] ④ 실시간 다이나믹 그룹 편차(rangeDelta) 상호 역추적 계산기 가동!
    if (v.type === "rangeDelta") {
      const limitDelta = Number(v.allowedDelta || 0);
      if (limitDelta <= 0) return false;

      // 현재 점검 포인트 내 다른 형제 필드들의 After 값들을 전부 긁어모아 정밀 숫자 배열로 파싱
      const validNumbers = currentValues
        .map((cell) => cell?.after)
        .filter(
          (val) =>
            val !== "" &&
            val !== "-" &&
            val !== undefined &&
            val !== null &&
            !isNaN(Number(val)),
        )
        .map((val) => Number(val));

      // 데이터가 혼자만 입력된 게 아니라 비교군이 형성되었을 때 실시간 분석 작동
      if (validNumbers.length > 1) {
        const maxVal = Math.max(...validNumbers);
        const minVal = Math.min(...validNumbers);
        const currentDelta = maxVal - minVal;

        // 그룹 최대치와 최소치의 격차가 빌더에서 선언한 허용 편차 한계선을 깨부수면 불량 확정
        if (currentDelta > limitDelta) return true;
      }
    }

    return false;
  };

  const isBeforeActiveError = checkHasError("before");
  const isAfterActiveError = checkHasError("after");

  // 우측 상단 메타 가이드 가독성 파서 보정
  const parseGuideText = () => {
    const v = field.validation;
    if (!v || v.type === "none") return "자율 입력";
    if (v.type === "range")
      return `기준: ${v.minRange ?? 0} ~ ${v.maxRange ?? 0}`;
    if (v.type === "rangeDelta") return `허용 편차: ±${v.allowedDelta ?? 0}`;
    if (v.type === "min") return `최소 기준: ${v.minValue ?? 0} 이상`;
    if (v.type === "textCheck") return "불량어 검증 항목";
    return "";
  };

  const guideText = parseGuideText();

  const handleBlurCheck = (keyType, val) => {
    if (!val || val.trim() === "") {
      onValueChange(fIdx, keyType, "");
    }
  };

  const renderInputField = (keyType, currentValue) => {
    const currentHasError =
      keyType === "before" ? isBeforeActiveError : isAfterActiveError;

    if (field.type === "select") {
      const optionsArray = field.select_options
        ? field.select_options
            .split(",")
            .map((o) => o.trim())
            .filter(Boolean)
        : ["정상", "이상"];

      return (
        <StyledSelect
          value={currentValue ?? ""}
          $isError={currentHasError}
          onChange={(e) => onValueChange(fIdx, keyType, e.target.value)}
        >
          <option value="">선택</option>
          {optionsArray.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </StyledSelect>
      );
    }

    return (
      <StyledInput
        type="text"
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
            color:
              field.validation && field.validation.type !== "none"
                ? "#0284c7"
                : "#64748b",
            fontWeight: "700",
            fontSize: "11px",
          }}
        >
          {guideText}
        </span>
      </div>

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

        <InputWrapper>
          <InputLabel
            style={{ color: isAfterActiveError ? "#ef4444" : "#0284c7" }}
          >
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

      {/* 상태 하단 피드백 텍스트 실시간 최종 매핑 */}
      {isAfterActiveError ? (
        <span
          style={{
            color: "#ef4444",
            fontSize: "11px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            marginTop: "2px",
            fontWeight: "700",
          }}
        >
          <FiAlertCircle size={12} />
          {/* 💡 임시저장된 백엔드 메시지가 있다면 그걸 뿌리고, 실시간 편차 초과면 편차 에러 문구를 노출 */}
          {isAfterError
            ? errMessage
            : field.validation?.type === "rangeDelta"
              ? "그룹 간 허용 오차 편차 초과!"
              : "기준 규격 미달 (경고)"}
        </span>
      ) : (
        cellData.after !== "" &&
        field.validation &&
        field.validation.type !== "none" && (
          <span
            style={{
              color: "#10b981",
              fontSize: "11px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              marginTop: "2px",
              fontWeight: "700",
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
