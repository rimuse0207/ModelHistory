import React, { useState, useEffect } from "react";
import {
  FiX,
  FiSave,
  FiCheckSquare,
  FiSquare,
  FiTrash2,
  FiSearch,
} from "react-icons/fi";
import * as S from "../styles/BuilderStyles";

function ChecklistMultiSaveModal({ isOpen, onClose, ctx }) {
  const [filterCompany, setFilterCompany] = useState("");
  const [filterRegion, setFilterRegion] = useState("");
  const [filterModel, setFilterModel] = useState("");

  const [regionOptions, setRegionOptions] = useState([]);
  const [modelOptions, setModelOptions] = useState([]);
  const [serialOptions, setSerialOptions] = useState([]);

  const [searchKeyword, setSearchKeyword] = useState("");

  const [selectedTargets, setSelectedTargets] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      setFilterCompany("");
      setFilterRegion("");
      setFilterModel("");
      setSearchKeyword("");
      setSelectedTargets([]);
    }
  }, [isOpen]);

  // 🔄 계층형 필터 연쇄 반응 로직
  useEffect(() => {
    if (!filterCompany) {
      setRegionOptions([]);
      setFilterRegion("");
      return;
    }
    setRegionOptions(
      ctx.basicOptionsList.regions.filter(
        (item) => item.customer_code === filterCompany,
      ),
    );
    setFilterRegion("");
  }, [filterCompany, ctx.basicOptionsList]);

  useEffect(() => {
    if (!filterRegion) {
      setModelOptions([]);
      setFilterModel("");
      return;
    }
    setModelOptions(
      ctx.basicOptionsList.models.filter(
        (item) => item.regions_code === filterRegion,
      ),
    );
    setFilterModel("");
  }, [filterRegion, ctx.basicOptionsList]);

  useEffect(() => {
    if (!filterModel) {
      setSerialOptions([]);
      return;
    }
    const filtered = ctx.basicOptionsList.serials.filter(
      (item) => item.model_no === filterModel,
    );
    setSerialOptions(
      filtered.filter((s) => s.serial_no !== ctx.selectedSerial),
    );
  }, [filterModel, ctx.basicOptionsList, ctx.selectedSerial]);

  // 🎯 [핵심] 시리얼 번호만으로 역추적하여 업체, 지역, 모델명을 뽑아내는 헬퍼 함수
  const getFullRouteDetails = (targetSerialObj) => {
    const { customers, regions, models } = ctx.basicOptionsList;

    const targetModel = models?.find(
      (m) => m.model_no === targetSerialObj.model_no,
    );
    const targetRegion = regions?.find(
      (r) => r.regions_code === targetModel?.regions_code,
    );
    const targetCompany = customers?.find(
      (c) => c.customer_code === targetRegion?.customer_code,
    );

    return {
      ...targetSerialObj,
      modName: targetModel?.model_name || "알수없음",
      regName: targetRegion?.regions_name || "알수없음",
      compName: targetCompany?.customer_name || "알수없음",
    };
  };

  // 체크박스 토글 로직 (검색이든 필터든 동일하게 작동)
  const toggleTarget = (serialObj) => {
    setSelectedTargets((prev) => {
      const exists = prev.find((t) => t.serial_no === serialObj.serial_no);
      if (exists)
        return prev.filter((t) => t.serial_no !== serialObj.serial_no);

      // 역추적 함수를 통해 전체 경로 바인딩
      const detailedTarget = getFullRouteDetails(serialObj);
      return [...prev, detailedTarget];
    });
  };

  const removeTarget = (serialNo) => {
    setSelectedTargets((prev) => prev.filter((t) => t.serial_no !== serialNo));
  };

  const handleExecuteMultiSave = () => {
    const formattedTargets = selectedTargets.map((t) => ({
      modelNo: t.model_no,
      serialNo: t.serial_no,
      lineLabel: t.line_name || t.line_label,
    }));
    ctx.handleSaveMasterTemplate(formattedTargets);
    onClose();
  };

  // 💡 [신규] 렌더링할 리스트 결정 (검색어가 있으면 전역 검색 결과, 없으면 계층 필터 결과)
  const displayList = searchKeyword.trim()
    ? ctx.basicOptionsList.serials.filter(
        (s) =>
          s.serial_no !== ctx.selectedSerial &&
          (s.serial_no.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            (s.line_name || s.line_label || "")
              .toLowerCase()
              .includes(searchKeyword.toLowerCase())),
      )
    : serialOptions;

  if (!isOpen) return null;

  return (
    <S.ModalOverlay onClick={onClose}>
      <S.ModalContent
        style={{ width: "560px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <S.ModalHeader>
          <h4>
            <FiSave /> 동시 저장 (Multi-Save)
          </h4>
          <button className="close-btn" onClick={onClose}>
            <FiX size={18} />
          </button>
        </S.ModalHeader>

        <S.ModalBody>
          <p className="notice-desc">
            현재 작성된 점검 항목을 <b>다른 장비(라인)들에도 동시에 저장</b>할
            수 있습니다. 아래에서 타겟 장비를 검색하고 추가해 주세요.
          </p>

          {/* 🎯 [신규] 전역 시리얼 검색창 */}
          <div style={{ position: "relative", marginBottom: "16px" }}>
            <FiSearch
              style={{
                position: "absolute",
                left: "10px",
                top: "11px",
                color: "#94a3b8",
              }}
            />
            <S.Input
              type="text"
              placeholder="시리얼 번호(S/N) 또는 라인명으로 빠른 전역 검색..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              style={{
                paddingLeft: "32px",
                borderColor: searchKeyword ? "#2563eb" : "#cbd5e1",
              }}
            />
          </div>

          {!searchKeyword && (
            <>
              <S.InlineInputRow style={{ marginBottom: "12px" }}>
                <S.SelectBox
                  value={filterCompany}
                  onChange={(e) => setFilterCompany(e.target.value)}
                >
                  <option value="">-- 업체 필터 --</option>
                  {ctx?.basicOptionsList?.customers?.map((c) => (
                    <option key={c.customer_code} value={c.customer_code}>
                      {c.customer_name}
                    </option>
                  ))}
                </S.SelectBox>
                <S.SelectBox
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  disabled={!filterCompany}
                >
                  <option value="">-- 지역 필터 --</option>
                  {regionOptions.map((r) => (
                    <option key={r.regions_code} value={r.regions_code}>
                      {r.regions_name}
                    </option>
                  ))}
                </S.SelectBox>
              </S.InlineInputRow>

              <S.SelectBox
                value={filterModel}
                onChange={(e) => setFilterModel(e.target.value)}
                disabled={!filterRegion}
                style={{ marginBottom: "12px" }}
              >
                <option value="">-- 모델 필터 --</option>
                {modelOptions.map((m) => (
                  <option key={m.model_no} value={m.model_no}>
                    {m.model_name}
                  </option>
                ))}
              </S.SelectBox>
            </>
          )}

          {/* 타겟 선택 리스트 영역 */}
          <div
            style={{
              maxHeight: "130px",
              overflowY: "auto",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              padding: "8px",
            }}
          >
            {displayList.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  color: "#94a3b8",
                  fontSize: "12px",
                  padding: "16px 0",
                }}
              >
                {searchKeyword
                  ? "검색된 장비가 없습니다."
                  : "위의 필터를 선택하여 장비를 조회해 주세요."}
              </div>
            ) : (
              displayList.map((s) => {
                const isSelected = selectedTargets.some(
                  (t) => t.serial_no === s.serial_no,
                );

                // 검색 모드일 때는 해당 장비의 전체 경로를 텍스트로 살짝 보여줌
                const routeHint = searchKeyword ? getFullRouteDetails(s) : null;

                return (
                  <div
                    key={s.serial_no}
                    onClick={() => toggleTarget(s)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      padding: "8px",
                      cursor: "pointer",
                      backgroundColor: isSelected ? "#f0fdf4" : "transparent",
                      border: isSelected
                        ? "1px solid #bbf7d0"
                        : "1px solid transparent",
                      borderRadius: "6px",
                      marginBottom: "4px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {isSelected ? (
                        <FiCheckSquare color="#16a34a" />
                      ) : (
                        <FiSquare color="#cbd5e1" />
                      )}
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: isSelected ? "800" : "600",
                          color: isSelected ? "#166534" : "#1e293b",
                        }}
                      >
                        {s.line_name || s.line_label} ({s.serial_no})
                      </span>
                    </div>
                    {/* 검색 모드일 때만 소속 정보 표시 */}
                    {searchKeyword && (
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#64748b",
                          paddingLeft: "22px",
                        }}
                      >
                        {routeHint.compName} ➔ {routeHint.regName} ➔{" "}
                        {routeHint.modName}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* 최종 선택된 배포 리스트 */}
          {selectedTargets.length > 0 && (
            <div style={{ marginTop: "16px" }}>
              <S.Label>
                최종 동시 저장 리스트 ({selectedTargets.length}대)
              </S.Label>
              <div
                style={{
                  maxHeight: "140px",
                  overflowY: "auto",
                  background: "#f8fafc",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  padding: "8px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  marginTop: "6px",
                }}
              >
                {selectedTargets.map((t) => (
                  <div
                    key={t.serial_no}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "12px",
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      padding: "6px 10px",
                      borderRadius: "4px",
                    }}
                  >
                    <div>
                      <span style={{ color: "#64748b" }}>
                        {t.compName} - {t.regName} - {t.modName} -{" "}
                      </span>
                      <span style={{ fontWeight: "800", color: "#2563eb" }}>
                        {t.line_name || t.line_label} ({t.serial_no})
                      </span>
                    </div>
                    <button
                      onClick={() => removeTarget(t.serial_no)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ef4444",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                      }}
                      title="목록에서 제외"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <S.Divider />

          {/* 스마트 단일 통합 저장 버튼 */}
          <S.InlineInputRow
            style={{ justifyContent: "flex-end", alignItems: "center" }}
          >
            <S.ModalCancelButton
              onClick={onClose}
              style={{ marginRight: "10px" }}
            >
              취소
            </S.ModalCancelButton>

            <S.ModalConfirmButton onClick={handleExecuteMultiSave}>
              <FiSave style={{ marginRight: "6px" }} />
              {selectedTargets.length > 0
                ? `총 ${selectedTargets.length + 1}대 장비에 동시 저장`
                : `현재 장비에만 단독 저장`}
            </S.ModalConfirmButton>
          </S.InlineInputRow>
        </S.ModalBody>
      </S.ModalContent>
    </S.ModalOverlay>
  );
}

export default ChecklistMultiSaveModal;
