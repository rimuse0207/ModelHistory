import { useState, useEffect, useMemo } from "react";
import { Request_Get_Axios } from "../API";

export const useChecklistHistory = () => {
  const [models, setModels] = useState([
    { model_no: "DGP8761", label: "DGP8761" },
  ]);
  const [lines, setLines] = useState([
    { line_no: "Line 01", line_name: "Line 01" },
  ]);
  const [records, setRecords] = useState([]);

  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedLine, setSelectedLine] = useState(null);

  // 💡 모델 검색용 상태 추가
  const [modelSearchTerm, setModelSearchTerm] = useState("");

  // 1. 초기 마운트 시 완료 데이터가 있는 모델 로드
  useEffect(() => {
    getModelList();
  }, []);
  const getModelList = async () => {
    const result = await Request_Get_Axios(`/selectlist/history/models`);
    console.log(result);
    if (result.status) {
      setModels(result.data || [{ model_no: "DGP8761", label: "DGP8761" }]);
    }
  };

  // 2. 모델 선택 변경 시 라인 목록 로드
  useEffect(() => {
    if (!selectedModel) return;
    setLines([{ line_no: "Line 01", line_name: "Line 01" }]);
    setRecords([]);
    setSelectedLine(null);
    getSerialNumberList();
  }, [selectedModel]);

  const getSerialNumberList = async () => {
    const result = await Request_Get_Axios(
      `/selectlist/history/lines/${selectedModel}`,
    );
    console.log(result);
    if (result.status) {
      setLines(result.data || [{ line_no: "Line 01", line_name: "Line 01" }]);
    }
  };

  // 3. 라인 선택 변경 시 최종 등록 내역 로드
  useEffect(() => {
    if (!selectedModel || !selectedLine) return;
    setRecords([]);
    getResultList();
  }, [selectedModel, selectedLine]);

  const getResultList = async () => {
    const result = await Request_Get_Axios(
      `/selectlist/history/records/${selectedModel}/${selectedLine}`,
    );
    if (result.status) {
      setRecords(result.data || []);
    }
  };

  // 🔍 모델 검색 필터링 로직 (대소문자 구분 없음)
  const filteredModels = useMemo(() => {
    return models.filter((m) =>
      m.model_no.toLowerCase().includes(modelSearchTerm.toLowerCase()),
    );
  }, [models, modelSearchTerm]);

  return {
    models: filteredModels,
    lines,
    records,
    selectedModel,
    setSelectedModel,
    selectedLine,
    setSelectedLine,
    modelSearchTerm,
    setModelSearchTerm,
  };
};
