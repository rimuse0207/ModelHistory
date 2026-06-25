import React, { useState, useEffect } from "react";
import { FiX, FiCopy } from "react-icons/fi";
import * as S from "../styles/BuilderStyles"; // 사장님 공통 스타일북 지정
import { toast } from "../../../../../utils/ToastMessage/ToastManager";

function ChecklistCopyModal({ isOpen, onClose, ctx }) {
  // 💡 복사 소스 장비를 정밀 스크리닝하기 위한 독립 계층형 로컬 상태셋
  const [sourceCompany, setSourceCompany] = useState("");
  const [sourceRegion, setSourceRegion] = useState("");
  const [sourceModel, setSourceModel] = useState("");
  const [sourceSerial, setSourceSerial] = useState("");

  // 유동적 렌더링을 위한 가상 로컬 배열 버퍼 (사장님 데이터 파이프라인 구조 연동)
  const [regionOptions, setRegionOptions] = useState([]);
  const [modelOptions, setModelOptions] = useState([]);
  const [serialOptions, setSerialOptions] = useState([]);

  // 모달이 닫히거나 열릴 때 선택 이력 클린업 청소
  useEffect(() => {
    if (!isOpen) {
      setSourceCompany("");
      setSourceRegion("");
      setSourceModel("");
      setSourceSerial("");
    }
  }, [isOpen]);

  // 🔄 연쇄 반응 1: 소스 업체 변경 시 ➔ 해당 업체의 지역 필터링
  useEffect(() => {
    if (!sourceCompany) {
      setRegionOptions([]);
      setSourceRegion("");
      return;
    }

    setRegionOptions(
      ctx.basicOptionsList.regions.filter(
        (item) => item.customer_code === sourceCompany,
      ),
    );
    setSourceRegion("");
    setModelOptions([]);
    setSourceModel("");
  }, [sourceCompany]);

  // 🔄 연쇄 반응 2: 소스 지역 변경 시 ➔ 해당 지역의 장비 모델 필터링
  useEffect(() => {
    if (!sourceRegion) {
      setModelOptions([]);
      setSourceModel("");
      return;
    }

    setModelOptions(
      ctx.basicOptionsList.models.filter(
        (item) => item.regions_code === sourceRegion,
      ),
    );

    setSourceModel("");
    setSerialOptions([]);
    setSourceSerial("");
  }, [sourceRegion]);

  // 🔄 연쇄 반응 3: 소스 모델 변경 시 ➔ 해당 모델의 최종 고유 시리얼 Line 수혈
  useEffect(() => {
    if (!sourceModel) {
      setSerialOptions([]);
      setSourceSerial("");
      return;
    }

    setSerialOptions(
      ctx.basicOptionsList.serials.filter(
        (item) => item.model_no === sourceModel,
      ),
    );

    setSourceSerial("");
  }, [sourceModel]);

  if (!isOpen) return null;

  const handleApplyCopy = () => {
    if (!sourceModel || !sourceSerial) return;

    if (
      sourceModel === ctx.selectedModel &&
      sourceSerial === ctx.selectedSerial
    ) {
      toast.show({
        title: `⚠️ 현재 편집 중인 장비 점검항목을 자기 자신에게 복사해 올 수 없습니다.`,
        successCheck: false,
        duration: 3000,
      });
      return;
    }

    if (ctx.onExecuteTemplateCopy) {
      ctx.onExecuteTemplateCopy(sourceModel, sourceSerial);
      onClose();
    }
  };

  return (
    <S.ModalOverlay onClick={onClose}>
      <S.ModalContent
        style={{ width: "480px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <S.ModalHeader>
          <h4>
            <FiCopy /> 타 장비 검사 항목 복사
          </h4>
          <button className="close-btn" onClick={onClose}>
            <FiX size={18} />
          </button>
        </S.ModalHeader>

        <S.ModalBody>
          <p className="notice-desc">
            설계 스펙을 긁어올 <b>장비 검사 항목</b>를을 순서대로 지정해 주세요.
            <br />
            현재 작성 중이던 임시 검사 항목은 모두 덮어써집니다.
          </p>

          {/* 1단계: 소스 업체 */}
          <div style={{ marginBottom: "12px" }}>
            <S.Label>1. 원본 소스 업체</S.Label>
            <S.SelectBox
              value={sourceCompany}
              onChange={(e) => setSourceCompany(e.target.value)}
            >
              <option value="">-- 복사 대상 업체 선택 --</option>
              {ctx?.basicOptionsList?.customers?.map((c) => (
                <option key={c.customer_code} value={c.customer_code}>
                  {c.customer_name}
                </option>
              ))}
            </S.SelectBox>
          </div>

          {/* 2단계: 소스 지역 */}
          <div style={{ marginBottom: "12px" }}>
            <S.Label>2. 업체의 소스 지역</S.Label>
            <S.SelectBox
              value={sourceRegion}
              onChange={(e) => setSourceRegion(e.target.value)}
              disabled={!sourceCompany}
            >
              <option value="">-- 복사 대상 지역 선택 --</option>
              {regionOptions.map((r) => (
                <option key={r.regions_code} value={r.regions_code}>
                  {r.regions_name}
                </option>
              ))}
            </S.SelectBox>
          </div>

          {/* 3단계: 소스 모델 */}
          <div style={{ marginBottom: "12px" }}>
            <S.Label>3. 소스 장비 모델명</S.Label>
            <S.SelectBox
              value={sourceModel}
              onChange={(e) => setSourceModel(e.target.value)}
              disabled={!sourceRegion}
            >
              <option value="">-- 복사 대상 모델 선택 --</option>
              {modelOptions.map((m) => (
                <option key={m.model_no} value={m.model_no}>
                  {m.model_name}
                </option>
              ))}
            </S.SelectBox>
          </div>

          {/* 4단계: 소스 시리얼 Line */}
          <div style={{ marginBottom: "24px" }}>
            <S.Label>4. 장비 고유 일련번호 (S/N)</S.Label>
            <S.SelectBox
              value={sourceSerial}
              onChange={(e) => setSourceSerial(e.target.value)}
              disabled={!sourceModel}
            >
              <option value="">-- 복사 대상 시리얼 선택 --</option>
              {serialOptions.map((s) => (
                <option key={s.serial_no} value={s.serial_no}>
                  {s.line_name} ({s.serial_no})
                </option>
              ))}
            </S.SelectBox>
          </div>

          {/* 하단 액션 제어바 */}
          <S.InlineInputRow style={{ justifyContent: "flex-end", gap: "10px" }}>
            <S.ModalCancelButton onClick={onClose}>취소</S.ModalCancelButton>
            <S.ModalConfirmButton
              onClick={handleApplyCopy}
              disabled={!sourceSerial}
            >
              설계도 복사 강제 적용
            </S.ModalConfirmButton>
          </S.InlineInputRow>
        </S.ModalBody>
      </S.ModalContent>
    </S.ModalOverlay>
  );
}

export default ChecklistCopyModal;
