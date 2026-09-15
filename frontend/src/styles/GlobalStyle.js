import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    -webkit-text-size-adjust: 100%;
  }

  body {
    margin: 0;
    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 1rem;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.background};
  }

  h1, h2, h3, h4 {
    margin: 0 0 ${({ theme }) => theme.spacing.md};
    line-height: 1.25;
    color: ${({ theme }) => theme.colors.primaryDark};
  }

  p {
    margin: 0 0 ${({ theme }) => theme.spacing.md};
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  img {
    max-width: 100%;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
    color: inherit;
  }

  :focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.001ms !important;
      transition-duration: 0.001ms !important;
    }
  }
`;

export default GlobalStyle;
