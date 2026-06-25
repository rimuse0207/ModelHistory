import { useState, useEffect } from "react";
import { Request_Get_Axios, Request_Post_Axios } from "../API";
import { toast } from "../utils/ToastMessage/ToastManager";

export function useBuilderContext() {
  const [basicOptionsList, setBasicOptionsList] = useState({
    customers: [],
    regions: [],
    models: [],
    serials: [],
  });
  const [customers, setCustomers] = useState([]);
  const [regions, setRegions] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  const [models, setModels] = useState([]);
  const [serials, setSerials] = useState([]);

  const [selectedModel, setSelectedModel] = useState("");
  const [selectedSerial, setSelectedSerial] = useState("");
  const [lineLabelInput, setLineLabelInput] = useState("");

  const [categories, setCategories] = useState([]);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [copyTargetModel, setCopyTargetModel] = useState("");
  const [copyTargetSerial, setCopyTargetSerial] = useState("");
  const [copyTargetSerials, setCopyTargetSerials] = useState([]);

  useEffect(() => {
    getBasicData();
  }, []);

  const getBasicData = async () => {
    const request = await Request_Get_Axios("/selectlist/basicData");
    if (request.status) {
      setBasicOptionsList({
        customers: request.data.customers || [],
        regions: request.data.regions || [],
        models: request.data.models || [],
        serials: request.data.serials || [],
      });
      setCustomers(request.data.customers || []);
    }
  };

  useEffect(() => {
    if (!selectedCustomer) {
      setRegions([]);
      setSelectedRegion("");
      return;
    }
    setRegions(
      basicOptionsList.regions.filter(
        (item) => item.customer_code === selectedCustomer,
      ),
    );

    setSelectedRegion("");
    setModels([]);
    setSelectedModel("");
  }, [selectedCustomer]);

  useEffect(() => {
    if (!selectedRegion) {
      setModels([]);
      setSelectedModel("");
      return;
    }

    setModels(
      basicOptionsList.models.filter(
        (item) => item.regions_code === selectedRegion,
      ),
    );
    setSelectedModel("");
  }, [selectedRegion]);

  useEffect(() => {
    if (!selectedModel) {
      setSerials([]);
      setCategories([]);
      return;
    }

    setSerials(
      basicOptionsList.serials.filter(
        (item) => item.model_no === selectedModel,
      ),
    );

    setSelectedSerial("");
    setCategories([]);
  }, [selectedModel]);

  useEffect(() => {
    if (!selectedModel || !selectedSerial) {
      setCategories([]);
      return;
    }
    async function loadExistMaster() {
      try {
        const res = await Request_Get_Axios(
          `/checklist/master/${selectedModel}/${selectedSerial}`,
        );

        if (res.status && res.data?.data.length > 0) {
          setCategories(res.data.data);
          const currentLine = serials.find(
            (s) => s.serial_no === selectedSerial,
          );
          setLineLabelInput(currentLine ? currentLine.line_label : "");
        } else {
          setCategories([
            {
              id: "temp_1",
              category: "새 카테고리 제목을 작성해 주세요.",
              points: [],
            },
          ]);
        }
      } catch (e) {
        setCategories([
          {
            id: "temp_1",
            category: "새 카테고리 제목을 작성해 주세요.",
            points: [],
          },
        ]);
      }
    }
    loadExistMaster();
  }, [selectedSerial]);

  const onAddCompany = async (name) => {
    const request = await Request_Post_Axios(
      "/checklist/addCustomer/customers/customer_code",
      { name: name },
    );
    if (request.status) {
      const newComp = { id: `${request.data}`, customer_name: name };
      setCustomers([...customers, newComp]);
      setSelectedCustomer(newComp.id);
    }
  };

  const onAddRegion = async (parentId, name) => {
    const request = await Request_Post_Axios(
      "/checklist/addResions/regions/regions_code",
      { name: name, parentId },
    );
    if (request.status) {
      const newReg = { id: `${request.data}`, regions_name: name };
      setRegions([...regions, newReg]);
      setSelectedRegion(newReg.id);
    }
  };

  const onAddModel = async (selectRegion, parentId, name) => {
    const request = await Request_Post_Axios(
      "/checklist/addModels/models/model_no",
      { name: name, parentId, selectRegion },
    );

    if (request.status) {
      const newMod = { model_no: `${request.data}`, model_name: name };
      setModels([...models, newMod]);
      setSelectedModel(request.data);
      toast.show({
        title: `장비 모델을 추가하였습니다.`,
        successCheck: true,
        duration: 3000,
      });
    } else {
      toast.show({
        title: `장비 모델을 추가에 실패하였습니다.`,
        successCheck: false,
        duration: 3000,
      });
    }
  };

  const onAddSerial = async (
    selectCustomer,
    selectRegion,
    parentId,
    name,
    subLabel,
  ) => {
    const newSer = {
      serial_no: name.trim(),
      line_name: subLabel || "신규 공정라인",
    };

    const request = await Request_Post_Axios("/checklist/addSerials", {
      selectCustomer,
      selectRegion,
      parentId,
      newSer,
      subLabel,
    });
    if (request.status) {
      if (request.data.dupleChecking) {
        return toast.show({
          title: `시리얼 번호가 중복됩니다.`,
          successCheck: false,
          duration: 3000,
        });
      } else {
        setSerials([...serials, newSer]);
        setSelectedSerial(name.trim());
      }
    }
  };

  // 캔버스 내 조작 함수셋 보존 및 밸리데이션 대기 상태 매핑 유지
  const addCategory = () => {
    setCategories([
      ...categories,
      {
        id: `new_cat_${Date.now()}`,
        category: "새 카테고리 제목을 작성해 주세요.",
        points: [],
      },
    ]);
  };

  const removeCategory = (cIdx) => {
    const next = [...categories];
    next.splice(cIdx, 1);
    setCategories(next);
  };

  const moveCategory = (index, direction) => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === categories.length - 1) return;
    const next = [...categories];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    setCategories(next);
  };

  const updateCategoryName = (cIdx, name) => {
    const next = [...categories];
    next[cIdx].category = name;
    setCategories(next);
  };

  const addPoint = (cIdx) => {
    const next = [...categories];
    next[cIdx].points.push({
      pointId: `new_pt_${Date.now()}`,
      name: "새 점검 포인트 제목을 작성해주세요.",
      fields: [],
    });
    setCategories(next);
  };

  const removePoint = (cIdx, pIdx) => {
    const next = [...categories];
    next[cIdx].points.splice(pIdx, 1);
    setCategories(next);
  };

  const movePoint = (cIdx, pIdx, direction) => {
    const next = [...categories];
    const pointsArray = next[cIdx].points || [];
    if (direction === "up" && pIdx === 0) return;
    if (direction === "down" && pIdx === pointsArray.length - 1) return;
    const targetIndex = direction === "up" ? pIdx - 1 : pIdx + 1;
    const temp = pointsArray[pIdx];
    pointsArray[pIdx] = pointsArray[targetIndex];
    pointsArray[targetIndex] = temp;
    setCategories(next);
  };

  const updatePointName = (cIdx, pIdx, name) => {
    const next = [...categories];
    next[cIdx].points[pIdx].name = name;
    setCategories(next);
  };

  const addField = (cIdx, pIdx) => {
    const next = [...categories];
    next[cIdx].points[pIdx].fields.push({
      fieldId: `new_fld_${Date.now()}`,
      col: `value${next[cIdx].points[pIdx].fields.length + 1}`,
      type: "number",
      select_options: "",
      prev_value: "Y",
      showBefore: true,
      validation: {
        type: "range",
        allowedDelta: "",
        minValue: "",
        minRange: "",
        maxRange: "",
        failValues: [],
      },
    });
    setCategories(next);
  };

  const removeField = (cIdx, pIdx, fIdx) => {
    const next = [...categories];
    next[cIdx].points[pIdx].fields.splice(fIdx, 1);
    setCategories(next);
  };

  const updateFieldMeta = (cIdx, pIdx, fIdx, key, value) => {
    const next = [...categories];
    const targetField = next[cIdx].points[pIdx].fields[fIdx];

    if (key === "type") {
      targetField.type = value;
      if (value === "number") {
        targetField.validation = {
          type: "range",
          allowedDelta: "",
          minValue: "",
          minRange: "",
          maxRange: "",
          failValues: [],
        };
      } else if (value === "text" || value === "select") {
        targetField.validation = {
          type: "textCheck",
          failValues: value === "select" ? ["이상"] : [],
        };
        if (value === "select") {
          targetField.select_options = "정상,이상";
        } else {
          targetField.select_options = null;
        }
      }
    } else if (key === "select_options") {
      targetField.select_options = value;
      const validOptions = value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      if (targetField.validation && targetField.validation.failValues) {
        targetField.validation.failValues =
          targetField.validation.failValues.filter((val) =>
            validOptions.includes(val),
          );
      }
    } else if (key === "col" || key === "prev_value") {
      targetField[key] = value;
      if (key === "prev_value") {
        targetField.showBefore = value !== "N";
      }
    } else if (key === "validation_type") {
      targetField.validation.type = value;
      if (value === "rangeDelta") targetField.validation.allowedDelta = "";
      if (value === "min") targetField.validation.minValue = "";
      if (value === "range") {
        targetField.validation.minRange = "";
        targetField.validation.maxRange = "";
      }
      if (value === "textCheck") targetField.validation.failValues = [];
    } else if (key === "toggle_fail_value") {
      const currentFails = targetField.validation.failValues || [];
      if (currentFails.includes(value)) {
        targetField.validation.failValues = currentFails.filter(
          (v) => v !== value,
        );
      } else {
        targetField.validation.failValues = [...currentFails, value];
      }
    } else {
      targetField.validation[key] = value;
    }
    setCategories(next);
  };

  const handleLoadTargetTemplate = async () => {
    if (!copyTargetModel || !copyTargetSerial)
      return toast.show({
        title: `복사를 장비를 선택 해 주세요..`,
        successCheck: false,
        duration: 3000,
      });
    if (
      copyTargetModel === selectedModel &&
      copyTargetSerial === selectedSerial
    ) {
      return toast.show({
        title: `동일한 장비의 점검 항목은 복사해 올 수 없습니다.`,
        successCheck: false,
        duration: 3000,
      });
    }
    if (
      !window.confirm(
        `⚠️ [확인]\n\n${copyTargetModel} (${copyTargetSerial})의 점검항목을 가져옵니다.\n작성 중이던 현재 점검 항목은 모두 덮어써집니다. 진행할까요?`,
      )
    )
      return;

    const res = await Request_Get_Axios(
      `checklist/master/${copyTargetModel}/${copyTargetSerial}`,
    );

    if (res.status && res.data.length > 0) {
      setCategories(res.data);
      setIsCopyModalOpen(false);
      toast.show({
        title: `점검 항목을 복사했습니다! 상단 [최종 저장] 버튼을 누르면 현재 장비에 영구 적용됩니다.`,
        successCheck: true,
        duration: 3000,
      });
    } else {
      toast.show({
        title: `선택한 장비에 저장된 점검 항목이 존재하지 않습니다.`,
        successCheck: false,
        duration: 3000,
      });
    }
  };

  const handleSaveMasterTemplate = async () => {
    if (!selectedModel || !selectedSerial)
      return toast.show({
        title: `모델과 시리얼 넘버가 선택 되지 않았습니다.`,
        successCheck: false,
        duration: 3000,
      });

    const currentLine = serials.find((s) => s.serial_no === selectedSerial);
    const sanitizedCategories = JSON.parse(JSON.stringify(categories));

    sanitizedCategories.forEach((cat) => {
      cat.points?.forEach((pt) => {
        pt.fields?.forEach((fld) => {
          if (fld.type === "number" && fld.validation) {
            const v = fld.validation;
            if (v.allowedDelta !== undefined)
              v.allowedDelta =
                v.allowedDelta === "" || v.allowedDelta === "-"
                  ? 0
                  : Number(v.allowedDelta);
            if (v.minValue !== undefined)
              v.minValue =
                v.minValue === "" || v.minValue === "-"
                  ? 0
                  : Number(v.minValue);
            if (v.minRange !== undefined)
              v.minRange =
                v.minRange === "" || v.minRange === "-"
                  ? 0
                  : Number(v.minRange);
            if (v.maxRange !== undefined)
              v.maxRange =
                v.maxRange === "" || v.maxRange === "-"
                  ? 0
                  : Number(v.maxRange);
          }
        });
      });
    });

    const response = await Request_Post_Axios(
      `/checklist/master/save-template`,
      {
        modelNo: selectedModel,
        serialNo: selectedSerial,
        lineLabel: currentLine ? currentLine.line_label : lineLabelInput,
        templateTree: sanitizedCategories,
      },
    );
    if (response.status) {
      toast.show({
        title: `기록 점검항목이 저장 되었습니다.`,
        successCheck: true,
        duration: 3000,
      });
    }
  };

  const onExecuteTemplateCopy = async (targetModel, targetSerial) => {
    const res = await Request_Get_Axios(
      `checklist/master/${targetModel}/${targetSerial}`,
    );

    if (res.status && res.data.data.length > 0) {
      setCategories(res.data.data);

      toast.show({
        title: `타 공정 장비의 점검 항목이 복사되었습니다! 최종 반영을 위해 우측 상단 [점검 항목 최종 저장] 버튼을 반드시 눌러주세요.`,
        successCheck: true,
        duration: 3000,
      });
    } else {
      toast.show({
        title: `선택한 장비에 점검 항목 정보가 존재하지 않습니다.`,
        successCheck: false,
        duration: 3000,
      });
    }
  };

  return {
    customers,
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
    lineLabelInput,
    setLineLabelInput,
    categories,
    setCategories,
    isCopyModalOpen,
    setIsCopyModalOpen,
    copyTargetModel,
    setCopyTargetModel,
    copyTargetSerial,
    setCopyTargetSerial,
    copyTargetSerials,
    basicOptionsList,

    // CRUD 핸들러 이식
    onAddCompany,
    onAddRegion,
    onAddModel,
    onAddSerial,

    onExecuteTemplateCopy,
    addCategory,
    removeCategory,
    moveCategory,
    updateCategoryName,
    addPoint,
    removePoint,
    movePoint,
    updatePointName,
    addField,
    removeField,
    updateFieldMeta,
    handleLoadTargetTemplate,
    handleSaveMasterTemplate,
  };
}
