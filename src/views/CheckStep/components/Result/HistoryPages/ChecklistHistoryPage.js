import React from "react";
import styled from "styled-components";
import { useChecklistHistory } from "../../../../../hooks/useCheckHistory";
import ChecklistHistoryDetail from "../Detail/ChecklistHistoryDetail";
import Navbar from "../../../../Navigation/Navbar";

const ChecklistHistoryPage = () => {
  const {
    models,
    lines,
    records,
    selectedModel,
    setSelectedModel,
    selectedLine,
    setSelectedLine,
    modelSearchTerm,
    setModelSearchTerm,
  } = useChecklistHistory();

  const handleViewDetail = (submissionId) => {
    const popupUrl = `/history/detail/${submissionId}`;
    window.open(
      popupUrl,
      `ChecklistDetail_${submissionId}`,
      "width=1100,height=850,scrollbars=yes,resizable=yes",
    );
  };

  return (
    <PageWrapper>
      <Navbar />

      <HistoryContainer>
        {/* 1 패널: 모델 선택 */}
        <Panel $isActive={true}>
          <PanelHeader>
            <h3>모델 선택</h3>
            <SearchInput
              type="text"
              placeholder="모델명 검색..."
              value={modelSearchTerm}
              onChange={(e) => setModelSearchTerm(e.target.value)}
            />
          </PanelHeader>
          <PanelBody>
            {models.length > 0 ? (
              models.map((m) => {
                const isModelActive = selectedModel === m.model_no;
                return (
                  <React.Fragment key={m.model_no}>
                    <ListItem
                      $isActive={isModelActive}
                      onClick={() => {
                        setSelectedModel(isModelActive ? null : m.model_no);
                      }}
                    >
                      <span className="title">{m.label || m.model_no}</span>
                      <span className="arrow">{isModelActive ? "↓" : "→"}</span>
                    </ListItem>

                    {/* 📱 모바일용 인라인 2 패널 */}
                    <MobileInlineContent $isOpen={isModelActive}>
                      <MobileSectionTitle>
                        {m.model_no}의 시리얼 넘버
                      </MobileSectionTitle>
                      {lines.length > 0 ? (
                        lines.map((l) => {
                          const isLineActive = selectedLine === l.line_no;
                          return (
                            <React.Fragment key={l.line_no}>
                              <InlineListItem
                                $isActive={isLineActive}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedLine(
                                    isLineActive ? null : l.line_no,
                                  );
                                }}
                              >
                                <div>
                                  <span className="title">
                                    {l.line_name || `Line ${l.line_no}`}
                                  </span>
                                  <CountBadge>
                                    {l.recordCount || 0}건
                                  </CountBadge>
                                </div>
                                <span className="arrow">
                                  {isLineActive ? "↓" : "→"}
                                </span>
                              </InlineListItem>

                              {/* 📱 모바일용 인라인 3 패널 */}
                              <MobileInlineContent $isOpen={isLineActive}>
                                <MobileSectionTitle
                                  style={{ background: "#f1f5f9" }}
                                >
                                  Line {l.line_no} 데이터 목록
                                </MobileSectionTitle>
                                <div style={{ padding: "4px" }}>
                                  {records.length > 0 ? (
                                    records.map((r) => (
                                      <RecordCard key={r.submissionId}>
                                        <RecordInfo>
                                          <SerialNo>
                                            SN: {r.serialNo || "미기입"}
                                          </SerialNo>
                                          <MetaInfo>
                                            <span>작성자: {r.writerName}</span>
                                            <span className="divider">|</span>
                                            <span className="date">
                                              {new Date(
                                                r.completedAt,
                                              ).toLocaleDateString()}
                                            </span>
                                          </MetaInfo>
                                        </RecordInfo>
                                        <ViewButton
                                          onClick={() =>
                                            handleViewDetail(r.submissionId)
                                          }
                                        >
                                          보기
                                        </ViewButton>
                                      </RecordCard>
                                    ))
                                  ) : (
                                    <EmptyText style={{ margin: "20px 0" }}>
                                      등록된 데이터가 없습니다.
                                    </EmptyText>
                                  )}
                                </div>
                              </MobileInlineContent>
                            </React.Fragment>
                          );
                        })
                      ) : (
                        <EmptyText style={{ margin: "20px 0" }}>
                          등록된 라인이 없습니다.
                        </EmptyText>
                      )}
                    </MobileInlineContent>
                  </React.Fragment>
                );
              })
            ) : (
              <EmptyText>등록된 모델이 없습니다.</EmptyText>
            )}
          </PanelBody>
        </Panel>

        {/* 데스크톱 전용 2 패널: 공정 라인 선택 */}
        <DesktopPanel>
          <PanelHeader>
            <h3>시리얼 넘버 선택</h3>
            {selectedModel && (
              <SubTitle>
                선택된 모델: <strong>{selectedModel}</strong>
              </SubTitle>
            )}
          </PanelHeader>
          <PanelBody>
            {selectedModel ? (
              lines.length > 0 ? (
                lines.map((l) => (
                  <ListItem
                    key={l.line_no}
                    $isActive={selectedLine === l.line_no}
                    onClick={() => setSelectedLine(l.line_no)}
                  >
                    <div>
                      <span className="title">
                        {l.line_name || `Line ${l.line_no}`}
                      </span>
                      <CountBadge>{l.recordCount || 0}건</CountBadge>
                    </div>
                    <span className="arrow">→</span>
                  </ListItem>
                ))
              ) : (
                <EmptyText>이 모델에 등록된 라인이 없습니다.</EmptyText>
              )
            ) : (
              <EmptyText>먼저 왼쪽에서 모델을 선택해 주세요.</EmptyText>
            )}
          </PanelBody>
        </DesktopPanel>

        {/* 💻 데스크톱 전용 3 패널: 최종 완료 데이터 리스트 */}
        <DesktopPanel $flex={1.5}>
          <PanelHeader>
            <h3>등록 데이터 리스트</h3>
            {selectedLine && (
              <SubTitle>
                S/N: <strong>{selectedLine}</strong>
              </SubTitle>
            )}
          </PanelHeader>
          <PanelBody>
            {selectedLine ? (
              records.length > 0 ? (
                records.map((r) => (
                  <RecordCard key={r.submissionId}>
                    <RecordInfo>
                      <SerialNo>SN: {r.serialNo || "미기입"}</SerialNo>
                      <MetaInfo>
                        <span>작성자: {r.writerName}</span>
                        <span className="divider">|</span>
                        <span>{new Date(r.completedAt).toLocaleString()}</span>
                      </MetaInfo>
                    </RecordInfo>
                    <ViewButton
                      onClick={() => handleViewDetail(r.submissionId)}
                    >
                      상세보기
                    </ViewButton>
                  </RecordCard>
                ))
              ) : (
                <EmptyText>등록된 데이터가 존재하지 않습니다.</EmptyText>
              )
            ) : (
              <EmptyText>라인을 선택하시면 데이터 내역이 표시됩니다.</EmptyText>
            )}
          </PanelBody>
        </DesktopPanel>
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
  background-color: #fafafa;
