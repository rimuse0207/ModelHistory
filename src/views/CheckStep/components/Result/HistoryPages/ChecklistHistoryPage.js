import React, { useState } from "react";
import styled from "styled-components";
import { useChecklistHistory } from "../../../../../hooks/useCheckHistory";
import Navbar from "../../../../Navigation/Navbar";
import {
  FiBriefcase,
  FiMapPin,
  FiCpu,
  FiServer,
  FiFileText,
  FiSearch,
  FiXCircle,
} from "react-icons/fi";
import moment from "moment";
import "moment/locale/ko";

moment.locale("ko");

const ChecklistHistoryPage = () => {
  const {
    companies,
    regions,
    models,
    lines,
    records,
    selectedCustomer,
    setSelectedCustomer,
    selectedRegion,
    setSelectedRegion,
    selectedModel,
    setSelectedModel,
    selectedLine,
    setSelectedLine,
    modelSearchTerm,
    setModelSearchTerm,
    basicOptionsList,
    globalSearchTerm,
    setGlobalSearchTerm,
  } = useChecklistHistory();

  // const [globalSearchTerm, setGlobalSearchTerm] = useState("");

  const handleViewDetail = (submissionId) => {
    const popupUrl = `/history/detail/${submissionId}`;
    window.open(
      popupUrl,
      `ChecklistDetail_${submissionId}`,
      "width=1100,height=850,scrollbars=yes,resizable=yes",
    );
  };

  const handleClearSearch = () => {
    setGlobalSearchTerm("");
  };

  const isSearchingMode = globalSearchTerm.trim().length > 0;

  return (
    <PageWrapper>
      <Navbar />

      <SearchGlobalBarSection>
        <SearchInnerWrapper>
          <FiSearch className="search-icon" size={18} />
          <GlobalSearchInput
            type="text"
            placeholder="고객사명, 지역소, 장비 모델, 고유 시리얼 넘버(S/N) 통합 검색 (스페이스바 구분 검색 가능)..."
            value={globalSearchTerm}
            onChange={(e) => setGlobalSearchTerm(e.target.value)} // 💡 이제 검색어가 커스텀 훅 내부의 디바운스 이펙트를 트리거합니다!
          />
          {isSearchingMode && (
            <ClearSearchButton onClick={handleClearSearch} title="검색 초기화">
              <FiXCircle size={18} />
            </ClearSearchButton>
          )}
        </SearchInnerWrapper>
      </SearchGlobalBarSection>

      <HistoryContainer $isSearching={isSearchingMode}>
        {!isSearchingMode && (
          <Panel>
            <PanelHeader>
              <h3>
                <FiBriefcase color="#3b82f6" /> 고객사 선택
              </h3>
            </PanelHeader>
            <PanelBody
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <SelectGroup>
                <GroupLabel>1단계: 고객사 선택</GroupLabel>
                <HistorySelectBox
                  value={selectedCustomer || ""}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                >
                  <option value="">-- 고객사 선택 --</option>
                  {companies?.map((c) => (
                    <option key={c.customer_code} value={c.customer_code}>
                      {c.customer_name}
                    </option>
                  ))}
                </HistorySelectBox>
              </SelectGroup>

              <SelectGroup>
                <GroupLabel>2단계: 고객사 지역</GroupLabel>
                <HistorySelectBox
                  value={selectedRegion || ""}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  disabled={!selectedCustomer}
                >
                  <option value="">-- 고객사 지역 선택 --</option>
                  {regions?.map((r) => (
                    <option key={r.regions_code} value={r.regions_code}>
                      {r.regions_name}
                    </option>
                  ))}
                </HistorySelectBox>
              </SelectGroup>
              <MobileOnlyNotice>
                모바일에서는 상단 통합 검색창을 이용해 한방에 매칭 결과를 찾을
                수 있습니다.
              </MobileOnlyNotice>
            </PanelBody>
          </Panel>
        )}

        {!isSearchingMode && (
          <DesktopPanel>
            <PanelHeader>
              <h3>
                <FiCpu color="#10b981" /> 3단계: 장비 모델
              </h3>
            </PanelHeader>
            <PanelBody>
              {selectedRegion ? (
                models?.length > 0 ? (
                  models.map((m) => {
                    const isModelActive = selectedModel === m.model_no;
                    return (
                      <ListItem
                        key={m.id}
                        $isActive={isModelActive}
                        onClick={() =>
                          setSelectedModel(isModelActive ? null : m.model_no)
                        }
                      >
                        <span className="title">
                          {m.model_name || m.model_no}
                        </span>
                        <span className="arrow">→</span>
                      </ListItem>
                    );
                  })
                ) : (
                  <EmptyText>이 지역에 등록된 장비 모델이 없습니다.</EmptyText>
                )
              ) : (
                <EmptyText>좌측의 1~2단계 고객사를 선택해 주세요.</EmptyText>
              )}
            </PanelBody>
          </DesktopPanel>
        )}

        {!isSearchingMode && (
          <DesktopPanel>
            <PanelHeader>
              <h3>
                <FiServer color="#8b5cf6" /> 4단계: 시리얼 넘버
              </h3>
              {selectedModel && (
                <SubTitle>
                  선택 모델:{" "}
                  <strong>
                    {
                      basicOptionsList?.models?.find(
                        (item) => item.model_no === selectedModel,
                      )?.model_name
                    }
                  </strong>
                </SubTitle>
              )}
            </PanelHeader>
            <PanelBody>
              {selectedModel ? (
                lines?.length > 0 ? (
                  lines.map((l) => (
                    <ListItem
                      key={l.serial_no}
                      $isActive={selectedLine === l.serial_no}
                      onClick={() => setSelectedLine(l.serial_no)}
                    >
                      <div>
                        <span className="title">
                          {l.line_name} ({l.serial_no})
                        </span>
                        {/* <CountBadge>{l.recordCount || 0}건</CountBadge> */}
                      </div>
                      <span className="arrow">→</span>
                    </ListItem>
                  ))
                ) : (
                  <EmptyText>이 모델에 등록된 고유 장비가 없습니다.</EmptyText>
                )
              ) : (
                <EmptyText>장비 모델을 먼저 선택해 주세요.</EmptyText>
              )}
            </PanelBody>
          </DesktopPanel>
        )}

        <Panel style={{ gridColumn: isSearchingMode ? "1 / -1" : "auto" }}>
          <PanelHeader>
            <h3>
              <FiFileText color="#f59e0b" />
              {isSearchingMode
                ? `🔍 통합 검색 결과 리스트 (키워드: ${globalSearchTerm})`
                : "5단계: 점검 이력 리스트"}
            </h3>
            {!isSearchingMode && selectedLine && (
              <SubTitle>
                라인 ( S/N ):{" "}
                <strong>
                  {
                    basicOptionsList?.serials?.find(
                      (item) => item.serial_no === selectedLine,
                    )?.line_name
                  }
                  {"  "}({selectedLine})
                </strong>
              </SubTitle>
            )}
          </PanelHeader>
          <PanelBody>
            {isSearchingMode || selectedLine ? (
              records?.length > 0 ? (
                records.map((r) => (
                  <RecordCard key={r.submissionId}>
                    <RecordMainContent>
                      {/* 1. 계층 태그 배지 세트 (검색 모드 전용) */}
                      {isSearchingMode && (
                        <BadgeWrapper style={{ marginBottom: "10px" }}>
                          <MetaBadge $bgColor="#eff6ff" $color="#1d4ed8">
                            <FiBriefcase size={10} /> {r.customerName}
                          </MetaBadge>
                          <MetaBadge $bgColor="#fef2f2" $color="#b91c1c">
                            <FiMapPin size={10} /> {r.regionName}
                          </MetaBadge>
                          <MetaBadge $bgColor="#ecfdf5" $color="#047857">
                            <FiCpu size={10} /> {r.modelName}
                          </MetaBadge>
                        </BadgeWrapper>
                      )}

                      {/* 2. 시리얼넘버 및 오차/실패 상태 요약 배지 */}
                      <CardTopRow>
                        <SerialNo>SN: {r.serialNo || "미기입"}</SerialNo>
                        {/* 💡 [신설] 실패(오차) 개수가 1개 이상이면 경고 빨간 배지 표출 */}
                        {Number(r.failCount) > 0 ? (
                          <FailCountBadge>오차 {r.failCount}건</FailCountBadge>
                        ) : (
                          <SuccessCountBadge>정상 완료</SuccessCountBadge>
                        )}
                      </CardTopRow>

                      {/* 3. 인프라 실무자 정보 및 실제 작업 수행 시점 바인딩 */}
                      <MetaGridInfo>
                        <div className="info-item">
                          <span className="label">작성자:</span>
                          <span className="value">
                            {r.departmentName} {r.fullName} {r.titleName}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="label">담당 작업자:</span>
                          <span className="value">{r.workerName || "-"}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">작업 일시:</span>
                          <span className="value">
                            {r.workDate
                              ? `${moment(`${moment(r.workDate).format("YYYY-MM-DD")}T${r.workTime}`).format("YYYY. M. D. LTS")}`
                              : "기록 없음"}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="label">등록 시간:</span>
                          <span className="value">
                            {new Date(r.completedAt).toLocaleString()}
                          </span>
                        </div>
                      </MetaGridInfo>

                      {/* 4. 종합 조치 소견 및 특이사항 내용 말말말 */}
                      {r.summaryComments && (
                        <CommentBlock>
                          <div className="comment-title">
                            결과 확인 및 특이사항
                          </div>
                          <div className="comment-text">
                            {r.summaryComments}
                          </div>
                        </CommentBlock>
                      )}
                    </RecordMainContent>

                    <ViewButton
                      onClick={() => handleViewDetail(r.submissionId)}
                    >
                      점검 확인
                    </ViewButton>
                  </RecordCard>
                ))
              ) : (
                <EmptyText>
                  {isSearchingMode
                    ? "검색 키워드와 일치하는 점검 이력 기록이 존재하지 않습니다."
                    : "등록된 이력 기록이 존재하지 않습니다."}
                </EmptyText>
              )
            ) : (
              <EmptyText>
                상단 바에서 <b>통합 검색어</b>를 입력하시거나,
                <br />
                좌측의 단계를 순서대로 선택하시면 점검 기록을 확인 가능합니다.
              </EmptyText>
            )}
          </PanelBody>
        </Panel>
      </HistoryContainer>
    </PageWrapper>
  );
};

