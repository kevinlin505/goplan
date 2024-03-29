import styled, { css } from 'styled-components';
import ButtonStyles from '@constants/ButtonStyles';

export default styled.button`
  position: relative;
  padding: 10px 20px;
  font-size: 16px;
  text-transform: capitalize;
  line-height: 1.1;
  border-radius: 4px;
  cursor: pointer;

  &:active,
  &:focus,
  &:hover {
    border: none;
    outline: none;
  }

  &:active,
  &:focus {
    &::after {
      content: '';
      display: block;
      position: absolute;
      top: 2px;
      left: 2px;
      right: 2px;
      bottom: 2px;
      border-radius: 4px;
      pointer-events: none;
      z-index: 1;
    }
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.textLight};
    background-color: ${({ theme }) => theme.colors.contrastLight};
    border-color: ${({ theme }) => theme.colors.contrastLight};
    opacity: 0.8;
    cursor: default;

    &:active,
    &:focus,
    &:hover {
      color: ${({ theme }) => theme.colors.textLight};
      background-color: ${({ theme }) => theme.colors.contrastLight};
      border-color: ${({ theme }) => theme.colors.contrastLight};
      opacity: 0.8;
    }
  }

  ${({ variant, theme }) => {
    switch (variant) {
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

          &:active,
          &:focus {
            &::after {
              border: 2px solid ${theme.colors.white};
            }
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
          }

          &:active,
          &:focus {
            &::after {
              border: 2px solid ${theme.colors.primaryDark};
            }
          }
        `;
      }

      default: {
        return css`
          background: ${theme.colors.primary};
          color: ${theme.colors.white};
          border: 1px solid ${theme.colors.primary};

          &:active,
          &:focus,
          &:hover {
            background: ${theme.colors.primaryDark};
            border: 1px solid ${theme.colors.primaryDark};
          }

          &:active,
          &:focus {
            &::after {
              border: 2px solid ${theme.colors.white};
            }
          }
        `;
      }
    }
  }}
`;
