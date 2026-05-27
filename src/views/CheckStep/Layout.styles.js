import styled from "styled-components";

// 전체 페이지 감싸는 컨테이너
export const PageContainer = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 1200px;
  margin: 0 auto;
  gap: 32px;
  padding: 40px 20px;
  min-height: 100vh;

  ${({ theme }) => theme.media.mobile`
    flex-direction: column;
    padding: 0 0 80px 0; /* 모바일 하단 플로팅 바 공간 확보 */
    gap: 0;
  `}
`;

// 내비게이션 사이드바 (모바일에서는 상단 스티키 탭)
export const NavSidebar = styled.aside`
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${({ theme }) => theme.media.mobile`
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 10;
    flex-direction: row;
    overflow-x: auto; /* 가로 스크롤 허용 */
    background-color: ${({ theme }) => theme.colors.bgMain};
    padding: 12px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    gap: 12px;
    
    /* 스크롤바 숨기기 (깔끔한 UI용) */
    &::-webkit-scrollbar { display: none; }
    -ms-overflow-style: none;
    scrollbar-width: none;
  `}
`;

// 내비게이션 아이템 버튼
export const NavItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-radius: 10px;
  width: 100%;
  text-align: left;
  font-size: 15px;
  transition: all 0.2s ease;
  background-color: ${(props) =>
    props.$active
      ? props.theme.colors.primaryLight
      : props.theme.colors.bgCard};
  color: ${(props) =>
    props.$active ? props.theme.colors.primary : props.theme.colors.textMain};
  border: 1px solid
    ${(props) => (props.$active ? props.theme.colors.primary : "transparent")};
  font-weight: ${(props) => (props.$active ? "600" : "400")};
  box-shadow: ${(props) => props.theme.boxShadow};

  &:hover {
    background-color: ${(props) =>
      props.$active ? props.theme.colors.primaryLight : "#f1f5f9"};
  }

  ${({ theme }) => theme.media.mobile`
    width: auto;
    flex-shrink: 0;
    padding: 8px 16px;
    font-size: 14px;
    border-radius: 20px; /* 모바일은 둥근 캡슐 형태로 변화 */
  `}
`;

// 메인 컨텐츠 영역
export const ContentArea = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;

  ${({ theme }) => theme.media.mobile`
    padding: 20px 16px;
  `}
`;
