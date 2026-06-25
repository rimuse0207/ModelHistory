import React from "react";
import { FiCpu, FiPlus, FiHash } from "react-icons/fi";
import * as S from "../styles/BuilderStyles";

function LeftControlPanel({ ctx }) {
  return (
    <>
      {/* 1열: 장비 모델 관리 */}
      <S.ColumnSection>
        <S.ColumnHeader>
          <FiCpu /> 1단계: 장비 모델 관리
        </S.ColumnHeader>
        <S.FormGroup>
          <S.Label>보유 모델 선택</S.Label>
          <S.SelectBox
            value={ctx.selectedModel}
            onChange={(e) => ctx.setSelectedModel(e.target.value)}
          >
            <option value="">-- 모델 선택 --</option>
            {ctx.models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </S.SelectBox>
        </S.FormGroup>
        <S.FormGroup style={{ marginTop: "12px" }}>
          <S.Label>신규 장비 모델 등록</S.Label>
          <S.InlineInputRow>
            <S.Input
              type="text"
              placeholder="예: DGP8761"
              value={ctx.newModelInput}
              onChange={(e) => ctx.setNewModelInput(e.target.value)}
            />
            <S.IconButton onClick={ctx.handleAddModel}>
              <FiPlus />
            </S.IconButton>
          </S.InlineInputRow>
        </S.FormGroup>
      </S.ColumnSection>

      {/* 2열: 시리얼 & 라인 관리 */}
      <S.ColumnSection $bg="#fff">
        <S.ColumnHeader>
          <FiHash /> 2단계: Serial & Line 관리
        </S.ColumnHeader>
        <S.FormGroup>
          <S.Label>Line 및 S/N 선택</S.Label>
          <S.SelectBox
            value={ctx.selectedSerial}
            onChange={(e) => ctx.setSelectedSerial(e.target.value)}
            disabled={!ctx.selectedModel}
          >
            <option value="">-- 시리얼 선택 --</option>
            {ctx.serials.map((s) => (
              <option key={s.serial_no} value={s.serial_no}>
                {s.line_label} ({s.serial_no})
              </option>
            ))}
          </S.SelectBox>
        </S.FormGroup>
        <S.FormGroup style={{ marginTop: "20px" }}>
          <S.Label style={{ color: "#2563eb" }}>새 매핑 정보 동적 추가</S.Label>
          <S.VerticalInputCard>
            <div style={{ marginBottom: "10px" }}>
              <S.Label>공정 Line 입력</S.Label>
              <S.Input
                type="text"
                placeholder="예: Line 01"
                value={ctx.lineLabelInput}
                onChange={(e) => ctx.setLineLabelInput(e.target.value)}
                disabled={!ctx.selectedModel}
              />
            </div>
            <div style={{ marginBottom: "14px" }}>
              <S.Label>Serial Number(S/N)</S.Label>
              <S.Input
                type="text"
                placeholder="예: SN-DGP-001"
                value={ctx.newSerialInput}
                onChange={(e) => ctx.setNewSerialInput(e.target.value)}
                disabled={!ctx.selectedModel}
              />
            </div>
            <S.Button
              onClick={ctx.handleAddSerial}
              disabled={!ctx.selectedModel}
              style={{ width: "100%" }}
            >
              <FiPlus /> Serial, Line 등록
            </S.Button>
          </S.VerticalInputCard>
        </S.FormGroup>
      </S.ColumnSection>
    </>
  );
}

export default LeftControlPanel;
