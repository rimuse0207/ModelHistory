import React from "react";
import { MiniValueChip } from "../../styles/ReviewPage.style";

export function ReviewValueChip({
  field,
  item,
  allValues, // 해당 Point에 속한 5개 필드의 전체 데이터 배열
  parseValue,
  evaluateFieldStatus,
  getValidationGuide,
}) {
  // 💡 showBefore 속성이 명시적으로 false가 아닐 때만 Before를 가동합니다.
  const hasBefore = field.showBefore !== false;

  const beforeStr =
    !hasBefore || field.type === "select"
      ? "N/A"
      : parseValue(item, "before") || "-";
  const afterStr = parseValue(item, "after") || "-";

  // 단일 필드 텍스트뿐만 아니라, 전체 배열(allValues)도 훅/엔진에 함께 전달
  const { isError, isMissing, message } = evaluateFieldStatus(
    field,
    beforeStr,
    afterStr,
    allValues,
  );

  return (
    <MiniValueChip $isError={isError} $isMissing={isMissing}>
      <span className="field-name">
        <span>{field.col}</span>
        {getValidationGuide(field.validation) !== "자율 입력" && (
          <span
            style={{
              fontSize: "9px",
              fontWeight: "400",
              color: isError ? "#ef4444" : "#94a3b8",
            }}
          >
            {` (${getValidationGuide(field.validation).replace("기준: ", "")})`}
          </span>
        )}
      </span>

      <div className="io-box">
        {/* 💡 [Before 조건부 렌더링] showBefore가 true일 때만 Before 세그먼트 노출 */}
        {hasBefore && (
          <>
            <div className="before-segment">
              <span className="sub-label">Before</span>
              <span
                className="val"
                style={{
                  color:
                    beforeStr === "-" || beforeStr === "N/A"
                      ? "#94a3b8"
                      : "#475569",
                }}
              >
                {beforeStr}
              </span>
            </div>

            {/* Before가 있을 때만 화살표(➔) 노출 */}
            <div
              style={{
                color: isError ? "#fca5a5" : "#cbd5e1",
                alignSelf: "center",
                fontSize: "12px",
              }}
            >
              ➔
            </div>
          </>
        )}

        {/* After 세그먼트는 언제나 노출 */}
        <div
          className="after-segment"
          style={{ width: hasBefore ? "auto" : "100%" }} // 💡 Before가 없으면 After가 가로 너비를 꽉 채우도록 유연성 확보
        >
          <span className="sub-label">After</span>
          <span
            className="val"
            style={{
              color: isError
                ? "#b91c1c"
                : afterStr === "-"
                  ? "#94a3b8"
                  : "#0f172a",
              fontWeight: "800",
            }}
          >
            {afterStr}
          </span>
        </div>
      </div>

      {isError && (
        <span
          style={{
            fontSize: "9px",
            color: "#b91c1c",
            fontWeight: "600",
            marginTop: "4px",
            textAlign: "right",
          }}
        >
          {message}
        </span>
      )}
    </MiniValueChip>
  );
}