export default ChecklistHistoryPage;

/* -------------------------------------------------------------------------- */
/*                            Styled Components                               */
/* -------------------------------------------------------------------------- */

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f1f5f9;
`;

const SearchGlobalBarSection = styled.div`
  background: #ffffff;
  padding: 12px 20px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
`;

const SearchInnerWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  display: flex;
  align-items: center;

  .search-icon {
    position: absolute;
    left: 14px;
    color: #94a3b8;
    pointer-events: none;
  }
`;

const GlobalSearchInput = styled.input`
  width: 100%;
  padding: 12px 40px;
  font-size: 14px;
  font-weight: 500;
  border: 2px solid #cbd5e1;
  border-radius: 30px; /* 돋보기 모양에 걸맞는 라운딩 */
  outline: none;
  background: #f8fafc;
  transition: all 0.2s ease-in-out;

  &:focus {
    border-color: #2563eb;
    background: #ffffff;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08);
  }
`;

const ClearSearchButton = styled.button`
  position: absolute;
  right: 14px;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #64748b;
  }
`;

const HistoryContainer = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    props.$isSearching ? "1fr" : "260px 260px 260px 1fr"};
  gap: 16px;
  height: calc(100vh - 130px); /* 검색바 공간 확보 */
  padding: 16px;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    grid-template-columns: ${(props) =>
      props.$isSearching ? "1fr" : "240px 240px 1fr"};
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr !important;
    height: auto;
    gap: 10px;
    padding: 12px;
  }
