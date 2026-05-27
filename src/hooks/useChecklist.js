import { useState, useEffect } from "react";
import { Request_Get_Axios, Request_Post_Axios } from "../API/index";
import { useAutoSave } from "./useAutoSave";
import {
  checkCategoryIncomplete,
  validateField,
  validateFields,
  validateGroupDelta,
} from "../utils/checklistValidator";

const USER_ID = "admin_user_01";

const hasAnyInputData = (answers) => {
  if (!answers || Object.keys(answers).length === 0) return false;
  return Object.values(answers).some((ans) =>
    ans?.values?.some((val) => val?.before?.trim() || val?.after?.trim()),
  );
};

export function useChecklist() {
  const [models, setModels] = useState([
    { model_no: "DGP8761", label: "DGP8761" },
  ]);
  const [lines, setLines] = useState([
    { line_no: "Line 01", line_name: "S/N01 Line 01" },
  ]);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedLine, setSelectedLine] = useState("");

  const [categories, setCategories] = useState([]);
  const [currentCatIndex, setCurrentCatIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submissionId, setSubmissionId] = useState(null);
  const [viewMode, setViewMode] = useState("CHECK");
  const [loading, setLoading] = useState(false);
  const [lastSavedAnswersStr, setLastSavedAnswersStr] = useState("{}");

  const [tempSubmissions, setTempSubmissions] = useState([]);

  const resetSelectionState = () => {
    setAnswers({});
    setSubmissionId(null);
    setLastSavedAnswersStr("{}");
  };

  useEffect(() => {
    if (!selectedModel || !selectedLine) {
      setCategories([]);
      resetSelectionState();
      setCurrentCatIndex(0);
      return;
    }

    async function syncContext() {
      setLoading(true);
      try {
        const [masterRes, tempHistoryRes] = await Promise.all([
          Request_Get_Axios(
            `/checklist/master/${selectedModel}/${selectedLine}`,
          ),
          Request_Get_Axios(
            `/checklist/temp-list/${USER_ID}/${selectedModel}/${selectedLine}`,
          ).catch(() => ({ data: [] })),
        ]);

        if (masterRes.status) setCategories(masterRes.data);

        setAnswers({});
        setSubmissionId(null);
        setLastSavedAnswersStr("{}");
        setCurrentCatIndex(0);

        if (tempHistoryRes.status) {
          const list = tempHistoryRes.data || [];
          setTempSubmissions(list);

          if (list.length > 0) {
            alert(
              `📂 [안내] ${selectedModel} - ${selectedLine} 공정에\n작성 중이던 임시저장 데이터가 ${list.length}건 존재합니다.\n\n상단의 '임시저장 내역' 버튼을 눌러 원하는 기록을 불러올 수 있습니다.`,
            );
          }
        }
      } catch (error) {
        console.error("데이터 갱신 실패", error);
      } finally {
        setLoading(false);
      }
    }
    syncContext();
  }, [selectedModel, selectedLine]);

  useAutoSave({
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
  });

  // 💡 [수정] 배열 구조를 완벽하게 반영한 실시간 편차 검증 핸들러
  const handleAnswerChange = (answerKey, values) => {
    const [catId, pointId] = answerKey.split("_");

    // 1. 카테고리 및 포인트 매핑 (타입 무관 느슨한 비교)
    const targetCategory = categories.find(
      (c) => String(c.id).trim() == String(catId).trim(),
    );
    const targetPoint = targetCategory?.points?.find(
      (p) => String(p.pointId).trim() == String(pointId).trim(),
    );

    const targetFields = targetPoint?.fields || targetPoint?.fields_json || [];

    // 2. ⭐ [핵심 수정] safeFields 배열을 순회하며 '개별 field' 내부의 validation 객체를 보정합니다.
    const safeFields = targetFields.map((field) => {
      let v = field.validation;

      // 혹시 validation이 JSON 문자열로 넘어왔다면 파싱
      if (typeof v === "string") {
        try {
          v = JSON.parse(v);
        } catch (e) {
          v = null;
        }
      }

      // 만약 개별 필드에 validation 객체가 없다면 최상위 속성에서 직접 추출하여 복원
      if (!v) {
        const typeAttr =
          field.type || field.validation_type || field.validationType;
        const deltaAttr = field.allowedDelta || field.allowed_delta;

        if (typeAttr || deltaAttr) {
          v = {
            type: typeAttr,
            allowedDelta: deltaAttr,
            minRange: field.minRange || field.min_range,
            maxRange: field.maxRange || field.max_range,
          };
        }
      }

      return { ...field, validation: v };
    });

    // 3. 편차 검증 엔진 작동 (보정된 safeFields 배열을 통째로 전달)
    const groupBefore = validateGroupDelta(safeFields, values, "before");
    const groupAfter = validateGroupDelta(safeFields, values, "after");

    // 4. 개별 필드 루프를 돌며 fail 플래그 ('Y' / 'N') 최종 매핑
    const evaluatedValues = values.map((val, fIdx) => {
      const fieldMeta = safeFields[fIdx];
      if (!fieldMeta) return { ...val, before_fail: "N", after_fail: "N" };

      // 단일 필드 규격 검증 (min, max 등)
      const beforeResult = validateField(fieldMeta, val?.before || "");
      const afterResult = validateField(fieldMeta, val?.after || "");

      // 내 규격이 깨졌거나, 우리 조(5개 필드)의 전체 편차 한계선을 넘었다면 불량('Y')
      const isBeforeError = beforeResult.isError || groupBefore.isError;
      const isAfterError = afterResult.isError || groupAfter.isError;

      return {
        ...val,
        before_fail: isBeforeError ? "Y" : "N",
        after_fail: isAfterError ? "Y" : "N",
        after_message: afterResult.isError
          ? afterResult.message
          : groupAfter.isError
            ? groupAfter.message
            : "",
        before_message: beforeResult.isError
          ? beforeResult.message
          : groupBefore.isError
            ? groupBefore.message
            : "",
      };
    });

    setAnswers((prev) => ({
      ...prev,
      [answerKey]: { values: evaluatedValues },
    }));
  };

  // 💡 [수정] 복구 로직도 동일하게 타입 방어선 구축 및 fields_json 예외 처리 보완
  const handleRestoreTemp = async (targetSubmissionId) => {
    if (!targetSubmissionId) return;

    setLoading(true);
    try {
      const response = await Request_Get_Axios(
        `/checklist/temp-detail/${targetSubmissionId}`,
      );

      if (response.status) {
        const targetData = response.data;
        const restoredAnswers = targetData.answers || {};
        const reEvaluatedAnswers = { ...restoredAnswers };

        categories.forEach((cat) => {
          const pointsArray = cat.points || [];
          pointsArray.forEach((point) => {
            const answerKey = `${cat.id}_${point.pointId}`;

            if (!reEvaluatedAnswers[answerKey]?.values) return;

            const currentValues = reEvaluatedAnswers[answerKey].values;
            const targetFields = point.fields || point.fields_json || [];

            const groupBefore = validateGroupDelta(
              targetFields,
              currentValues,
              "before",
            );
            const groupAfter = validateGroupDelta(
              targetFields,
              currentValues,
              "after",
            );

            const evaluatedValues = currentValues.map((val, fIdx) => {
              const fieldMeta = targetFields[fIdx];
              if (!fieldMeta) return val;

              const beforeResult = validateField(fieldMeta, val?.before || "");
              const afterResult = validateField(fieldMeta, val?.after || "");

              return {
                ...val,
                before_fail:
                  beforeResult.isError || groupBefore.isError ? "Y" : "N",
                after_fail:
                  afterResult.isError || groupAfter.isError ? "Y" : "N",
                after_message: afterResult.isError
                  ? afterResult.message
                  : groupAfter.isError
                    ? groupAfter.message
                    : "",
                before_message: beforeResult.isError
                  ? beforeResult.message
                  : groupBefore.isError
                    ? groupBefore.message
                    : "",
              };
            });

            reEvaluatedAnswers[answerKey] = { values: evaluatedValues };
          });
        });

        setAnswers(reEvaluatedAnswers);
        setSubmissionId(targetData.submissionId);
        setLastSavedAnswersStr(JSON.stringify(reEvaluatedAnswers));

        alert("선택하신 임시저장 데이터로 폼이 정상 복구되었습니다.");
      } else {
        alert("데이터를 불러오지 못했습니다.");
      }
    } catch (e) {
      console.error("임시저장 복구 실패", e);
      alert("서버 통신 오류로 임시저장 데이터 로드 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleTempSave = async () => {
    if (!selectedModel || !selectedLine)
      return alert("모델과 라인을 모두 지정해 주세요.");
    if (!hasAnyInputData(answers))
      return alert("입력된 점검 항목이 없어 임시저장을 진행하지 않습니다.");

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
        const newId = response.data.submissionId;
        setSubmissionId(newId);
        setLastSavedAnswersStr(JSON.stringify(answers));
        alert("현재 라인 기준으로 DB에 임시저장되었습니다.");

        const updatedRes = await Request_Get_Axios(
          `/checklist/temp-list/${USER_ID}/${selectedModel}/${selectedLine}`,
        ).catch(() => null);
        if (updatedRes.status) setTempSubmissions(updatedRes.data.data);
      }
    } catch (e) {
      alert("임시 저장 실패");
    }
  };

  const handleFinalSave = async () => {
    const missingCategories = categories
      .map((cat) => ({ cat, ...checkCategoryIncomplete(cat, answers) }))
      .filter((res) => res.isIncomplete);

    if (missingCategories.length > 0) {
      const totalCount = missingCategories.reduce(
        (acc, cur) => acc + cur.missingCount,
        0,
      );
      const labels = missingCategories
        .map((res) => `${res.cat.category}(${res.missingCount}건)`)
        .join(", ");
      return alert(
        `❌ 최종 확정 불가\n\n누락 항목이 총 ${totalCount}건 존재합니다.\n\n[누락 카테고리]\n${labels}`,
      );
    }

    const { hasError, errorCount, errorItems } = validateFields(
      categories,
      answers,
    );
    if (hasError) {
      console.warn("⚠️ 범위 이탈 불량 항목 명세:", errorItems);
      if (
        !window.confirm(
          `⚠️ 경고: 오차 기준을 벗어난 불량 항목이 ${errorCount}개 있습니다.\n\n이대로 강제 확정 저장하시겠습니까?`,
        )
      )
        return;
    }

    try {
      const response = await Request_Post_Axios(`/checklist/save`, {
        submissionId,
        userId: USER_ID,
        modelNo: selectedModel,
        lineNo: selectedLine,
        status: "COMPLETED",
        answers,
      });

      if (response.status) {
        alert("🎉 최종 점검 기록이 성공적으로 확정 저장되었습니다!");
        resetSelectionState();
        setSelectedModel("");
        setSelectedLine("");
        setViewMode("CHECK");
      }
    } catch (e) {
      alert("최종 저장 처리 실패");
    }
  };

  return {
    models,
    lines,
    selectedModel,
    setSelectedModel,
    selectedLine,
    setSelectedLine,
    categories,
    currentCatIndex,
    setCurrentCatIndex,
    answers,
    submissionId,
    viewMode,
    setViewMode,
    loading,
    handleAnswerChange,
    handleTempSave,
    handleFinalSave,
    tempSubmissions,
    handleRestoreTemp,
  };
}
