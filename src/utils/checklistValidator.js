export const validateField = (field, afterStr) => {
  if (!afterStr || afterStr.trim() === "")
    return { isError: false, message: "" };
  if (!field.validation) return { isError: false, message: "" };

  const { type, allowedDelta, minValue, minRange, maxRange, failValues } =
    field.validation;

  // Case A: 문자열 검증
  if (type === "textCheck" && failValues) {
    if (failValues.includes(afterStr.trim())) {
      return { isError: true, message: "제한 문구 매칭", type };
    }
    return { isError: false, message: "" };
  }

  // 숫자형이 아닌데 아래 숫자 검증으로 넘어가는 것 방지
  if (field.type !== "number") return { isError: false, message: "" };

  const cNum = parseFloat(afterStr);
  const pNum = parseFloat(field.prevValue);
  if (isNaN(cNum))
    return {
      isError: true,
      message: "올바른 숫자가 아닙니다.",
      type: "invalidNumber",
    };

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
  if (type === "min" && minRange !== undefined && minRange !== null) {
    if (cNum < minRange) {
      return { isError: true, message: `최소 기준(${minRange}) 미달`, type };
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

// 🛠️ 묶음 편차 검증 엔진 정상화 및 방어 코드 고도화 완료
export const validateGroupDelta = (
  fieldsArray,
  valuesArray,
  targetType = "after",
) => {
  // 배열 검증 방어선 강화
  if (
    !fieldsArray ||
    !valuesArray ||
    !Array.isArray(fieldsArray) ||
    fieldsArray.length === 0
  ) {
    return { isError: false, message: "" };
  }

  // 💡 [수정] 배열의 '첫 번째 요소'를 정확히 끄집어냅니다.
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

  // 💡 [수정] 대소문자 공백 완전 차단 무력화 연산
  const normalizedType = String(type || "")
    .trim()
    .toLowerCase();

  // rangeDelta와 delta 모두 유연하게 판정 스코프에 포함
  if (normalizedType !== "rangedelta" && normalizedType !== "delta") {
    return { isError: false, message: "" };
  }

  if (allowedDelta === undefined || allowedDelta === null) {
    return { isError: false, message: "" };
  }

  // 5개 필드의 실제 입력값 수집 및 정제
  const nums = valuesArray
    .map((v) => parseFloat(v?.[targetType]))
    .filter((num) => !isNaN(num));

  // 💡 최소 2개 이상의 값이 들어왔을 때부터 편차 검증을 시작하도록 신뢰성 확보
  if (nums.length >= 2) {
    const maxVal = Math.max(...nums);
    const minVal = Math.min(...nums);
    const diff = maxVal - minVal;

    if (diff > parseFloat(allowedDelta)) {
      return {
        isError: true,
        message: `전체 필드 간 최대 편차 초과 (현재 편차: ${diff.toFixed(2)} / 기준 제한: ${allowedDelta})`,
      };
    }
  }

  return { isError: false, message: "" };
};

export const validateFields = (categories, answers) => {
  let hasError = false;
  let errorCount = 0;
  const errorItems = [];

  categories.forEach((cat) => {
    const pointsArray = cat.points || [];
    pointsArray.forEach((point) => {
      const answerKey = `${cat.id}_${point.pointId}`;
      const savedPoint = answers[answerKey];
      const fieldsArray = point.fields || point.fields_json || []; // fields_json 예외 대응 추가
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

export const checkCategoryIncomplete = (cat, currentAnswers) => {
  let missingCount = 0;
  if (!cat || !cat.points) return { isIncomplete: false, missingCount };

  cat.points.forEach((point) => {
    const answerKey = `${cat.id}_${point.pointId}`;
    const savedPoint = currentAnswers[answerKey];
    const fieldsArray = point.fields || point.fields_json || []; // fields_json 대응 추가

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

export const getValidationGuide = (validation) => {
  if (!validation) return "자율 입력";

  const type =
    validation.type ?? validation.validation_type ?? validation.validationType;
  const allowedDelta = validation.allowedDelta ?? validation.allowed_delta;
  const minValue = validation.minRange ?? validation.minRange;
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
