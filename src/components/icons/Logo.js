import React from 'react';
import styled from 'styled-components';

export const Logo = () => {
  return (
    <Svg height="68" viewBox="0 0 313 68" width="313">
      <text
        fill="currentColor"
        fillRule="evenodd"
        fontFamily="'Ubuntu', sans-serif"
        fontSize="100"
      >
        <tspan x="-3.871" y="67">
          GoPlan
        </tspan>
      </text>
    </Svg>
  );
};

const Svg = styled.svg`
  width: 100%;
`;

export default Logo;