`;

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  height: 100%;
`;

const DesktopPanel = styled(Panel)`
  @media (max-width: 768px) {
    display: none;
  }
`;

const PanelHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  background-color: #ffffff;
  flex-shrink: 0;

  h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 800;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const SelectGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

const GroupLabel = styled.label`
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
`;

const HistorySelectBox = styled.select`
  width: 100%;
  padding: 10px 12px;
  font-size: 13px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background-color: #fff;
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: #2563eb;
  }
  &:disabled {
    background: #e2e8f0;
    cursor: not-allowed;
  }
`;

const SubTitle = styled.div`
  font-size: 12px;
  color: #64748b;
  margin-top: 6px;
  strong {
    color: #2563eb;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 12px;
  box-sizing: border-box;
  outline: none;
  margin-top: 10px;

  &:focus {
    border-color: #2563eb;
  }
  &:disabled {
    background: #f1f5f9;
    cursor: not-allowed;
  }
`;

const PanelBody = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background-color: #f8fafc;
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  margin-bottom: 8px;
  background-color: ${(props) => (props.$isActive ? "#eff6ff" : "#ffffff")};
  border: 1px solid ${(props) => (props.$isActive ? "#bfdbfe" : "#e2e8f0")};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;

  .title {
    font-size: 13px;
    font-weight: ${(props) => (props.$isActive ? "700" : "500")};
    color: ${(props) => (props.$isActive ? "#1e40af" : "#334155")};
  }

  .arrow {
    color: #94a3b8;
    font-size: 12px;
  }

  &:hover {
    background-color: ${(props) => (props.$isActive ? "#eff6ff" : "#f1f5f9")};
    border-color: #bfdbfe;
  }
