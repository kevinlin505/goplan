import styled from 'styled-components';
// import Card from '@material-ui/core/Card';

const CardContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 200px;
  margin-bottom: 15px;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text};
`;

export default CardContainer;
