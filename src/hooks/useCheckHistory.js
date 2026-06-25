import { useState, useEffect, useMemo } from "react";
import { Request_Get_Axios } from "../API";

export const useChecklistHistory = () => {
  const [basicOptionsList, setBasicOptionsList] = useState({
    customers: [],
    regions: [],
    models: [],
    serials: [],
  });

  const [companies, setCompanies] = useState([]);
  const [regions, setRegions] = useState([]);
  const [models, setModels] = useState([]);
  const [lines, setLines] = useState([]);
  const [records, setRecords] = useState([]);

  // 활성화된 선택 포인터 추적 상태 가젯
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedSerial, setSelectedSerial] = useState(null);

  // 검색 필터 상태 변수셋
  const [modelSearchTerm, setModelSearchTerm] = useState("");
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");

  useEffect(() => {
    getHistoryBasicData();
  }, []);

  const getHistoryBasicData = async () => {
    const request = await Request_Get_Axios("/selectlist/basicData");
    if (request.status) {
      setBasicOptionsList({
        customers: request.data.customers || [],
        regions: request.data.regions || [],
        models: request.data.models || [],
        serials: request.data.serials || [],
      });
      // 1단계 업체 리스트 채우기
      setCompanies(request.data.customers || []);
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

    // 하위 서브트리 완전 클린업 청소
    setSelectedRegion("");
    setModels([]);
    setSelectedModel(null);
    setLines([]);
    setSelectedSerial(null);
    setRecords([]);
  }, [selectedCustomer, basicOptionsList.regions]);

  useEffect(() => {
    if (!selectedRegion) {
      setModels([]);
      setSelectedModel(null);
      return;
    }
    const filtered = basicOptionsList.models.filter(
      (item) => item.regions_code === selectedRegion,
    );
    setModels(filtered);

    // 하위 서브트리 초기화
    setSelectedModel(null);
    setLines([]);
    setSelectedSerial(null);
    setRecords([]);
  }, [selectedRegion, basicOptionsList.models]);

  useEffect(() => {
    if (!selectedModel) {
      setLines([]);
      setSelectedSerial(null);
      return;
    }
    const filtered = basicOptionsList.serials.filter(
      (item) => item.model_no === selectedModel,
    );
    setLines(filtered);

    setSelectedSerial(null);
    setRecords([]);
  }, [selectedModel, basicOptionsList.serials]);

  useEffect(() => {
    if (globalSearchTerm.trim().length > 0) return;
    if (!selectedModel || !selectedSerial) return;

    setRecords([]);
    getResultList();
  }, [selectedModel, selectedSerial, globalSearchTerm]);

  const getResultList = async () => {
    const result = await Request_Get_Axios(
      `/selectlist/history/records/${selectedModel}/${selectedSerial}`,
    );
    if (result.status) {
      setRecords(result.data || []);
    }
  };

  useEffect(() => {
    const term = globalSearchTerm.trim();
    if (!term) {
      if (selectedModel && selectedSerial) getResultList();
      else setRecords([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      getGlobalSearchResultList(term);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [globalSearchTerm]);

  const getGlobalSearchResultList = async (keyword) => {
    try {
      const result = await Request_Get_Axios(
        `/selectlist/history/search-all?keyword=${encodeURIComponent(keyword)}`,
      );

      if (result && result.data) {
        setRecords(result.data.data || result.data || []);
      }
    } catch (e) {
      console.error("통합 검색 쿼리 연동 실패:", e);
    }
  };

  const filteredModels = useMemo(() => {
    return models.filter((m) => {
      const targetName = m.model_name || m.name || m.id || "";
      return targetName.toLowerCase().includes(modelSearchTerm.toLowerCase());
    });
  }, [models, modelSearchTerm]);

  return {
    companies,
    regions,
    models: filteredModels,
    lines,
    records,
    basicOptionsList,

    selectedCustomer,
    setSelectedCustomer,
    selectedRegion,
    setSelectedRegion,

    selectedModel,
    setSelectedModel,
    selectedLine: selectedSerial,
    setSelectedLine: setSelectedSerial,

    modelSearchTerm,
    setModelSearchTerm,
    globalSearchTerm,
    setGlobalSearchTerm,
  };
};
