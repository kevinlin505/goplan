import styled from 'styled-components';

const Button = styled.button`
  margin: 0;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;

  &:active,
  &:focus,
  &:hover {
    color: ${({ theme }) => theme.colors.primaryLight};
  }
`;

export default Button;
