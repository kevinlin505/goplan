import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from '@material-ui/core';

const FacebookAuthButton = ({ handleSignIn }) => {
  return (
    <AuthButton onClick={() => handleSignIn('facebook')}>
      <svg
        height="46"
        viewBox="0 0 252 46"
        width="252"
        xlink="http://www.w3.org/1999/xlink"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <rect height="40" id="facebook-login-b" rx="2" width="248" />
          <filter
            filterUnits="objectBoundingBox"
            height="125%"
            id="facebook-login-a"
            width="103.2%"
            x="-1.6%"
          >
            <feOffset dy="2" in="SourceAlpha" result="shadowOffsetOuter1" />
            <feGaussianBlur
              in="shadowOffsetOuter1"
              result="shadowBlurOuter1"
              stdDeviation="1"
            />
            <feColorMatrix
              in="shadowBlurOuter1"
              result="shadowMatrixOuter1"
              values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.24 0"
            />
            <feOffset in="SourceAlpha" result="shadowOffsetOuter2" />
            <feGaussianBlur
              in="shadowOffsetOuter2"
              result="shadowBlurOuter2"
              stdDeviation="1"
            />
            <feColorMatrix
              n="shadowBlurOuter2"
              result="shadowMatrixOuter2"
              values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.12 0"
            />
            <feMerge>
              <feMergeNode in="shadowMatrixOuter1" />
              <feMergeNode in="shadowMatrixOuter2" />
            </feMerge>
          </filter>
        </defs>
        <g fill="none" fillRule="evenodd" transform="translate(2 2)">
          <use
            fill="#000"
            filter="url(#facebook-login-a)"
            href="#facebook-login-b"
          />
          <use fill="#2553B4" href="#facebook-login-b" />
          <text
            fill="#FFF"
            fontFamily=".AppleSystemUIFont"
            fontSize="14"
            letterSpacing=".219"
          >
            <tspan x="53" y="26">
              Sign in with Facebook
            </tspan>
          </text>
          <path
            d="M13.1919442,20.4807476 L13.1919442,25.4379175 L16.2287791,25.4379175 L16.2287791,40 L22.0685485,40 L22.0685485,25.3759757 L26.142767,25.3759757 L26.5765,20.4807476 L22.0685485,20.4807476 L22.0685485,17.6923131 C22.0685485,16.538085 22.3009709,16.0811238 23.4162743,16.0811238 L26.5764296,16.0811238 L26.5764296,11 L22.5332524,11 C18.1878981,11 16.2287791,12.913085 16.2287791,16.5769393 L16.2287791,20.4807476 L13.1919442,20.4807476 Z"
            fill="#FFF"
          />
        </g>
      </svg>
    </AuthButton>
  );
};

FacebookAuthButton.propTypes = {
  handleSignIn: PropTypes.func.isRequired,
};

const AuthButton = styled(Button)`
  width: 100%;
`;

export default FacebookAuthButton;
