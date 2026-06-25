import { useState, useEffect } from "react";
import { Request_Get_Axios, Request_Post_Axios } from "../API";
import { toast } from "../utils/ToastMessage/ToastManager";

export function useChecklist() {
  const [basicOptionsList, setBasicOptionsList] = useState({
    customers: [],
    regions: [],
    models: [],
    serials: [],
  });

  const [companies, setCompanies] = useState([]);
  const [regions, setRegions] = useState([]);
  const [models, setModels] = useState([]);
  const [serials, setSerials] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedSerial, setSelectedSerial] = useState("");

  const [categories, setCategories] = useState([]);
  const [currentCatIndex, setCurrentCatIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submissionId, setSubmissionId] = useState(null);
  const [viewMode, setViewMode] = useState("CHECK");
  const [loading, setLoading] = useState(false);
  const [lastSavedAnswersStr, setLastSavedAnswersStr] = useState("");
  const [tempSubmissions, setTempSubmissions] = useState([]);

  useEffect(() => {
    getChecklistBasicData();
  }, []);

  const getChecklistBasicData = async () => {
    setLoading(true);
    try {
      const request = await Request_Get_Axios("/selectlist/basicData");
      if (request.status) {
        setBasicOptionsList({
          customers: request.data.customers || [],
          regions: request.data.regions || [],
          models: request.data.models || [],
          serials: request.data.serials || [],
        });
        setCompanies(request.data.customers || []);
      }
    } catch (e) {
      console.error("체크리스트 베이직 인프라 수혈 실패:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedCustomer) {
      setRegions([]);
      setSelectedRegion("");
      return;
    }
    const filtered = basicOptionsList.regions.filter(
      (item) => item.customer_code === selectedCustomer,
    );
    setRegions(filtered);
    setSelectedRegion("");
    setModels([]);
    setSelectedModel("");
    setSerials([]);
    setSelectedSerial("");
    setCategories([]);
  }, [selectedCustomer, basicOptionsList.regions]);

  useEffect(() => {
    if (!selectedRegion) {
      setModels([]);
      setSelectedModel("");
      return;
    }
    const filtered = basicOptionsList.models.filter(
      (item) => item.regions_code === selectedRegion,
    );
    setModels(filtered);
    setSelectedModel("");
    setSerials([]);
    setSelectedSerial("");
    setCategories([]);
  }, [selectedRegion, basicOptionsList.models]);

  useEffect(() => {
    if (!selectedModel) {
      setSerials([]);
      setSelectedSerial("");
      return;
    }
    const filtered = basicOptionsList.serials.filter(
      (item) => item.model_no === selectedModel,
    );
    setSerials(filtered);
    setSelectedSerial("");
    setCategories([]);
  }, [selectedModel, basicOptionsList.serials]);

  useEffect(() => {
    if (!selectedModel || !selectedSerial) {
      setCategories([]);
      return;
    }

    async function loadTemplateStructure() {
      setLoading(true);
      try {
        const res = await Request_Get_Axios(
          `/checklist/master/${selectedModel}/${selectedSerial}`,
        );

        if (res.status && res.data?.data) {
          setCategories(res.data.data);
          setSubmissionId(null);
          setAnswers({});
          setCurrentCatIndex(0);
          setViewMode("CHECK");
        } else {
          setCategories([]);
        }

        loadTempDraftLists();
      } catch (e) {
        console.error("점검 마스터 템플릿 로드 실패:", e);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }
    loadTemplateStructure();
  }, [selectedModel, selectedSerial]);

  const loadTempDraftLists = async () => {
    if (!selectedModel || !selectedSerial) return;
    try {
      const draftRes = await Request_Get_Axios(
        `/checklist/temp-list/${selectedModel}/${selectedSerial}`,
      );

      if (draftRes.success || draftRes.status) {
        setTempSubmissions(draftRes.data || []);
      }
    } catch (err) {
      console.error("임시저장 드래프트 내역 긁어오기 장애 발생:", err);
    }
  };

  const handleAnswerChange = (answerKey, nextValues) => {
    const currentCategory = categories[currentCatIndex];
    let sanitizedValues = [...nextValues];

    if (currentCategory) {
      const matchedPoint = currentCategory.points?.find(
        (p) => `${currentCategory.id}_${p.pointId}` === answerKey,
      );
      const matchedFieldMeta = matchedPoint?.fields || [];

      sanitizedValues = sanitizedValues.map((cell, fIdx) => {
        if (!cell) return cell;
        const field = matchedFieldMeta[fIdx];
        let isAfterFail = "N";

        if (field && field.validation && field.validation.type !== "none") {
          const val = cell.after;
          const v = field.validation;

          if (val !== "" && val !== "-" && val !== undefined && val !== null) {
            if (v.type === "textCheck" && field.type === "select") {
              let rawFails = v.failValues || [];
              if (typeof rawFails === "string") rawFails = rawFails.split(",");
              const cleanSelected = String(val).trim();
              const cleanFails = Array.isArray(rawFails)
                ? rawFails.map((w) => String(w).trim())
                : [];
              if (cleanFails.includes(cleanSelected)) isAfterFail = "Y";
            }

            if (
              v.type === "range" ||
              v.type === "min" ||
              v.type === "rangeDelta"
            ) {
              const numVal = Number(val);

              if (isNaN(numVal)) {
                isAfterFail = "Y";
              } else {
                if (
                  v.type === "range" &&
                  (numVal < (v.minRange ?? 0) || numVal > (v.maxRange ?? 0))
                ) {
                  isAfterFail = "Y";
                }
                if (v.type === "min" && numVal < (v.minValue ?? 0)) {
                  isAfterFail = "Y";
                }
                if (v.type === "rangeDelta") {
                  const limitDelta = Number(v.allowedDelta || 0);
                  if (limitDelta > 0) {
                    const validNumbers = nextValues
                      .map((c) => c?.after)
                      .filter(
                        (v) =>
                          v !== "" &&
                          v !== "-" &&
                          v !== undefined &&
                          v !== null &&
                          !isNaN(Number(v)),
                      )
                      .map((v) => Number(v));

                    if (validNumbers.length > 1) {
                      const maxVal = Math.max(...validNumbers);
                      const minVal = Math.min(...validNumbers);
                      if (maxVal - minVal > limitDelta) isAfterFail = "Y";
                    }
                  }
                }
              }
            }
          }
        }

        return {
          ...cell,
          after_fail: isAfterFail,
        };
      });
    }

    setAnswers((prev) => ({
      ...prev,
      [answerKey]: {
        ...prev[answerKey],
        values: sanitizedValues,
      },
    }));
  };

  const handleTempSave = async () => {
    try {
      const response = await Request_Post_Axios(`/checklist/save/draft`, {
        submissionId,
        userId: "system_admin",
        modelNo: selectedModel,
        serialNo: selectedSerial,
        status: "TEMP",
        answers: answers,
      });

      if (response.status) {
        setSubmissionId(response.data.submissionId);
        loadTempDraftLists();
        setLastSavedAnswersStr(JSON.stringify(answers));

        toast.show({
          title: `현재 장비의 점검 항목 데이터를 임시 저장하였습니다.`,
          successCheck: true,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("임시저장 전송 실패:", error);
      alert("임시 저장 중 전송 오류가 발생했습니다.");
    }
  };

  const handleFinalSave = async (subData) => {
    if (
      !window.confirm(
        "점검표 작성을 완료하고 최종 제출하시겠습니까?\n제출 후에는 수정이 불가능합니다.",
      )
    )
      return;

    try {
      const res = await Request_Post_Axios(`/checklist/master/submit`, {
        submissionId,
        userId: "system_admin",
        modelNo: selectedModel,
        serialNo: selectedSerial,
        status: "COMPLETED",
        answers: answers,
        subData,
      });

      if (res.status) {
        setSelectedSerial("");
        setAnswers({});
        setSubmissionId(null);
        setViewMode("CHECK");
        toast.show({
          title: `이력을 등록하였습니다.`,
          successCheck: true,
          duration: 3000,
        });
      } else {
        alert("저장중 에러가 발생되었습니다.");
      }
    } catch (e) {
      console.error("🚨 최종 제출 처리 중 크래시 에러 발생:", e);
      alert("최종 완료 처리 중 서버 응답 오류가 발생했습니다.");
    }
  };

  const handleRestoreTemp = async (targetSubmission) => {
    if (!targetSubmission) return;

    const targetCheckId = targetSubmission.submissionId;
    if (!targetCheckId)
      return toast.show({
        title: `선택한 세션의 고유 식별코드가 올바르지 않습니다.`,
        successCheck: false,
        duration: 3000,
      });

    setLoading(true);
    try {
      const res = await Request_Get_Axios(
        `/checklist/temp-detail/${targetCheckId}`,
      );

      if (res.status && res.data && res.data.answers) {
        setSubmissionId(targetCheckId);

        setAnswers(res.data.answers);

        setLastSavedAnswersStr(JSON.stringify(res.data.answers));

        setCurrentCatIndex(0);
        setViewMode("CHECK");

        toast.show({
          title: `이전에 작성 중이던 점검 내역이 복원되었습니다!`,
          successCheck: true,
          duration: 3000,
        });
      } else {
        toast.show({
          title: `임시저장된 점검 정보를 찾을 수 없습니다.`,
          successCheck: false,
          duration: 3000,
        });
      }
    } catch (err) {
      console.error("임시 데이터 복원 실패:", err);
      alert("임시 데이터를 읽어오는 중 통신 장애가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return {
    companies,
    regions,
    models,
    serials,
    selectedCustomer,
    setSelectedCustomer,
    selectedRegion,
    setSelectedRegion,
    selectedModel,
    setSelectedModel,
    selectedSerial,
    setSelectedSerial,
    categories,
    currentCatIndex,
    setCurrentCatIndex,
    answers,
    submissionId,
    viewMode,
    setViewMode,
    loading,
    lastSavedAnswersStr,
    handleAnswerChange,
    handleTempSave,
    handleFinalSave,
    tempSubmissions,
    handleRestoreTemp,
  };
}
