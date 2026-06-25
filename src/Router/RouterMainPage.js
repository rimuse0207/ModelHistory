import React, { useState } from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import LoginMainPage from "../views/Login/LoginMainPage";
import LoginRoute from "./LoginRoute/LoginRouteMainPage";
import { useSelector } from "react-redux";
import ChecklistHistoryPage from "../views/CheckStep/components/Result/HistoryPages/ChecklistHistoryPage";
import ChecklistHistoryDetail from "../views/CheckStep/components/Result/Detail/ChecklistHistoryDetail";
import ChecklistMainPage from "../views/CheckStep/components/Main/ChecklistMainPage";
import ChecklistBuilder from "../views/CheckStep/components/Create/ChecklistBuilder";
import NoMobile from "./NoMobile";

import { isMobile } from "react-device-detect";

const RouterMainPage = () => {
  const User_Info = useSelector(
    (state) => state.Login_Info_Reducer_State.Login_Info,
  );

  const [RouterInfo, setRouterInfo] = useState([
    {
      path: "/",
      element: <LoginMainPage />,
      withAuthorization: false,
      withAdminAuthorization: false,
    },
    {
      path: "/Home",
      element: <ChecklistHistoryPage />,
      withAuthorization: true,
      withAdminAuthorization: false,
    },
    {
      path: "/write",
      element: <ChecklistMainPage />,
      withAuthorization: true,
      withAdminAuthorization: false,
    },
    {
      path: "/create",
      element: <ChecklistBuilder />,
      withAuthorization: true,
      withAdminAuthorization: true,
      desktopOnly: true,
      authCode: "ModelCheck",
    },
    {
      path: "/history/detail/:submissionId",
      element: <ChecklistHistoryDetail />,
      withAuthorization: true,
      withAdminAuthorization: false,
    },
    {
      path: "/DenyMobile",
      element: <NoMobile />,
      withAuthorization: false,
      withAdminAuthorization: false,
    },
    {
      path: "*",
      element: <Navigate to="/Home" />,
      withAuthorization: true,
      withAdminAuthorization: false,
    },
  ]);

  return (
    <BrowserRouter>
      <Routes>
        {RouterInfo.map((route) => {
          const elementToRender =
            route.desktopOnly && isMobile ? (
              <Navigate to="/DenyMobile" replace />
            ) : (
              route.element
            );

          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                <LoginRoute
                  withAdminAuthorization={route.withAdminAuthorization}
                  withAuthorization={route.withAuthorization}
                  component={elementToRender}
                  authCode={route.authCode}
                  User_Info={User_Info}
                />
              }
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
};

export default RouterMainPage;
