import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background-color: ${({ theme }) => theme.colors.bgMain};
    color: ${({ theme }) => theme.colors.textMain};
    -webkit-font-smoothing: antialiased;
  }
  button {
    border: none;
    background: none;
    cursor: pointer;
  }
`;

export default GlobalStyle;