`;

const CountBadge = styled.span`
  margin-left: 6px;
  padding: 1px 6px;
  font-size: 10px;
  font-weight: 700;
  background-color: #e2e8f0;
  color: #475569;
  border-radius: 10px;
`;

const RecordInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const BadgeWrapper = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const MetaBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  font-size: 10px;
  font-weight: 700;
  border-radius: 4px;
  background-color: ${(props) => props.$bgColor};
  color: ${(props) => props.$color};
`;

const SerialNo = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  font-size: 11px;
  color: #64748b;

  .divider {
    margin: 0 6px;
    color: #e2e8f0;
  }
`;

const EmptyText = styled.p`
  text-align: center;
  color: #94a3b8;
  font-size: 12px;
  margin-top: 30px;
  line-height: 1.5;
`;

const MobileOnlyNotice = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
    font-size: 11px;
    color: #94a3b8;
    background: #f1f5f9;
    padding: 10px;
    border-radius: 6px;
    line-height: 1.4;
  }
`;

// 💡 기존 styled-components 파일 하단부에 덮어쓰거나 추가해 주세요.

export const RecordCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch; /* 버튼 높이를 카드 높이와 균형있게 동기화 */
  padding: 18px;
  margin-bottom: 12px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.02),
    0 2px 4px -1px rgba(0, 0, 0, 0.01);
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #cbd5e1;
  }
`;

// 컨텐츠와 우측 액션 버튼의 영역 분할축
const RecordMainContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const CardTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
`;

// 💡 [신설 배지] 오차 항목 알림 배지 스타일
const FailCountBadge = styled.span`
  background-color: #fef2f2;
  color: #dc2626;
  font-size: 11px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 6px;
  border: 1px solid #fee2e2;
`;

const SuccessCountBadge = styled.span`
  background-color: #f0fdf4;
  color: #16a34a;
  font-size: 11px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 6px;
  border: 1px solid #dcfce7;
`;

// 💡 [핵심] 수많은 정보를 2x2 메트릭스로 정갈하게 표현해주는 그리드
const MetaGridInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px 16px;
  background-color: #f8fafc;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 10px;

  .info-item {
    display: flex;
    font-size: 12px;
    line-height: 1.4;
  }

  .label {
    color: #64748b;
    font-weight: 600;
    width: 75px;
    flex-shrink: 0;
  }

  .value {
    color: #334155;
    font-weight: 700;
  }

  @media (max-width: 540px) {
    grid-template-columns: 1fr; /* 화면 좁아지면 무너지지 않게 한 줄 배열 */
    gap: 4px;
  }
`;

// 💡 [신설] 모달에서 입력했던 종합 멘트 디스플레이 영역
const CommentBlock = styled.div`
  background-color: #f1f5f9;
  border-left: 3px solid #cbd5e1;
  padding: 8px 12px;
  border-radius: 0 6px 6px 0;
  margin-top: 4px;

  .comment-title {
    font-size: 10px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    margin-bottom: 2px;
  }

  .comment-text {
    font-size: 12px;
    color: #475569;
    line-height: 1.4;
    white-space: pre-wrap; /* 줄바꿈 허용 */
  }
`;

export const ViewButton = styled.button`
  padding: 0 16px;
  font-size: 13px;
  font-weight: 700;
  color: #2563eb;
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  flex-shrink: 0;
  margin-left: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #ffffff;
    background-color: #2563eb;
    border-color: #2563eb;
    box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
  }
`;
