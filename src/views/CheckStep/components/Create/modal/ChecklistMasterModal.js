import React, { useState, useEffect } from "react";
import { FiX, FiPlus, FiTrash2, FiEdit2, FiCheck } from "react-icons/fi";
import * as S from "../styles/BuilderStyles"; // 사장님이 주신 스타일 100% 활용
import styled from "styled-components";

// 모달 내부용 스크롤 공간 및 인라인 CRUD 그리드 스타일 보정
const ModalBodyWrapper = styled(S.ModalBody)`
  display: flex;
  flex-direction: column;
  height: 420px;
  overflow: hidden;
`;

const CrudScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-top: 12px;
  padding-right: 4px;
`;

const InlineCrudRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8fafc;
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 8px;
  border: 1px solid #e2e8f0;
`;

function ChecklistMasterModal({ mode, isOpen, onClose, ctx }) {
  const [newInputName, setNewInputName] = useState("");
  const [newInputSub, setNewInputSub] = useState(""); // 시리얼용 Line 설명
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  // 모달 모드별 타이틀 및 타겟팅 리스트 가공 연산
  const meta = React.useMemo(() => {
    switch (mode) {
      case "company":
        return {
          title: "1단계: 고객사명 관리 ",
          placeholder: "신규 고객사명 입력",
          list: ctx.customers || [],
          displayKey: "customer_name",
          idKey: "customer_code",
        };
      case "region":
        const targetComp = ctx.customers?.find(
          (c) => String(c.customer_code) === String(ctx.selectedCustomer),
        );
        return {
          title: `2단계: [${targetComp?.customer_name || "미선택"}] 하위 지역 관리`,
          placeholder: "신규 지역 입력",
          list: ctx.regions || [],
          displayKey: "regions_name",
          idKey: "regions_code",
        };
      case "model":
        // 💡 [종속 설정] 특정 업체의 장비 모델 스펙 라인 락 체결
        const parentComp = ctx.customers?.find(
          (c) => String(c.customer_code) === String(ctx.selectedCustomer),
        );
        const parentRegions = ctx.regions?.find(
          (c) => String(c.regions_code) === String(ctx.selectedRegion),
        );
        return {
          title: `3단계: [${parentComp?.customer_name} ${parentRegions?.regions_name}] 장비 모델 라인업`,
          placeholder: "신규 장비 모델명 입력",
          list:
            ctx.models?.map((m) =>
              typeof m === "string" ? { id: m, name: m } : m,
            ) || [],
          displayKey: "model_name",
          idKey: "model_no",
        };
      case "serial":
        return {
          title: `4단계: [${ctx.selectedModel || "미선택"}] Serial Number 및 Line 관리`,
          placeholder: "고유 S/N 시리얼 번호 기입",
          list: ctx.serials || [],
          displayKey: "line_name",
          idKey: "serial_no",
        };
      default:
        return {
          title: "마스터 관리",
          placeholder: "",
          list: [],
          displayKey: "",
          idKey: "",
        };
    }
  }, [
    mode,
    ctx.customers,
    ctx.regions,
    ctx.models,
    ctx.serials,
    ctx.selectedCustomer,
    ctx.selectedModel,
  ]);

  if (!isOpen) return null;

  // 신규 아이템 등록 비동기 체인 연동
  const handleCreate = () => {
    if (!newInputName.trim()) return;

    if (mode === "company" && ctx.onAddCompany) ctx.onAddCompany(newInputName);
    if (mode === "region" && ctx.onAddRegion)
      ctx.onAddRegion(ctx.selectedCustomer, newInputName); // 부모 ID 동반 탑재
    if (mode === "model" && ctx.onAddModel)
      ctx.onAddModel(ctx.selectedRegion, ctx.selectedCustomer, newInputName); // 부모 ID 동반 탑재
    if (mode === "serial" && ctx.onAddSerial)
      ctx.onAddSerial(
        ctx.selectedCustomer,
        ctx.selectedRegion,
        ctx.selectedModel,
        newInputName,
        newInputSub,
      ); // 모델 ID 수혈

    setNewInputName("");
    setNewInputSub("");
  };

  // 기존 아이템 인라인 수정 체인 연동
  const handleUpdate = (id) => {
    if (!editingValue.trim()) return;

    if (mode === "company" && ctx.onUpdateCompany)
      ctx.onUpdateCompany(id, editingValue);
    if (mode === "region" && ctx.onUpdateRegion)
      ctx.onUpdateRegion(id, editingValue);
    if (mode === "model" && ctx.onUpdateModel)
      ctx.onUpdateModel(id, editingValue);
    if (mode === "serial" && ctx.onUpdateSerial)
      ctx.onUpdateSerial(id, editingValue);

    setEditingId(null);
    setEditingValue("");
  };

  // 아이템 삭제 예외 가드레일 작동
  const handleDelete = (id) => {
    if (
      !window.confirm(
        `🚨 [위험] 선택한 마스터 내역을 완전히 삭제하시겠습니까?\n이 단계와 연결된 하위 장비 설계 스펙 명세가 함께 파괴될 수 있습니다.`,
      )
    )
      return;

    if (mode === "company" && ctx.onDeleteCompany) ctx.onDeleteCompany(id);
    if (mode === "region" && ctx.onDeleteRegion) ctx.onDeleteRegion(id);
    if (mode === "model" && ctx.onDeleteModel) ctx.onDeleteModel(id);
    if (mode === "serial" && ctx.onDeleteSerial) ctx.onDeleteSerial(id);
  };

  return (
    <S.ModalOverlay onClick={onClose}>
      <S.ModalContent
        style={{ width: "600px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <S.ModalHeader>
          <h4>{meta.title}</h4>
          <button className="close-btn" onClick={onClose}>
            <FiX size={18} />
          </button>
        </S.ModalHeader>

        <ModalBodyWrapper>
          {/* 상단: 크리에이터 폼 */}
          <S.InlineInputRow>
            <S.Input
              style={{ flex: "1" }}
              value={newInputName}
              onChange={(e) => setNewInputName(e.target.value)}
              placeholder={meta.placeholder}
            />
            {mode === "serial" && (
              <S.Input
                style={{ width: "160px" }}
                value={newInputSub}
                onChange={(e) => setNewInputSub(e.target.value)}
                placeholder="라인 명칭"
              />
            )}
            <S.ModalConfirmButton
              onClick={handleCreate}
              style={{ whiteSpace: "nowrap" }}
            >
              <FiPlus /> 등록
            </S.ModalConfirmButton>
          </S.InlineInputRow>

          {/* 하단: 바인딩 리스트 이력 */}
          <CrudScrollArea>
            {meta.list.map((item, idx) => {
              const itemId = item[meta.idKey] || idx;
              const isEditing = editingId === itemId;
              const textValue = item[meta.displayKey] || "";

              return (
                <InlineCrudRow key={itemId}>
                  {isEditing ? (
                    <S.Input
                      style={{ flex: "1" }}
                      value={editingValue}
                      // onChange={(e) => setEditingValue(e.target.value)}
                    />
                  ) : (
                    <span
                      style={{ flex: "1", fontSize: "13px", color: "#334155" }}
                    >
                      {mode === "serial" ? `${item.serial_no || "미정"} ` : ""}
                      <b>{textValue}</b>
                    </span>
                  )}

                  <div style={{ display: "flex", gap: "4px" }}>
                    <S.ModalConfirmButton
                      style={{ padding: "6px 10px" }}
                      onClick={() =>
                        alert("수정 및 삭제는 IT팀에 문의 해 주세요.")
                      }
                    >
                      <FiEdit2 />
                    </S.ModalConfirmButton>

                    <S.DeleteCardButton
                      style={{ padding: "4px 10px" }}
                      onClick={() =>
                        alert("수정 및 삭제는 IT팀에 문의 해 주세요.")
                      }
                    >
                      <FiTrash2 size={12} />
                    </S.DeleteCardButton>
                  </div>
                </InlineCrudRow>
              );
            })}
          </CrudScrollArea>
        </ModalBodyWrapper>
      </S.ModalContent>
    </S.ModalOverlay>
  );
}

export default ChecklistMasterModal;
