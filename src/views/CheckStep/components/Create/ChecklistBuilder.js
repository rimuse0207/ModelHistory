import React, { useState } from "react";
import {
  FiPlus,
  FiTrash2,
  FiSave,
  FiLayers,
  FiList,
  FiArrowUp,
  FiArrowDown,
  FiCopy,
  FiX,
  FiEdit2,
  FiEdit3,
  FiBriefcase,
  FiMapPin,
  FiCpu,
  FiServer,
  FiSettings,
} from "react-icons/fi";
import { useBuilderContext } from "../../../../hooks/useBuilderContext";
import * as S from "./styles/BuilderStyles"; // 사장님의 정제된 스타일북 연동
import Navbar from "../../../Navigation/Navbar";
import FieldGridRow from "./body/FieldGridRow";
import ChecklistMasterModal from "./modal/ChecklistMasterModal"; // 🆕 새로 쪼갠 계층모달 탑재
import ChecklistCopyModal from "./modal/ChecklistCopyModal";

function ChecklistBuilder() {
  const ctx = useBuilderContext();

  const [modalMode, setModalMode] = useState("company");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openTargetLayer = (modeName) => {
    setModalMode(modeName);
    setIsModalOpen(true);
  };

  return (
    <>
      <Navbar />
      <S.BuilderContainer>
        {/* =========================================================
            [1열] 1단계 업체 및 2단계 지역 관제탑 패널
           ========================================================= */}
        <S.ColumnSection $bg="#ffffff">
          <S.ColumnHeader>
            <FiBriefcase color="#3b82f6" /> 고객사 관리
          </S.ColumnHeader>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {/* 1단계: 업체 */}
            <S.FormGroup>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <S.Label>1단계: 고객사 선택</S.Label>
                <FiSettings
                  style={{ cursor: "pointer", color: "#64748b" }}
                  size={13}
                  title="고객사 편집"
                  onClick={() => openTargetLayer("company")}
                />
              </div>
              <S.SelectBox
                value={ctx.selectedCustomer || ""}
                onChange={(e) => {
                  ctx.setSelectedCustomer(e.target.value);
                }}
              >
                <option value="">-- 고객사 선택 --</option>
                {ctx.customers?.map((c) => (
                  <option key={c.customer_code} value={c.customer_code}>
                    {c.customer_name}
                  </option>
                ))}
              </S.SelectBox>
            </S.FormGroup>

            {/* 2단계: 지역 */}
            <S.FormGroup>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <S.Label>2단계: 고객사 지역</S.Label>
                <FiSettings
                  style={{
                    cursor: ctx.selectedCustomer ? "pointer" : "not-allowed",
                    color: ctx.selectedCustomer ? "#64748b" : "#cbd5e1",
                  }}
                  size={13}
                  title="지역 편집"
                  onClick={() =>
                    ctx.selectedCustomer && openTargetLayer("region")
                  }
                />
              </div>
              <S.SelectBox
                value={ctx.selectedRegion || ""}
                onChange={(e) => ctx.setSelectedRegion(e.target.value)}
                disabled={!ctx.selectedCustomer}
              >
                <option value="">-- 고객사 지역 선택 --</option>
                {ctx.regions?.map((r) => (
                  <option key={r.regions_code} value={r.regions_code}>
                    {r.regions_name}
                  </option>
                ))}
              </S.SelectBox>
            </S.FormGroup>
          </div>
        </S.ColumnSection>

        {/* =========================================================
            [2열] 3단계 장비 모델 및 4단계 시리얼 Line 패널
           ========================================================= */}
        <S.ColumnSection $bg="#f8fafc">
          <S.ColumnHeader>
            <FiCpu color="#10b981" /> Model & Line 관리
          </S.ColumnHeader>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {/* 3단계: 장비 모델 */}
            <S.FormGroup>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <S.Label>3단계: 장비 모델 선택</S.Label>
                <FiSettings
                  style={{
                    cursor: ctx.selectedRegion ? "pointer" : "not-allowed",
                    color: ctx.selectedRegion ? "#64748b" : "#cbd5e1",
                  }}
                  size={13}
                  title="모델 마스터 편집"
                  onClick={() => ctx.selectedRegion && openTargetLayer("model")}
                />
              </div>
              <S.SelectBox
                value={ctx.selectedModel || ""}
                onChange={(e) => {
                  ctx.setSelectedModel(e.target.value);
                }}
                disabled={!ctx.selectedRegion}
              >
                <option value="">-- 점검 모델 선택 --</option>
                {ctx.models?.map((m) => (
                  <option key={m.model_no} value={m.model_no}>
                    {m.model_name}
                  </option>
                ))}
              </S.SelectBox>
            </S.FormGroup>

            {/* 4단계: 시리얼 Line */}
            <S.FormGroup>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <S.Label>4단계: 시리얼 Line 선택</S.Label>
                <FiSettings
                  style={{
                    cursor: ctx.selectedModel ? "pointer" : "not-allowed",
                    color: ctx.selectedModel ? "#64748b" : "#cbd5e1",
                  }}
                  size={13}
                  title="시리얼 마스터 편집"
                  onClick={() => ctx.selectedModel && openTargetLayer("serial")}
                />
              </div>
              <S.SelectBox
                value={ctx.selectedSerial || ""}
                onChange={(e) => ctx.setSelectedSerial(e.target.value)}
                disabled={!ctx.selectedModel}
              >
                <option value="">-- 고유 시리얼(Line) 선택 --</option>
                {ctx.serials?.map((s) => (
                  <option key={s.serial_no} value={s.serial_no}>
                    {s.line_name} ({s.serial_no})
                  </option>
                ))}
              </S.SelectBox>
            </S.FormGroup>
          </div>
        </S.ColumnSection>

        {/* =========================================================
            [3열] 5단계 진짜 동적 빌더 캔버스 워크스페이스 패널
           ========================================================= */}
        <S.LargeCanvasSection>
          <S.CanvasTopBar>
            <div>
              <S.CanvasTitle>
                <FiLayers /> 5단계: 장비 점검 항목 작성
              </S.CanvasTitle>
              <S.MetaIndicator>
                선택된 항목: [
                <span>
                  {ctx?.customers?.find(
                    (item) => item.customer_code === ctx.selectedCustomer,
                  )?.customer_name || "미선택"}
                </span>{" "}
                -{" "}
                <span>
                  {ctx?.regions?.find(
                    (item) => item.regions_code === ctx.selectedRegion,
                  )?.regions_name || "미선택"}
                </span>
                ] ➔{" "}
                <span>
                  {ctx?.models?.find(
                    (item) => item.model_no === ctx.selectedModel,
                  )?.model_name || "미선택"}
                </span>{" "}
                ➔{" "}
                <span>
                  {ctx?.serials?.find(
                    (item) => item.serial_no === ctx.selectedSerial,
                  )?.line_name || "미선택"}
                </span>
              </S.MetaIndicator>
            </div>

            <S.TopActionRightGroup>
              <S.CopyLoadButton
                onClick={() => ctx.setIsCopyModalOpen(true)}
                disabled={!ctx.selectedSerial}
              >
                <FiCopy /> 타 장비 장비 점검 복사
              </S.CopyLoadButton>
              <S.SaveButton
                onClick={ctx.handleSaveMasterTemplate}
                disabled={!ctx.selectedSerial}
              >
                <FiSave /> 점검 항목 최종 저장
              </S.SaveButton>
            </S.TopActionRightGroup>
          </S.CanvasTopBar>

          {!ctx.selectedSerial ? (
            <S.EmptyWrapper>
              <div className="alert-text">
                좌측의 1단계부터 4단계까지의 매핑 설정을 순서대로 완료하시면
                <br />
                해당 공정 장비 고유의 실시간 점검표 동적 설계 캔버스가
                활성화됩니다.
              </div>
            </S.EmptyWrapper>
          ) : (
            <S.WorkspaceScrollArea>
              {ctx.categories.map((cat, cIdx) => (
                <S.CategoryCard key={cat.id}>
                  <S.CategoryHeader>
                    <S.EditableTitleWrapper>
                      <S.Input
                        className="title-input"
                        value={cat.category}
                        onChange={(e) =>
                          ctx.updateCategoryName(cIdx, e.target.value)
                        }
                        placeholder="카테고리 제목 입력"
                      />
                      <FiEdit3 className="edit-hint-icon" size={14} />
                    </S.EditableTitleWrapper>

                    <S.HeaderControlGroup>
                      <S.SortButtonGroup>
                        <S.SortActionButton
                          onClick={() => ctx.moveCategory(cIdx, "up")}
                          disabled={cIdx === 0}
                          title="위로"
                        >
                          <FiArrowUp size={13} />
                        </S.SortActionButton>
                        <S.SortActionButton
                          onClick={() => ctx.moveCategory(cIdx, "down")}
                          disabled={cIdx === ctx.categories.length - 1}
                          title="아래로"
                        >
                          <FiArrowDown size={13} />
                        </S.SortActionButton>
                      </S.SortButtonGroup>
                      <S.DeleteCardButton
                        onClick={() => ctx.removeCategory(cIdx)}
                      >
                        <FiTrash2 /> 카드 삭제
                      </S.DeleteCardButton>
                    </S.HeaderControlGroup>
                  </S.CategoryHeader>

                  <S.CardBodyContainer>
                    {cat.points?.map((point, pIdx) => (
                      <S.PointSectionBlock key={point.pointId}>
                        <S.PointBlockHeader>
                          <S.PointTitleBox>
                            <FiList color="#475569" size={15} />
                            <S.EditablePointTitleWrapper>
                              <S.Input
                                className="point-title-input"
                                value={point.name}
                                onChange={(e) =>
                                  ctx.updatePointName(
                                    cIdx,
                                    pIdx,
                                    e.target.value,
                                  )
                                }
                                placeholder="점검 포인트 명칭 입력"
                              />
                              <FiEdit2 className="edit-point-icon" size={12} />
                            </S.EditablePointTitleWrapper>
                          </S.PointTitleBox>

                          <S.PointActionGroup>
                            <S.PointSortButtonGroup>
                              <S.PointSortButton
                                onClick={() => ctx.movePoint(cIdx, pIdx, "up")}
                                disabled={pIdx === 0}
                              >
                                <FiArrowUp size={11} />
                              </S.PointSortButton>
                              <S.PointSortButton
                                onClick={() =>
                                  ctx.movePoint(cIdx, pIdx, "down")
                                }
                                disabled={pIdx === cat.points.length - 1}
                              >
                                <FiArrowDown size={11} />
                              </S.PointSortButton>
                            </S.PointSortButtonGroup>
                            <S.SmallActionOutlineButton
                              onClick={() => ctx.addField(cIdx, pIdx)}
                            >
                              <FiPlus /> 필드 추가
                            </S.SmallActionOutlineButton>
                            <S.DeleteIconButton
                              onClick={() => ctx.removePoint(cIdx, pIdx)}
                            >
                              <FiTrash2 size={14} />
                            </S.DeleteIconButton>
                          </S.PointActionGroup>
                        </S.PointBlockHeader>

                        {point.fields?.map((field, fIdx) => (
                          <FieldGridRow
                            key={field.fieldId}
                            field={field}
                            cIdx={cIdx}
                            pIdx={pIdx}
                            fIdx={fIdx}
                            ctx={ctx}
                          />
                        ))}
                      </S.PointSectionBlock>
                    ))}
                    <S.BigGhostButton onClick={() => ctx.addPoint(cIdx)}>
                      <FiPlus /> 새로운 점검 포인트(위치) 추가
                    </S.BigGhostButton>
                  </S.CardBodyContainer>
                </S.CategoryCard>
              ))}
              <S.CanvasAddOutlineButton onClick={ctx.addCategory}>
                <FiPlus /> 새로운 대단위 점검 카테고리 생성
              </S.CanvasAddOutlineButton>
            </S.WorkspaceScrollArea>
          )}
        </S.LargeCanvasSection>

        <ChecklistCopyModal
          isOpen={ctx.isCopyModalOpen}
          onClose={() => ctx.setIsCopyModalOpen(false)}
          ctx={ctx}
        />
        {/* =========================================================
            🆕 계층형 인프라 독점 차단 제어 모달 주입
           ========================================================= */}
        <ChecklistMasterModal
          mode={modalMode}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          ctx={ctx}
        />
      </S.BuilderContainer>
    </>
  );
}

export default ChecklistBuilder;
