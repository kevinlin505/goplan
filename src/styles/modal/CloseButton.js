import styled from 'styled-components';
import { IconButton } from '@material-ui/core';

const CloseButton = styled(IconButton)`
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 5px;
  color: ${({ theme }) => theme.colors.black};
  z-index: 1px;
`;

export default CloseButton;
