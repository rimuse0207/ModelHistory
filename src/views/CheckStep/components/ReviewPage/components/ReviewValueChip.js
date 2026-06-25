import React from "react";
import { MiniValueChip } from "../../styles/ReviewPage.style";

export function ReviewValueChip({
  field,
  item,
  allValues,
  parseValue,
  evaluateFieldStatus,
  getValidationGuide,
}) {
  const hasBefore = field.showBefore !== false;

  const beforeStr =
    !hasBefore || field.type === "select"
      ? "N/A"
      : parseValue(item, "before") || "-";
  const afterStr = parseValue(item, "after") || "-";

  const { isError, isMissing, message } = evaluateFieldStatus(
    field,
    beforeStr,
    afterStr,
    allValues,
  );

  const parseCleanGuide = () => {
    const v = field?.validation;
    if (!v || v.type === "none") return "";
    if (v.type === "range") return `${v.minRange ?? 0} ~ ${v.maxRange ?? 0}`;
    if (v.type === "min") return `${v.minValue ?? v.min ?? 0} 이상`;
    if (v.type === "rangeDelta" || v.type === "delta")
      return `±${v.allowedDelta ?? 0}`;
    const rawGuide = getValidationGuide(v) || "";
    return rawGuide.replace("기준: ", "").replace("최소 기준: ", "");
  };

  const cleanGuideText = parseCleanGuide();

  return (
    <MiniValueChip $isError={isError} $isMissing={isMissing}>
      <span className="field-name">
        <span>{field.col}</span>
        {cleanGuideText && (
          <span
            style={{
              fontSize: "9px",
              fontWeight: "400",
              color: isError ? "#ef4444" : "#94a3b8",
            }}
          >
            {` (${cleanGuideText})`}
          </span>
        )}
      </span>

      <div className="io-box">
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

            {/* 💡 세로 배정 밸런스를 맞추기 위해 화살표 마진 높이 보정 */}
            <div
              style={{
                color: isError ? "#fca5a5" : "#cbd5e1",
                alignSelf: "center",
                fontSize: "14px",
                marginTop: "10px",
              }}
            >
              ➔
            </div>
          </>
        )}

        <div
          className="after-segment"
          style={{ width: hasBefore ? "auto" : "100%" }}
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
            marginTop: "6px",
            textAlign: "right",
          }}
        >
          {message}
        </span>
      )}
    </MiniValueChip>
  );
}
