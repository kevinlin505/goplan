import styled from 'styled-components';
import { TextField } from '@material-ui/core';

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 10px 0;
`;

export const FieldWrapper = styled.div`
  padding: 5px 0;
  margin: 5px 0;
`;

export const GroupFieldWrapper = styled(FieldWrapper)`
  display: flex;
  justify-content: space-between;
`;

export const Input = styled(TextField)`
  width: 100%;
`;
