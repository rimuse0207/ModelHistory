import { useState, useMemo } from "react";
import { validateField, getValidationGuide } from "../utils/checklistValidator";

export const useReview = (categories = [], answers = {}) => {
  const [openSections, setOpenSections] = useState(() => {
    if (!categories || !Array.isArray(categories)) return {};

    return categories.reduce((acc, list) => {
      const currentCatId = list.id || list.cat_id || "";
      if (currentCatId) {
        acc[currentCatId] = true;
      }
      return acc;
    }, {});
  });

  const toggleSection = (catId) => {
    setOpenSections((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  /**
   * 2. 원시 데이터 값 파싱 유틸리티 (Hook 내부 캡슐화)
   */
  const parseValue = (item, type) => {
    if (!item) return "";
    if (typeof item === "string") return item;
    if (typeof item === "object") {
      if (item[type] !== undefined) return item[type];
      if (item.value !== undefined) return item.value;
    }
    return "";
  };

  /**
   * 3. QuestionCard 데이터 키 정밀 매칭 매니저
   */
  const getSavedPointData = (cat, point) => {
    const cId = cat.id || cat.cat_id || "";
    const pId = point.pointId || point.point_id || "";
    const pName = point.name || point.point_name || "";

    const keyCandidates = [`${cId}_${pId}`, `${cId}_${pName}`, pId];

    for (const key of keyCandidates) {
      if (key && answers[key]) {
        return answers[key];
      }
    }
    return null;
  };
  /**
   * 4. 단일 필드 검증 및 상태 평가 엔진 (수리 완료본)
   */
  const evaluateFieldStatus = (field, beforeStr, afterStr, allValues = []) => {
    const isMissing =
      !afterStr || afterStr === "-" || String(afterStr).trim() === "";

    if (field.validation && isMissing) {
      return {
        isError: true,
        isMissing: true,
        message: "측정 데이터 누락",
      };
    }

    const singleResult = validateField(field, afterStr);

    if (singleResult.isError) {
      return {
        isError: true,
        isMissing: false,
        message: singleResult.message,
      };
    }

    if (field.validation?.type === "rangeDelta" && allValues.length > 0) {
      const afterNums = allValues
        .map((v) => {
          const rawVal = v?.after !== undefined ? v.after : v;
          return parseFloat(rawVal);
        })
        .filter((n) => !isNaN(n));

      if (afterNums.length > 1) {
        const maxA = Math.max(...afterNums);
        const minA = Math.min(...afterNums);
        const diff = maxA - minA;
        const allowed = parseFloat(field.validation.allowedDelta || 0);

        if (diff > allowed) {
          return {
            isError: true,
            isMissing: false,
            message: `최대 편차 초과 (오차: ${diff.toFixed(2)})`,
          };
        }
      }
    }

    return {
      isError: false,
      isMissing: isMissing,
      message: "",
    };
  };

  const summary = useMemo(() => {
    let missingCount = 0;
    let totalErrorCount = 0;

    categories.forEach((cat) => {
      const pointsArray = cat.points || [];
      pointsArray.forEach((point) => {
        const savedPoint = getSavedPointData(cat, point);
        const fieldsArray = point.fields || point.fields_json || [];
        const allValues = savedPoint?.values || [];

        fieldsArray.forEach((field, fIdx) => {
          const item = allValues[fIdx];
          const beforeStr =
            field.type === "select" ? "N/A" : parseValue(item, "before") || "";
          const afterStr = parseValue(item, "after") || "";

          const { isError, isMissing } = evaluateFieldStatus(
            field,
            beforeStr,
            afterStr,
            allValues,
          );

          if (isMissing) missingCount++;
          if (isError) totalErrorCount++;
        });
      });
    });

    return { missingCount, totalErrorCount };
  }, [categories, answers]);

  return {
    openSections,
    toggleSection,
    parseValue,
    getSavedPointData,
    evaluateFieldStatus,
    getValidationGuide,
    missingCount: summary.missingCount,
    totalErrorCount: summary.totalErrorCount,
  };
};
