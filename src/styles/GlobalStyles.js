import { Global, css } from '@emotion/react';

const GlobalStyles = ({ theme }) => (
  <Global
    styles={css`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: ${theme.typography.fontFamily};
        background-color: ${theme.colors.background};
        color: ${theme.colors.text};
        transition: all ${theme.transitions.default};
        line-height: 1.6;
      }

      button, input, textarea, select {
        font-family: inherit;
      }

      h1, h2, h3, h4, h5, h6 {
        font-weight: 600;
        margin-bottom: ${theme.spacing.medium};
      }
      
      a {
        color: ${theme.colors.primary};
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    `}
  />
);

export default GlobalStyles;
