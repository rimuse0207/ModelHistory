import styled from "styled-components";
import { theme } from "../../../../styles/theme";

const mobileBreakpoint = theme.media?.sizes?.mobile || "768px";

export const ValuesDisplayGrid = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
  @media (max-width: ${mobileBreakpoint}) {
    width: 100%;
    justify-content: flex-start;
    margin-top: 8px;
  }
`;
export const MiniValueChip = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
  border-radius: 10px;
  padding: 10px 14px;
  min-width: 160px;
  border: 1px solid
    ${(p) => (p.$isError ? "#fca5a5" : p.$isMissing ? "#cbd5e1" : "#e2e8f0")};
  background-color: ${(p) =>
    p.$isError ? "#fef2f2" : p.$isMissing ? "#f8fafc" : "#ffffff"};
  transition: all 0.2s ease;
  &:hover {
    background-color: ${(p) => (p.$isError ? "#fee2e2" : "#f1f5f9")};
    transform: translateY(-1px);
  }
  .field-name {
    font-size: 11px;
    font-weight: 700;
    color: ${(p) => (p.$isError ? "#991b1b" : "#475569")};
    margin-bottom: 6px;
    border-bottom: 1px solid ${(p) => (p.$isError ? "#fee2e2" : "#e2e8f0")};
    padding-bottom: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .io-box {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 13px;
  }
  .sub-label {
    font-size: 9px;
    font-weight: 600;
    color: ${(p) => (p.$isError ? "#fca5a5" : "#94a3b8")};
    text-transform: uppercase;
  }
  .val {
    font-size: 14px;
    font-weight: 700;
  }
  @media (max-width: ${mobileBreakpoint}) {
    flex: 1;
    min-width: 140px;
  }
`;
export const ReviewContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px 100px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  @media (max-width: ${mobileBreakpoint}) {
    padding: 20px 16px 100px 16px;
  }
`;
export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
`;
export const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${(p) => p.theme.colors?.textMain || "#0f172a"};
`;
export const StatusAlert = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${(p) => (p.$isWarning ? "#fffbeb" : "#f0fdf4")};
  border: 1px solid ${(p) => (p.$isWarning ? "#fef3c7" : "#bbf7d0")};
  color: ${(p) => (p.$isWarning ? "#b45309" : "#166534")};
`;
export const AccordionCard = styled.div`
  background-color: ${(p) => p.theme.colors?.bgCard || "#ffffff"};
  border-radius: 14px;
  border: 1px solid ${(p) => p.theme.colors?.border || "#e2e8f0"};
  box-shadow: ${(p) => p.theme.boxShadow || "0 4px 6px -1px rgba(0,0,0,0.05)"};
  overflow: hidden;
  margin-bottom: 16px;
  &:last-child {
    margin-bottom: 0;
  }
`;
export const AccordionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  cursor: pointer;
  background-color: ${(p) => (p.$isOpen ? "#f8fafc" : "transparent")};
  transition: background-color 0.2s;
  &:hover {
    background-color: #f8fafc;
  }
`;
export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  font-size: 16px;
  color: #1e293b;
`;
export const AccordionContent = styled.div`
  padding: 0 24px 20px 24px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #ffffff;
`;
export const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 0;
  border-bottom: 1px solid #f8fafc;
  gap: 16px;
  &:last-child {
    border-bottom: none;
  }
  @media (max-width: ${mobileBreakpoint}) {
    flex-direction: column;
    gap: 8px;
  }
`;
export const FixedFooter = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${(p) => p.theme.colors?.bgCard || "#ffffff"};
  padding: 16px 24px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.06);
  border-top: 1px solid ${(p) => p.theme.colors?.border || "#e2e8f0"};
  z-index: 30;
`;
export const FooterContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 16px;
`;
export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.2s;
  cursor: pointer;
  background-color: ${(p) =>
    p.$primary ? p.theme.colors?.primary || "#3b82f6" : "transparent"};
  color: ${(p) =>
    p.$primary ? "#ffffff" : p.theme.colors?.textMain || "#0f172a"};
  border: ${(p) =>
    p.$primary ? "none" : `1px solid ${p.theme.colors?.border || "#e2e8f0"}`};
  &:hover {
    background-color: ${(p) =>
      p.$primary
        ? p.theme.colors?.primary
          ? p.theme.colors.primary + "dd"
          : "#2563eb"
        : "#f1f5f9"};
  }
`;
