import styled from 'styled-components';

const CardContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 10px;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text};
`;

export default CardContainer;
