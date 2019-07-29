import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  padding: 25px;
  background: ${({ theme }) => theme.colors.white};
`;

export default Container;
