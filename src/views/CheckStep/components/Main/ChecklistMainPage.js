import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { theme } from "../../../../styles/theme";
import GlobalStyle from "../../../../styles/GlobalStyle";
import { useChecklist } from "../../../../hooks/useChecklist";
import ChecklistHeader from "./subComponents/ChecklistHeader";
import { PageContainer } from "../../Layout.styles";
import ChecklistSidebar from "./subComponents/ChecklistSidebar";
import ChecklistMain from "./subComponents/ChecklistMain";
import ReviewPage from "../ReviewPage/ReviewPage";
import { TempLoadModal } from "./Modal/TempLoadModal";
import Navbar from "../../../Navigation/Navbar";
import { FiGrid } from "react-icons/fi";

function ChecklistMainPage() {
  const {
    companies,
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
    categories,
    currentCatIndex,
    setCurrentCatIndex,
    answers,
    submissionId,
    viewMode,
    setViewMode,
    loading,
    lastSavedAnswersStr,
    handleAnswerChange,
    handleTempSave,
    handleFinalSave,
    tempSubmissions,
    handleRestoreTemp,
  } = useChecklist();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentCategory = categories[currentCatIndex];

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Navbar />

      {/* 1. 4단계 인프라 계층형 관제 탑바 */}
      <ChecklistHeader
        companies={companies}
        regions={regions}
        models={models}
        serials={serials}
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        selectedSerial={selectedSerial}
        setSelectedSerial={setSelectedSerial}
        handleTempSave={handleTempSave}
        tempCount={tempSubmissions.length}
        onOpenTempModal={() => setIsModalOpen(true)}
      />

      {/* 2. 상태 분기별 실시간 동적 대시보드 화면 연출 */}
      {loading && (
        <MessageAlertContainer>
          <div className="spinner-bar" />
          <p>해당 장비의 점검 항목 분석 중...</p>
        </MessageAlertContainer>
      )}

      {!loading && !selectedSerial && (
        <MessageAlertContainer>
          <FiGrid size={32} color="#94a3b8" style={{ marginBottom: "12px" }} />
          <p className="main-hint">
            상단 선택창에서 <b>고객사 ➔ 지역 ➔ 장비 모델 ➔ 시리얼</b>을
          </p>
          <p className="sub-hint">
            순서대로 정확히 지정해 주시면 동적 점검 항목이 나타납니다.
          </p>
        </MessageAlertContainer>
      )}

      {!loading &&
        selectedModel &&
        selectedSerial &&
        categories.length === 0 && (
          <MessageAlertContainer>
            <p className="warn-text">
              ⚠️ 지정하신 장비(S/N: {selectedSerial})에 매핑된 항목 점검표 가
              존재하지 않습니다.
            </p>
          </MessageAlertContainer>
        )}

      {/* 3. 문항 입력 모드(CHECK) 및 검토 모드(REVIEW) 가동 */}
      {!loading &&
        selectedModel &&
        selectedSerial &&
        categories.length > 0 &&
        (viewMode === "CHECK" ? (
          <PageContainer>
            <ChecklistSidebar
              categories={categories}
              currentCatIndex={currentCatIndex}
              setCurrentCatIndex={setCurrentCatIndex}
              answers={answers}
            />

            <ChecklistMain
              currentCategory={currentCategory}
              answers={answers}
              handleAnswerChange={handleAnswerChange}
              submissionId={submissionId}
              lastSavedAnswersStr={lastSavedAnswersStr}
              setCurrentCatIndex={setCurrentCatIndex}
              categories={categories}
              setViewMode={setViewMode}
              handleTempSave={handleTempSave}
            />
          </PageContainer>
        ) : (
          <ReviewPage
            categories={categories}
            answers={answers}
            onBack={() => setViewMode("CHECK")}
            onSave={handleFinalSave}
          />
        ))}

      {/* 4. 최하단 백업 레이어 임시저장 불러오기 가젯 */}
      <TempLoadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tempSubmissions={tempSubmissions}
        currentSubmissionId={submissionId}
        onRestore={handleRestoreTemp}
      />
    </ThemeProvider>
  );
}

/* -------------------------------------------------------------------------- */
/* 본체용 컴포넌트 스타일                          */
/* -------------------------------------------------------------------------- */

const MessageAlertContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 24px;
  text-align: center;
  background: #ffffff;
  margin: 16px;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;

  p {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    color: #475569;
  }
  .main-hint {
    font-size: 15px;
    color: #1e293b;
    font-weight: 600;
    b {
      color: #2563eb;
    }
  }
  .sub-hint {
    font-size: 13px;
    color: #64748b;
    margin-top: 4px;
  }
  .warn-text {
    color: #dc2626;
    font-weight: 700;
  }
`;

export default ChecklistMainPage;
