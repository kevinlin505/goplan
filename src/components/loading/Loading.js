import React from 'react';
import styled from 'styled-components';
import Rainy from '@components/icons/Rainy';

const Loading = () => {
  return (
    <LoadingWrapper>
      <Rainy />
    </LoadingWrapper>
  );
};

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 100%;
`;

export default Loading;
