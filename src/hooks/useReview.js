import { useState, useMemo } from "react";
import { validateField, getValidationGuide } from "../utils/checklistValidator";

export const useReview = (categories = [], answers = {}) => {
  // 1. 첫 카테고리 디폴트 오픈 상태 정의
  const initialOpenKey = categories?.id || categories?.cat_id || "";
  const [openSections, setOpenSections] = useState({
    [initialOpenKey]: true,
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
   * 4. 단일 필드 검증 및 상태 평가 엔진
   */
  const evaluateFieldStatus = (field, beforeStr, afterStr, allValues = []) => {
    // 1. 기존 개별 밸리데이션 검사 실행
    const singleResult = validateField(field, afterStr);

    // 2. 만약 rangeDelta 타입일 경우, 주입받은 allValues를 이용해 묶음 편차 연산 수행
    if (field.validation?.type === "rangeDelta" && allValues.length > 0) {
      const afterNums = allValues
        .map((v) => parseFloat(v?.after))
        .filter((n) => !isNaN(n));
      if (afterNums.length > 0) {
        const maxA = Math.max(...afterNums);
        const minA = Math.min(...afterNums);
        const diff = maxA - minA;

        if (diff > field.validation.allowedDelta) {
          return {
            isError: true,
            isMissing: false,
            message: `최대 편차 초과 (${diff.toFixed(2)})`,
          };
        }
      }
    }

    return {
      isError: singleResult.isError,
      isMissing: !afterStr || afterStr === "-" || afterStr.trim() === "", // 공백 문자열 방어 추가
      message: singleResult.message,
    };
  };

  /**
   * 5. useMemo 기반 종합 누락/에러 카운트 연산
   */
  const summary = useMemo(() => {
    let missingCount = 0;
    let totalErrorCount = 0;

    categories.forEach((cat) => {
      const pointsArray = cat.points || [];
      pointsArray.forEach((point) => {
        const savedPoint = getSavedPointData(cat, point);
        const fieldsArray = point.fields || point.fields_json || [];
        const allValues = savedPoint?.values || []; // 💡 [추가] 5개 필드 전체 값 확보

        fieldsArray.forEach((field, fIdx) => {
          const item = allValues[fIdx];
          const beforeStr =
            field.type === "select" ? "N/A" : parseValue(item, "before") || "-";
          const afterStr = parseValue(item, "after") || "-";

          // 💡 [수정] 4번째 인자로 allValues 배열을 전달하여 편차 에러까지 summary에 반영되게 만듭니다!
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
    getValidationGuide, // UI 헬퍼 연동 편의용
    missingCount: summary.missingCount,
    totalErrorCount: summary.totalErrorCount,
  };
};
