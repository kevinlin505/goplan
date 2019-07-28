import styled, { css } from 'styled-components';
import { Button } from '@material-ui/core';
import ButtonStyles from '@constants/ButtonStyles';

export default styled(Button)`
  ${({ buttonstyle, color, theme }) => {
    switch (buttonstyle) {
      case ButtonStyles.BORDERED: {
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          border: 1px solid ${theme.colors.primary};

          &:active,
          &:focus,
          &:hover {
            color: ${theme.colors.primaryDark};
            border: 1px solid ${theme.colors.primaryDark};
          }
        `;
      }

      case ButtonStyles.FILL: {
        return css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.white};
          border: 1px solid ${theme.colors.primary};

          &:active,
          &:focus,
          &:hover {
            background-color: ${theme.colors.primaryDark};
            border: 1px solid ${theme.colors.primaryDark};
          }
        `;
      }

      case ButtonStyles.TEXT: {
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          border: none;

          &:active,
          &:focus,
          &:hover {
            background-color: transparent;
            color: ${theme.colors.primaryDark};
            border: none;
          }
        `;
      }

      default: {
        return css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.white};
          border: 1px solid ${theme.colors.primary};

          &:active,
          &:focus,
          &:hover {
            background-color: ${theme.colors.primaryDark};
            border: 1px solid ${theme.colors.primaryDark};
          }
        `;
      }
    }
  }}
`;
