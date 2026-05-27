import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
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

function ChecklistMainPage() {
  const {
    models,
    lines,
    selectedModel,
    setSelectedModel,
    selectedLine,
    setSelectedLine,
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
      <Navbar></Navbar>

      {/* 1. 상단 컨트롤러 헤더 */}
      <ChecklistHeader
        models={models}
        lines={lines}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        selectedLine={selectedLine}
        setSelectedLine={setSelectedLine}
        handleTempSave={handleTempSave}
        tempCount={tempSubmissions.length}
        onOpenTempModal={() => setIsModalOpen(true)}
      />

      {/* 2. 상태별 컨텐츠 스위칭 유저 인터페이스 */}
      {loading && (
        <div style={{ textAlign: "center", padding: "40px" }}>
          데이터를 구성하는 중입니다...
        </div>
      )}

      {!loading && !selectedModel && (
        <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
          상단에서 모델 번호와 공정 라인을 선택해 주세요.
        </div>
      )}

      {!loading && selectedModel && selectedLine && categories.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
          배정된 점검 정보가 존재하지 않습니다.
        </div>
      )}

      {!loading &&
        selectedModel &&
        selectedLine &&
        categories.length > 0 &&
        (viewMode === "CHECK" ? (
          <PageContainer>
            {/* 좌측 카테고리 사이드바 컴포넌트 */}
            <ChecklistSidebar
              categories={categories}
              currentCatIndex={currentCatIndex}
              setCurrentCatIndex={setCurrentCatIndex}
              answers={answers}
            />

            {/* 우측 실시간 문항지 컴포넌트 */}
            <ChecklistMain
              currentCategory={currentCategory}
              answers={answers}
              handleAnswerChange={handleAnswerChange}
              submissionId={submissionId}
              lastSavedAnswersStr={lastSavedAnswersStr}
              setCurrentCatIndex={setCurrentCatIndex}
              categories={categories}
              setViewMode={setViewMode}
            />
          </PageContainer>
        ) : (
          /* 3. 종합 최종 검토 페이지 */
          <ReviewPage
            categories={categories}
            answers={answers}
            onBack={() => setViewMode("CHECK")}
            onSave={handleFinalSave}
          />
        ))}

      {/* 🌟 5. 최하단에 임시저장 불러오기 모달 배치 */}
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

export default ChecklistMainPage;
