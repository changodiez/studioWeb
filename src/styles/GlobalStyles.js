import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    background-color: #0a0a0a;
    color: #ffffff;
    overflow-x: hidden;
    line-height: 1.6;
    font-weight: 300;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 300;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
  }

  img, video {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Scrollbar minimalista */
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: #0a0a0a;
  }

  ::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #444;
  }

  /* Selection */
  ::selection {
    background: #333;
    color: #fff;
  }
`;
