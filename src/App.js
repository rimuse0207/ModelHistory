import React from "react";
import RouterMainPage from "./Router/RouterMainPage";
import Loader from "./utils/Loader/Loader";
import { useSelector } from "react-redux";

function App() {
  const Loading = useSelector(
    (state) => state.Now_Loader_Info_State.Loader_Info.Loader,
  );
  return (
    <>
      <RouterMainPage></RouterMainPage>
      {/* 로딩 컴포넌트 시작 */}
      <Loader loading={Loading}></Loader>

      {/* 로딩 컴포넌트 끝 */}
    </>
  );
}

export default App;
