export const validateField = (field, afterStr) => {
  // 1. 공백 검증 가드 (비어있으면 누락 카운터에서 잡으므로 여기선 통과)
  if (!afterStr || afterStr.trim() === "")
    return { isError: false, message: "" };
  if (!field.validation) return { isError: false, message: "" };

  const { type, allowedDelta, minValue, minRange, maxRange, failValues } =
    field.validation;

  if (type === "none") {
    return { isError: false, message: "" };
  }
  // Case A: 문자열/선택박스 전용 검증
  if (type === "textCheck" && failValues) {
    if (failValues.includes(afterStr.trim())) {
      return { isError: true, message: "제한 문구 매칭", type };
    }
    return { isError: false, message: "" };
  }

  // 💡 [추가 가드] rangeDelta(묶음 편차) 스펙인 경우 개별 필드 루프에서는 판정을 패스합니다 (그룹 연산에서 처리)
  if (type === "rangeDelta" || type === "rangedelta") {
    return { isError: false, message: "" };
  }

  // 🚨 [동기화 핵심 가드레일] 숫자형 스펙인데 숫자가 아닌 문자가 들어오는 케이스 원천 제압
  const cNum = parseFloat(afterStr);
  if (isNaN(cNum)) {
    return {
      isError: true,
      message: "수치 입력란에 유효하지 않은 문자열(덤프)이 감지되었습니다.",
      type: "invalidNumber",
    };
  }

  // 숫자형이 아닌 필드가 아래 수치 연산으로 가는 것 최종 가드
  if (field.type !== "number") return { isError: false, message: "" };
  const pNum = parseFloat(field.prevValue);

  // Case B-1: 허용 오차 검증 (delta)
  if (type === "delta" && allowedDelta !== undefined && allowedDelta !== null) {
    if (isNaN(pNum)) return { isError: false, message: "" };
    if (cNum < pNum - allowedDelta || cNum > pNum + allowedDelta) {
      return {
        isError: true,
        message: `허용 오차(±${allowedDelta}) 초과`,
        type,
      };
    }
  }

  // Case B-2: 최소 기준 검증 (min)
  if (type === "min") {
    const realMin =
      minValue !== undefined && minValue !== null ? minValue : minRange;

    if (realMin !== undefined && realMin !== null) {
      if (cNum < realMin) {
        return { isError: true, message: `최소 기준(${realMin}) 미달`, type };
      }
    }
  }

  // Case B-3: 정상 범위 검증 (range)
  if (type === "range" && minRange !== undefined && maxRange !== undefined) {
    if (cNum < minRange || cNum > maxRange) {
      return {
        isError: true,
        message: `정상 범위(${minRange} ~ ${maxRange}) 이탈`,
        type,
      };
    }
  }

  return { isError: false, message: "" };
};

// 🛠️ 묶음 편차 검증 엔진 (전체 필드 간 편차 스크리닝 유지)
export const validateGroupDelta = (
  fieldsArray,
  valuesArray,
  targetType = "after",
) => {
  if (
    !fieldsArray ||
    !valuesArray ||
    !Array.isArray(fieldsArray) ||
    fieldsArray.length === 0
  ) {
    return { isError: false, message: "" };
  }

  const firstField = fieldsArray[0];
  if (!firstField || !firstField.validation)
    return { isError: false, message: "" };

  const validationSpec = firstField.validation;
  const type =
    validationSpec.type ??
    validationSpec.validation_type ??
    validationSpec.validationType;
  const allowedDelta =
    validationSpec.allowedDelta ?? validationSpec.allowed_delta;

  const normalizedType = String(type || "")
    .trim()
    .toLowerCase();

  if (normalizedType !== "rangedelta" && normalizedType !== "delta") {
    return { isError: false, message: "" };
  }

  if (allowedDelta === undefined || allowedDelta === null) {
    return { isError: false, message: "" };
  }

  const nums = valuesArray
    .map((v) => parseFloat(v?.[targetType]))
    .filter((num) => !isNaN(num));

  if (nums.length >= 2) {
    const maxVal = Math.max(...nums);
    const minVal = Math.min(...nums);
    const diff = maxVal - minVal;

    if (diff > parseFloat(allowedDelta)) {
      return {
        isError: true,
        message: `최대 편차 초과 (현재: ${diff.toFixed(2)} / 기준: ${allowedDelta})`,
      };
    }
  }

  return { isError: false, message: "" };
};

