import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: 14px;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    box-sizing: border-box;

    *, *::before, *::after {
      box-sizing: inherit;
    }
  }
`;

export default GlobalStyle;
