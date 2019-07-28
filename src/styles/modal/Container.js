import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 25px;
  background: ${({ theme }) => theme.colors.white};
`;

export default Container;
