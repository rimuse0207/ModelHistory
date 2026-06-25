import moment from "moment";
import React from "react";
import { FiClock, FiCheckCircle, FiFileText, FiX } from "react-icons/fi";
import styled from "styled-components";

export function TempLoadModal({
  isOpen,
  onClose,
  tempSubmissions = [],
  currentSubmissionId,
  onRestore,
}) {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      {/* 모달 내부 클릭 시 닫힘 방지 */}
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        {/* 헤더 영역 */}
        <ModalHeader>
          <HeaderTitle>
            <FiFileText size={20} color="#2563eb" />
            <span>임시저장 이력 불러오기</span>
          </HeaderTitle>
          <CloseButton onClick={onClose}>
            <FiX size={20} />
          </CloseButton>
        </ModalHeader>

        {/* 본문 영역 */}
        <ModalBody>
          <NoticeText>
            현재 선택된 모델에 누적된 임시저장 목록입니다. 복구할 기록을 선택해
            주세요.
            <br />
            <span className="warning">
              ※ 불러오기 시 현재 작성 중이던 기존 입력값은 덮어씌워집니다.
            </span>
          </NoticeText>

          <HistoryList>
            {tempSubmissions.length === 0 ? (
              <EmptyState>
                <FiFileText size={40} color="#cbd5e1" />
                <p>보관된 임시저장 내역이 없습니다.</p>
              </EmptyState>
            ) : (
              tempSubmissions.map((item) => {
                const isEditing = currentSubmissionId === item.submissionId;
                // 진행률 계산 (서버에서 주기적으로 가공해준다는 가정 하에 안전 코드 처리)
                const progress = item.progressPercent || 0;

                return (
                  <HistoryItem
                    key={item.submissionId}
                    $isActive={isEditing}
                    onClick={() => {
                      onRestore(item);
                      onClose(); // 복구 후 모달 자동 닫기
                    }}
                  >
                    <ItemMainInfo>
                      <TimeBadge>
                        <FiClock size={13} />
                        <span>
                          {moment(item.updatedAt).format("YY.MM.DD (dd)") ||
                            "시간 정보 없음"}
                        </span>
                      </TimeBadge>

                      <SummaryText>
                        {item.inputSummary || "현장 점검 진행 중..."}
                      </SummaryText>

                      <MetaDataRow>
                        <span>작성자: {item.writerName || "관리자"}</span>
                        <span className="divider">|</span>
                        <span>입력 항목: {item.filledCount || 0}개 채움</span>
                      </MetaDataRow>
                    </ItemMainInfo>

                    <ItemStatusArea>
                      {isEditing ? (
                        <ActiveStatusTag>
                          <FiCheckCircle size={12} />
                          <span>편집 중</span>
                        </ActiveStatusTag>
                      ) : (
                        <ProgressWrapper>
                          <ProgressText>{progress}%</ProgressText>
                          <ProgressBarContainer>
                            <ProgressBar $width={progress} />
                          </ProgressBarContainer>
                        </ProgressWrapper>
                      )}
                    </ItemStatusArea>
                  </HistoryItem>
                );
              })
            )}
          </HistoryList>
        </ModalBody>

        {/* 푸터 영역 */}
        <ModalFooter>
          <CancelButton onClick={onClose}>닫기</CancelButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
}

// --- Styled Components (디자인 시스템 가이드라인 반영) ---

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalContainer = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 580px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  max-height: 85vh;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 18px 24px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;
  &:hover {
    background-color: #f1f5f9;
    color: #475569;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const NoticeText = styled.p`
  font-size: 14px;
  color: #475569;
  line-height: 1.5;
  .warning {
    font-size: 12px;
    color: #dc2626;
    font-weight: 500;
    margin-top: 4px;
    display: inline-block;
  }
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
`;

const EmptyState = styled.div`
  padding: 40px 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #94a3b8;
  font-size: 14px;
`;

const HistoryItem = styled.div`
  border: 1px solid ${(props) => (props.$isActive ? "#bfdbfe" : "#e2e8f0")};
  background-color: ${(props) => (props.$isActive ? "#eff6ff" : "#ffffff")};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    background-color: ${(props) => (props.$isActive ? "#eff6ff" : "#f8fafc")};
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }
`;

const ItemMainInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

const TimeBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
`;

const SummaryText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
`;

const MetaDataRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #94a3b8;
  .divider {
    color: #e2e8f0;
  }
`;

const ItemStatusArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 90px;
`;

const ActiveStatusTag = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: #2563eb;
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
`;

const ProgressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  width: 100%;
`;

const ProgressText = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #475569;
`;

const ProgressBarContainer = styled.div`
  width: 70px;
  height: 5px;
  background-color: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${(props) => props.$width}%;
  background-color: #10b981;
  border-radius: 10px;
`;

const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
  background-color: #f8fafc;
`;

const CancelButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #cbd5e1;
  background-color: #ffffff;
  color: #475569;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    background-color: #f1f5f9;
    color: #1e293b;
  }
`;