`;

const HistoryContainer = styled.div`
  display: flex;
  gap: 20px;
  height: calc(100vh - 60px);
  padding: 20px;
  box-sizing: border-box;
  background-color: #fafafa;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    gap: 10px;
    padding: 12px;
  }
`;

const Panel = styled.div`
  flex: ${(props) => props.$flex || 1};
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    border-color: #cbd5e1;
  }

  @media (max-width: 768px) {
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  }
`;

const DesktopPanel = styled(Panel)`
  @media (max-width: 768px) {
    display: none;
  }
`;

const PanelHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #f1f5f9;
  background-color: #ffffff;

  h3 {
    margin: 0 0 10px 0;
    font-size: 16px;
    font-weight: 700;
    color: #1e293b;
  }

  @media (max-width: 768px) {
    padding: 14px;
    h3 {
      font-size: 15px;
      margin-bottom: 8px;
    }
  }
`;

const SubTitle = styled.div`
  font-size: 13px;
  color: #64748b;
  strong {
    color: #3b82f6;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 13px;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 14px;
  }
`;

const PanelBody = styled.div`
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  background-color: #f8fafc;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    padding: 8px;
    overflow-y: visible;
  }
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  margin-bottom: 8px;
  background-color: ${(props) => (props.$isActive ? "#edf2f7" : "#ffffff")};
  border: 1px solid ${(props) => (props.$isActive ? "#cbd5e0" : "#e2e8f0")};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  .title {
    font-size: 14px;
    font-weight: ${(props) => (props.$isActive ? "600" : "500")};
    color: ${(props) => (props.$isActive ? "#1a202c" : "#4a5568")};
  }

  .arrow {
    color: #a0aec0;
    font-size: 14px;
    transition: all 0.2s ease;

    @media (max-width: 768px) {
      color: #64748b;
    }
  }

  &:hover {
    background-color: ${(props) => (props.$isActive ? "#edf2f7" : "#f7fafc")};
    border-color: #cbd5e0;
  }

  @media (max-width: 768px) {
    padding: 12px 14px;
    margin-bottom: 4px;
  }
`;

const MobileInlineContent = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${(props) => (props.$isOpen ? "block" : "none")};
    padding: 4px 0 12px 10px;
    border-left: 2px dashed #cbd5e1;
    margin-left: 10px;
    margin-bottom: 8px;
  }
`;

const MobileSectionTitle = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  padding: 6px 8px;
  margin-bottom: 6px;
  background: #e2e8f0;
  border-radius: 4px;
  display: inline-block;
`;

const InlineListItem = styled(ListItem)`
  background-color: ${(props) => (props.$isActive ? "#e8f5e9" : "#ffffff")};
  border-color: ${(props) => (props.$isActive ? "#a5d6a7" : "#e2e8f0")};
  padding: 10px 12px;

  .title {
    font-size: 13px;
    color: ${(props) => (props.$isActive ? "#1b5e20" : "#475569")};
  }
`;

const CountBadge = styled.span`
  margin-left: 8px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  background-color: #cbd5e1;
  color: #334155;
  border-radius: 12px;
`;

const RecordCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  margin-bottom: 10px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);

  @media (max-width: 768px) {
    padding: 10px;
    margin-bottom: 6px;
    border-radius: 6px;
  }
`;

const RecordInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  @media (max-width: 768px) {
    gap: 3px;
  }
`;

const SerialNo = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #64748b;

  .divider {
    margin: 0 8px;
    color: #e2e8f0;
  }

  @media (max-width: 768px) {
    font-size: 11px;
    flex-wrap: wrap;
    .divider {
      margin: 0 4px;
    }
  }
`;

const ViewButton = styled.button`
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #3b82f6;
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: #ffffff;
    background-color: #3b82f6;
    border-color: #3b82f6;
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 12px;
  }
`;

const EmptyText = styled.p`
  text-align: center;
  color: #94a3b8;
  font-size: 13px;
  margin-top: 40px;
  @media (max-width: 768px) {
    margin-top: 15px;
    font-size: 12px;
  }
`;
