import React from "react";

function ChecklistHeader({
  models,
  lines,
  selectedModel,
  setSelectedModel,
  selectedLine,
  setSelectedLine,
  handleTempSave,
  tempCount = 0,
  onOpenTempModal,
}) {
  return (
    <div
      style={{
        margin: "20px",
        padding: "16px",
        background: "#f8fafc",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        alignItems: "center",
      }}
    >
      <div>
        <label
          style={{ fontWeight: "700", marginRight: "10px", color: "#334155" }}
        >
          모델 번호:
        </label>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
          }}
        >
          <option value="">-- 선택 --</option>
          {models.map((m) => (
            <option key={m.model_no} value={m.model_no}>
              {m.model_no}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          style={{ fontWeight: "700", marginRight: "10px", color: "#334155" }}
        >
          시리얼번호:
        </label>
        <select
          value={selectedLine}
          onChange={(e) =>
            !selectedModel
              ? alert("모델을 먼저 선택하셔야 합니다.")
              : setSelectedLine(e.target.value)
          }
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
          }}
        >
          <option value="">-- 선택 --</option>
          {lines.map((l) => (
            <option key={l.line_no} value={l.line_no}>
              {l.line_name}
            </option>
          ))}
        </select>
      </div>

      {/* 🌟 모델과 라인이 모두 선택되었을 때만 제어 버튼 박스 노출 */}
      {selectedModel && selectedLine && (
        <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
          {/* 1. 새로 추가된 임시저장 목록 불러오기 트리거 버튼 */}
          <button
            type="button"
            onClick={onOpenTempModal}
            style={{
              padding: "8px 14px",
              background: "#ffffff",
              color: "#475569",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.2s",
            }}
          >
            임시저장 내역 ({tempCount})
          </button>

          {/* 2. 기존 현재 라인 수동 저장 버튼 */}
          <button
            type="button"
            onClick={handleTempSave}
            style={{
              padding: "8px 14px",
              background: "#475569",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            현재 라인 임시저장
          </button>
        </div>
      )}
    </div>
  );
}

export default ChecklistHeader;
