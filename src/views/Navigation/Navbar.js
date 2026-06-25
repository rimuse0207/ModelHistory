import React, { useState } from "react";
import styled from "styled-components";
import { NavLink as RouterNavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const LoginInfo = useSelector(
    (state) => state.Login_Info_Reducer_State.Login_Info,
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <NavContainer>
      <NavLogo to="/">Model Check System</NavLogo>

      <NavLinks $isOpen={isMobileMenuOpen}>
        <StyledNavLink to="/Home" onClick={handleMenuClick}>
          이력 조회
        </StyledNavLink>

        <StyledNavLink to="/Write" onClick={handleMenuClick}>
          이력 작성
        </StyledNavLink>
        {LoginInfo?.team === "IT팀" ||
        LoginInfo?.position === "PL" ||
        LoginInfo?.team === "TL" ||
        LoginInfo?.team === "팀장" ||
        LoginInfo?.team === "이사" ||
        LoginInfo?.team === "상무" ? (
          <StyledNavLink to="/Create" onClick={handleMenuClick}>
            점검 항목 생성
          </StyledNavLink>
        ) : (
          <></>
        )}
      </NavLinks>

      <MenuToggleButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        <span className={isMobileMenuOpen ? "open" : ""} />
        <span className={isMobileMenuOpen ? "open" : ""} />
        <span className={isMobileMenuOpen ? "open" : ""} />
      </MenuToggleButton>
    </NavContainer>
  );
};

export default Navbar;

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 30px;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  position: sticky;
  top: 0;
  z-index: 1000;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const NavLogo = styled(RouterNavLink)`
  font-size: 20px;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.5px;
  text-decoration: none;
  cursor: pointer;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;

  @media (max-width: 768px) {
    display: ${(props) => (props.$isOpen ? "flex" : "none")};
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    background-color: #ffffff;
    border-bottom: 1px solid #e2e8f0;
    padding: 20px 0;
    gap: 16px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  }
`;

const StyledNavLink = styled(RouterNavLink)`
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    color: #3b82f6;
    background-color: #f1f5f9;
  }

  &.active {
    color: #3b82f6;
    background-color: #eff6ff;
  }

  @media (max-width: 768px) {
    width: 85%;
    text-align: center;
    padding: 12px 0;
    font-size: 15px;
  }
`;

const MenuToggleButton = styled.button`
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 22px;
  height: 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  outline: none;

  span {
    width: 100%;
    height: 2px;
    background-color: #334155;
    border-radius: 2px;
    transition: all 0.3s ease;
    transform-origin: left;

    &.open:nth-child(1) {
      transform: rotate(45deg);
    }
    &.open:nth-child(2) {
      opacity: 0;
    }
    &.open:nth-child(3) {
      transform: rotate(-45deg);
    }
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;
