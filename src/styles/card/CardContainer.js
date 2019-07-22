import styled from 'styled-components';

const CardContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 200px;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 0 0 4px 4px;
  box-shadow: 0px 1px 3px 0px ${({ theme }) => theme.colors.divider},
    0px 1px 1px 0px ${({ theme }) => theme.colors.divider},
    0px 2px 1px -1px ${({ theme }) => theme.colors.divider};
`;

export default CardContainer;