// 📊 전체 카테고리 순회 검증 엔진 (ReviewPage 최종 서브밋 전수 분석용)
export const validateFields = (categories, answers) => {
  let hasError = false;
  let errorCount = 0;
  const errorItems = [];

  categories.forEach((cat) => {
    const pointsArray = cat.points || [];
    pointsArray.forEach((point) => {
      const answerKey = `${cat.id}_${point.pointId}`;
      const savedPoint = answers[answerKey];
      const fieldsArray = point.fields || point.fields_json || [];
      const valuesArray = savedPoint?.values || [];

      const hasBeforeField = fieldsArray.some((f) => f.showBefore !== false);

      if (hasBeforeField) {
        const groupBeforeResult = validateGroupDelta(
          fieldsArray,
          valuesArray,
          "before",
        );
        if (groupBeforeResult.isError) {
          hasError = true;
          errorCount++;
          errorItems.push(
            `[${cat.category}] ${point.name} - [개선전 전체편차]: ${groupBeforeResult.message}`,
          );
        }
      }

      const groupAfterResult = validateGroupDelta(
        fieldsArray,
        valuesArray,
        "after",
      );
      if (groupAfterResult.isError) {
        hasError = true;
        errorCount++;
        errorItems.push(
          `[${cat.category}] ${point.name} - [개선후 전체편차]: ${groupAfterResult.message}`,
        );
      }

      fieldsArray.forEach((field, fIdx) => {
        const cellData = valuesArray[fIdx];

        // 💡 실시간 갱신된 단일 셀에 문자가 박혀있으면 여기서 에러 카운터 집계!
        const { isError: singleError, message } = validateField(
          field,
          cellData?.after,
        );

        if (singleError) {
          hasError = true;
          errorCount++;
          errorItems.push(
            `[${cat.category}] ${point.name} - ${field.col}: ${message}`,
          );
        }
      });
    });
  });

  return { hasError, errorCount, errorItems };
};

// 📝 항목 누락 전수 스크리닝 (자율입력 포함)
export const checkCategoryIncomplete = (cat, currentAnswers) => {
  let missingCount = 0;
  if (!cat || !cat.points) return { isIncomplete: false, missingCount };

  cat.points.forEach((point) => {
    const answerKey = `${cat.id}_${point.pointId}`;
    const savedPoint = currentAnswers[answerKey];
    const fieldsArray = point.fields || point.fields_json || [];

    fieldsArray.forEach((field, fIdx) => {
      const cellData = savedPoint?.values?.[fIdx];
      const afterVal = cellData?.after;
      const beforeVal = cellData?.before;

      const isAfterEmpty = !afterVal || afterVal.trim() === "";
      const showBefore = field.showBefore !== false;
      const isBeforeEmpty =
        showBefore && field.type !== "select"
          ? !beforeVal || beforeVal.trim() === ""
          : false;

      if (isAfterEmpty || isBeforeEmpty) {
        missingCount++;
      }
    });
  });

  return { isIncomplete: missingCount > 0, missingCount };
};

// 💡 스펙 가이드 구문 파서 명세 동기화
export const getValidationGuide = (validation) => {
  if (!validation) return "자율 입력";

  const type =
    validation.type ?? validation.validation_type ?? validation.validationType;
  const allowedDelta = validation.allowedDelta ?? validation.allowed_delta;

  const minValue = validation.minValue ?? validation.minRange;
  const minRange = validation.minRange ?? validation.min_range;
  const maxRange = validation.maxRange ?? validation.max_range;

  const normalizedType = String(type || "")
    .trim()
    .toLowerCase();

  if (normalizedType === "textcheck") return `주의 항목 제한 등록됨`;
  if (normalizedType === "delta") return `기준: 오차 ±${allowedDelta}`;
  if (normalizedType === "rangedelta")
    return `기준: 5개 필드 최대 편차 ${allowedDelta} 이내`;
  if (normalizedType === "min") return `기준: 최소 ${minValue} 이상`;
  if (normalizedType === "range") return `기준: ${minRange} ~ ${maxRange}`;

  return "";
};
