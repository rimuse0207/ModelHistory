import React from "react";
import ChecklistMainPage from "./views/CheckStep/components/Main/ChecklistMainPage";
import { Route, Routes } from "react-router-dom";
import ChecklistHistoryPage from "./views/CheckStep/components/Result/HistoryPages/ChecklistHistoryPage";
import ChecklistHistoryDetail from "./views/CheckStep/components/Result/Detail/ChecklistHistoryDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ChecklistHistoryPage />} />
      <Route
        path="/history/detail/:submissionId"
        element={<ChecklistHistoryDetail></ChecklistHistoryDetail>}
      />
      <Route path="/write" element={<ChecklistMainPage></ChecklistMainPage>} />
    </Routes>
  );
}

export default App;
