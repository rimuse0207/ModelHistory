import React from "react";
import { FiX } from "react-icons/fi";
import * as S from "../styles/BuilderStyles";

function FieldGridRow({ field, cIdx, pIdx, fIdx, ctx }) {
  const currentAlgo = field.validation?.type || "none";
  const isSelectType = field.type === "select";
  const isTextType = field.type === "text";
  const selectOptionsArray = field.select_options
    ? field.select_options
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean)
    : [];
  const isSelectOptionsEmpty = isSelectType && selectOptionsArray.length === 0;

  return (
    <div style={{ marginBottom: "14px" }}>
      <S.FieldConfigureGridRow>
        <S.GridItem>
          <S.GridLabel>필드명(col)</S.GridLabel>
          <S.GridInput
            value={field.col}
            onChange={(e) =>
              ctx.updateFieldMeta(cIdx, pIdx, fIdx, "col", e.target.value)
            }
          />
        </S.GridItem>
        <S.GridItem>
          <S.GridLabel>입력 타입</S.GridLabel>
          <S.GridSelect
            value={field.type}
            onChange={(e) =>
              ctx.updateFieldMeta(cIdx, pIdx, fIdx, "type", e.target.value)
            }
          >
            <option value="number">숫자 기입형 (number)</option>
            <option value="text">일반 텍스트 (text)</option>
            <option value="select">선택박스 (select)</option>
          </S.GridSelect>
        </S.GridItem>
        <S.GridItem>
          <S.GridLabel>Before 영역</S.GridLabel>
          <S.GridSelect
            value={field.prev_value}
            onChange={(e) =>
              ctx.updateFieldMeta(
                cIdx,
                pIdx,
                fIdx,
                "prev_value",
                e.target.value,
              )
            }
          >
            <option value="Y">☑ Before 오픈</option>
            <option value="N">☒ Before 숨김</option>
          </S.GridSelect>
        </S.GridItem>
        <S.GridItem>
          <S.GridLabel>검증 알고리즘</S.GridLabel>
          <S.GridSelect
            value={currentAlgo}
            onChange={(e) =>
              ctx.updateFieldMeta(
                cIdx,
                pIdx,
                fIdx,
                "validation_type",
                e.target.value,
              )
            }
            disabled={isSelectOptionsEmpty}
          >
            {isSelectType || isTextType ? (
              <>
                <option value="textCheck">텍스트 불량 매칭 검증</option>
                <option value="none">자율 입력 항목</option>
              </>
            ) : (
              <>
                <option value="range">최대/최소 바운더리(range)</option>
                <option value="rangeDelta">실시간 그룹 편차 검증</option>
                <option value="min">최소 임계치 필터(min)</option>
                <option value="none">자율 입력 항목</option>
              </>
            )}
          </S.GridSelect>
        </S.GridItem>

        <S.GridItem style={{ gridColumn: "span 1" }}>
          {isSelectOptionsEmpty ? (
            <>
              <S.GridLabel style={{ color: "#ef4444" }}>
                ⚠️ 조건 대기
              </S.GridLabel>
              <S.GridInput
                value="하단 선택지를 먼저 입력하세요"
                disabled
                style={{
                  border: "1px dashed #fca5a5",
                  color: "#ef4444",
                  fontSize: "11px",
                }}
              />
            </>
          ) : currentAlgo === "range" ? (
            <S.FlexRangeRow>
              <S.GridInput
                as="input"
                type="text"
                inputMode="text"
                placeholder="Min"
                value={field.validation?.minRange ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  // 💡 완화된 하이브리드 정규 가드레일 작동
                  if (
                    val === "" ||
                    val === "-" ||
                    val === "-." ||
                    val === "." ||
                    !isNaN(val)
                  ) {
                    ctx.updateFieldMeta(cIdx, pIdx, fIdx, "minRange", val);
                  }
                }}
              />
              <span>~</span>
              <S.GridInput
                as="input"
                type="text"
                inputMode="text"
                placeholder="Max"
                value={field.validation?.maxRange ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (
                    val === "" ||
                    val === "-" ||
                    val === "-." ||
                    val === "." ||
                    !isNaN(val)
                  ) {
                    ctx.updateFieldMeta(cIdx, pIdx, fIdx, "maxRange", val);
                  }
                }}
              />
            </S.FlexRangeRow>
          ) : currentAlgo === "rangeDelta" ? (
            /* 💡 오차 한계치 영역도 음수가 가능하게 가치 사슬 확장 */
            <S.GridInput
              as="input"
              type="text"
              inputMode="text"
              placeholder="0"
              value={field.validation?.allowedDelta ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                if (
                  val === "" ||
                  val === "-" ||
                  val === "-." ||
                  val === "." ||
                  !isNaN(val)
                ) {
                  ctx.updateFieldMeta(cIdx, pIdx, fIdx, "allowedDelta", val);
                }
              }}
            />
          ) : currentAlgo === "min" ? (
            <S.GridInput
              as="input"
              type="text"
              inputMode="text"
              placeholder="0"
              value={field.validation?.minValue ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                if (
                  val === "" ||
                  val === "-" ||
                  val === "-." ||
                  val === "." ||
                  !isNaN(val)
                ) {
                  ctx.updateFieldMeta(cIdx, pIdx, fIdx, "minValue", val);
                }
              }}
            />
          ) : currentAlgo === "textCheck" && isSelectType ? (
            <S.DynamicCheckboxGroup>
              {selectOptionsArray.map((opt) => {
                const isChecked = field.validation?.failValues?.includes(opt);
                return (
                  <S.CheckboxLabel key={opt} $checked={isChecked}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() =>
                        ctx.updateFieldMeta(
                          cIdx,
                          pIdx,
                          fIdx,
                          "toggle_fail_value",
                          opt,
                        )
                      }
                    />
                    {opt}
                  </S.CheckboxLabel>
                );
              })}
            </S.DynamicCheckboxGroup>
          ) : currentAlgo === "textCheck" && isTextType ? (
            <S.GridInput
              type="text"
              placeholder="예: NG,불량 (쉼표 구분)"
              value={field.validation?.failValues?.join(",") || ""}
              onChange={(e) =>
                ctx.updateFieldMeta(
                  cIdx,
                  pIdx,
                  fIdx,
                  "failValues",
                  e.target.value.split(","),
                )
              }
            />
          ) : (
            <S.GridInput value="검증 면제 상태" disabled />
          )}
        </S.GridItem>

        <S.GridActionItem>
          <S.FieldDeleteCircleButton
            onClick={() => ctx.removeField(cIdx, pIdx, fIdx)}
          >
            <FiX size={14} />
          </S.FieldDeleteCircleButton>
        </S.GridActionItem>
      </S.FieldConfigureGridRow>

      {isSelectType && (
        <S.DynamicOptionBar>
          <S.OptionLabel>
            셀렉트 콤보박스 선택지 목록 (쉼표(,)로 구분)
          </S.OptionLabel>
          <S.OptionInput
            type="text"
            placeholder="예: 정상,이상,보류"
            value={field.select_options || ""}
            onChange={(e) =>
              ctx.updateFieldMeta(
                cIdx,
                pIdx,
                fIdx,
                "select_options",
                e.target.value,
              )
            }
          />
        </S.DynamicOptionBar>
      )}
    </div>
  );
}

export default FieldGridRow;
