import React from "react";
import styled from "styled-components";
import {
  FiBriefcase,
  FiMapPin,
  FiCpu,
  FiServer,
  FiDatabase,
  FiSave,
} from "react-icons/fi";

function ChecklistHeader({
  companies = [],
  regions = [],
  models = [],
  serials = [],
  selectedCustomer,
  setSelectedCustomer,
  selectedRegion,
  setSelectedRegion,
  selectedModel,
  setSelectedModel,
  selectedSerial,
  setSelectedSerial,
  handleTempSave,
  tempCount = 0,
  onOpenTempModal,
}) {
  return (
    <HeaderControlPanel>
      <FilterGroupWrapper>
        {/* 1단계: 고객사 */}
        <FilterBox>
          <FilterLabel>
            <FiBriefcase /> 1단계: 고객사
          </FilterLabel>
          <HeaderSelect
            value={selectedCustomer || ""}
            onChange={(e) => setSelectedCustomer(e.target.value)}
          >
            <option value="">-- 고객사 선택 --</option>
            {companies?.map((c, idx) => (
              <option
                key={(c.id || c.customer_code) + "_" + idx}
                value={c.id || c.customer_code}
              >
                {c.company_name || c.customer_name}
              </option>
            ))}
          </HeaderSelect>
        </FilterBox>

        {/* 2단계: 지역 */}
        <FilterBox>
          <FilterLabel>
            <FiMapPin /> 2단계: 고객사 지역
          </FilterLabel>
          <HeaderSelect
            value={selectedRegion || ""}
            onChange={(e) => setSelectedRegion(e.target.value)}
            disabled={!selectedCustomer}
          >
            <option value="">-- 지역 선택 --</option>
            {regions?.map((r, idx) => (
              <option
                key={(r.id || r.regions_code) + "_" + idx}
                value={r.id || r.regions_code}
              >
                {r.region_name || r.regions_name}
              </option>
            ))}
          </HeaderSelect>
        </FilterBox>

        {/* 3단계: 장비 모델 */}
        <FilterBox>
          <FilterLabel>
            <FiCpu /> 3단계: 장비 모델
          </FilterLabel>
          <HeaderSelect
            value={selectedModel || ""}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!selectedRegion}
          >
            <option value="">-- 모델 번호 선택 --</option>
            {models?.map((m, idx) => {
              const modelValue =
                m.id ||
                m.model_no ||
                m.modelNo ||
                (typeof m === "string" ? m : "");
              const modelLabel =
                m.name || m.model_name || m.label || modelValue;
              if (!modelValue) return null;
              return (
                <option key={modelValue + "_" + idx} value={modelValue}>
                  {modelLabel}
                </option>
              );
            })}
          </HeaderSelect>
        </FilterBox>

        {/* 4단계: 시리얼 넘버 (공정라인) */}
        <FilterBox>
          <FilterLabel>
            <FiServer /> 4단계: 시리얼 넘버
          </FilterLabel>
          <HeaderSelect
            value={selectedSerial || ""}
            onChange={(e) => setSelectedSerial(e.target.value)}
            disabled={!selectedModel}
          >
            <option value="">-- 고유 S/N 선택 --</option>
            {serials?.map((l, idx) => {
              const serialValue = l.serial_no || l.serialNo;
              const lineNameView =
                l.line_label || l.line_name || l.lineName || serialValue;
              if (!serialValue) return null;
              return (
                <option key={serialValue + "_" + idx} value={serialValue}>
                  {lineNameView} ({serialValue})
                </option>
              );
            })}
          </HeaderSelect>
        </FilterBox>
      </FilterGroupWrapper>

      {/* 🌟 제어 액션 코어 가젯 단추 레이어 */}
      {selectedModel && selectedSerial && (
        <ActionRightButtonGroup>
          <TempListButton type="button" onClick={onOpenTempModal}>
            <FiDatabase /> 임시저장 내역 ({tempCount})
          </TempListButton>

          <TempSaveActionButton type="button" onClick={handleTempSave}>
            <FiSave /> 현재 데이터 임시저장
          </TempSaveActionButton>
        </ActionRightButtonGroup>
      )}
    </HeaderControlPanel>
  );
}

/* -------------------------------------------------------------------------- */
/* Header용 가반 스타일                            */
/* -------------------------------------------------------------------------- */

const HeaderControlPanel = styled.div`
  margin: 16px;
  padding: 16px 20px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
`;

const FilterGroupWrapper = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  flex: 1;
`;

const FilterBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 180px;
  flex: 1;
`;

const FilterLabel = styled.label`
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
  text-transform: uppercase;
`;

const HeaderSelect = styled.select`
  width: 100%;
  padding: 9px 12px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background-color: #ffffff;
  outline: none;
  color: #1e293b;
  transition: all 0.15s ease-in-out;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
  &:disabled {
    background: #f1f5f9;
    color: #94a3b8;
    cursor: not-allowed;
    border-color: #e2e8f0;
  }
`;

const ActionRightButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
  align-self: flex-end;
  height: 100%;
  padding-bottom: 2px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

const TempListButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: #ffffff;
  color: #475569;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: #f8fafc;
    color: #0f172a;
    border-color: #94a3b8;
  }
`;

const TempSaveActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: #475569;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: #334155;
  }
`;

export default ChecklistHeader;
