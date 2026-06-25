import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  request,
  Request_Get_Axios,
  Request_Post_Axios,
} from "../../API/index";
import { useDispatch, useSelector } from "react-redux";
import { Login_Info_Apply_State_Func } from "../../Models/LoginInfoReducer/LoginInfoReduce";
import { Now_Path_Initial_Reducer_State_Func } from "../../Models/NowPathReducer/NowPathReduce";
import { toast } from "../../utils/ToastMessage/ToastManager";
import LoginContent from "./Contents/LoginContent";
import { useNavigate } from "react-router-dom";

const LoginMainPageDivBox = styled.div`
  .page-container {
    width: 100vw;
    height: 100vh;
    background-color: #f8fafc;
    background-image:
      radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.06) 0px, transparent 50%),
      radial-gradient(
        at 100% 100%,
        rgba(219, 39, 119, 0.04) 0px,
        transparent 50%
      );
    display: flex;
    justify-content: center;
    align-items: center;
    font-family:
      "Pretendard",
      -apple-system,
      system-ui,
      sans-serif;
    padding: 20px;
    box-sizing: border-box;

    @media (max-width: 480px) {
      padding: 0;
      background: #ffffff;
    }
  }

  .login-form-container {
    background: #ffffff;
    width: 100%;
    max-width: 420px;
    padding: 56px 36px 40px 36px;
    box-sizing: border-box;
    border-radius: 24px;
    border: 1px solid rgba(226, 232, 240, 0.8);
    box-shadow:
      0 20px 25px -5px rgba(148, 163, 184, 0.15),
      0 10px 10px -5px rgba(148, 163, 184, 0.08);
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    @media (max-width: 480px) {
      border-radius: 0;
      border: none;
      box-shadow: none;
      height: 100%;
      justify-content: center;
      padding: 40px 24px;
    }
  }

  .brand-header {
    text-align: center;
    margin-bottom: 36px;
    width: 100%;
  }

  .live-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #eff6ff;
    color: #2563eb;
    font-size: 11px;
    font-weight: 700;
    padding: 6px 12px;
    border-radius: 30px;
    margin-bottom: 16px;
    letter-spacing: 0.5px;
    border: 1px solid rgba(37, 99, 235, 0.1);

    .pulse-dot {
      width: 6px;
      height: 6px;
      background: #2563eb;
      border-radius: 50%;
      box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.5);
      animation: pulse 1.6s infinite;
    }
  }

  .brand-header h1 {
    color: #0f172a;
    font-size: 25px;
    font-weight: 800;
    margin: 0 0 6px 0;
    letter-spacing: -0.7px;
    line-height: 1.3;

    span {
      background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .brand-header p {
    color: #64748b;
    font-size: 14px;
    font-weight: 500;
    margin: 0;
  }

  .login-form-left-side {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .login-top-wrap {
    display: none;
  }

  .login-input-container {
    width: 100%;
  }

  .login-input-container .login-input-wrap {
    width: 100%;
    height: 52px;
    margin-top: 12px;
    border-radius: 12px;
    border: 1px solid #cbd5e1;
    background: #f8fafc;
    display: flex;
    align-items: center;
    padding: 0 16px;
    box-sizing: border-box;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &:focus-within {
      border-color: #2563eb;
      background: #ffffff;
      box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
    }
  }

  .login-input-container .login-input-wrap i {
    color: #475569;
    font-size: 16px;
    display: flex;
    align-items: center;
  }

  .login-input-container .login-input-wrap input {
    background: none;
    border: none;
    height: 100%;
    font-size: 15px;
    font-weight: 600;
    color: #0f172a;
    padding-left: 10px;
    flex: 1;

    &::placeholder {
      color: #94a3b8;
    }
    &:focus {
      outline: none;
    }
  }

  .login-btn-wrap {
    margin-top: 32px;
    width: 100%;
  }

  .login-btn-wrap .login-btn {
    width: 100%;
    height: 52px;
    color: #ffffff;
    border: 0;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
    transition: all 0.2s ease;

    &:hover {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);
    }
    &:active {
      transform: scale(0.985);
    }
  }

  .login-btn-wrap a {
    margin-top: 20px;
    text-decoration: none;
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    text-align: center;
    display: block;
    transition: color 0.15s;

    &:hover {
      color: #0f172a;
    }
  }

  .system-footer {
    margin-top: auto;
    padding-top: 48px;
    font-size: 11px;
    font-weight: 700;
    color: #cbd5e1;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.5);
    }
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 6px rgba(37, 99, 235, 0);
    }
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);
    }
  }
`;

const LoginMainPage = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  const NowPath = useSelector(
    (state) => state.Now_Path_Reducer_State.Path_Info,
  );

  const [LoginDataInfo, setLoginDataInfo] = useState({
    email: localStorage.getItem("userId") ? localStorage.getItem("userId") : "",
    password: "",
  });

  useEffect(() => {
    before_Login_Checkig();
  }, []);

  const before_Login_Checkig = async () => {
    try {
      const Login_Checking = await Request_Get_Axios(
        "/Login/Login_Token_Check",
      );

      if (Login_Checking.status) {
        Navigate("/Home");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClicksLogin = async (e) => {
    e.preventDefault();
    const before_path = NowPath.path;

    if (LoginDataInfo.email === "" || LoginDataInfo.password === "") {
      toast.show({
        title: `ID 또는 패스워드를 확인 해 주세요.`,
        successCheck: false,
        duration: 3000,
      });
      return;
    }

    const Login_Check = await Request_Post_Axios("/Login/LoginChecking", {
      LoginInfoData: { ID: LoginDataInfo.email, PW: LoginDataInfo.password },
    });

    if (!Login_Check.status) {
      alert("서버와의 연결이 끊어졌습니다.");
      return;
    }

    if (!Login_Check.data.dataSuccess) {
      alert("아이디 또는 비밀번호가 틀립니다.");
      setLoginDataInfo({ ...LoginDataInfo, password: "" });
      return;
    }

    if (Login_Check.data.dataSuccess) {
      localStorage.setItem("Token", Login_Check.data.token);
      localStorage.setItem("userId", LoginDataInfo.email);

      dispatch(
        Login_Info_Apply_State_Func({
          id: LoginDataInfo.email,
          position: Login_Check.data.result[0].gradeName,
          team: Login_Check.data.result[0].team,
          name: Login_Check.data.result[0].fullName,
          access: Login_Check.data.result || [],
        }),
      );
      dispatch(Now_Path_Initial_Reducer_State_Func());

      return Navigate(before_path ? before_path : "/Home");
    } else {
      setLoginDataInfo({
        ...LoginDataInfo,
        password: "",
      });
      alert("아이디 또는 비밀번호가 틀립니다.");
      return;
    }
  };

  return (
    <div>
      <LoginMainPageDivBox>
        <div className="page-container">
          <div className="login-form-container">
            <div className="brand-header">
              <div className="live-status-badge">
                <div className="pulse-dot" />
                <span>MODEL CHECK SYSTEM</span>
              </div>
              <h1>
                디에이치케이솔루션<span></span>
              </h1>
              <p>장비 점검 이력 관리 시스템</p>
            </div>

            <div className="login-form-left-side">
              <LoginContent
                LoginDataInfo={LoginDataInfo}
                setLoginDataInfo={(data) => setLoginDataInfo(data)}
                handleClicksLogin={(data) => handleClicksLogin(data)}
              />
            </div>

            <div className="system-footer">디에이치케이솔루션(주)</div>
          </div>
        </div>
      </LoginMainPageDivBox>
    </div>
  );
};

export default LoginMainPage;
