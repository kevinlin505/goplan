import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from '@material-ui/core';

export const GoogleAuthButton = ({ handleSignIn }) => {
  return (
    <AuthButton onClick={() => handleSignIn('google')}>
      <svg
        height="46"
        viewBox="0 0 252 46"
        width="252"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <rect height="40" id="google-b" rx="2" width="248" />
          <filter
            filterUnits="objectBoundingBox"
            height="125%"
            id="google-a"
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
              in="shadowBlurOuter2"
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
          <use fill="#000" filter="url(#google-a)" xlinkHref="#google-b" />
          <use fill="#FFF" xlinkHref="#google-b" />
          <text
            fill="#000"
            fillOpacity=".54"
            fontFamily=".AppleSystemUIFont"
            fontSize="14"
            letterSpacing=".219"
          >
            <tspan x="50" y="26">
              Sign in with Google
            </tspan>
          </text>
          <g fill="#000" transform="translate(11 11)">
            <path
              d="M9,3.48 C10.69,3.48 11.83,4.21 12.48,4.82 L15.02,2.34 C13.46,0.89 11.43,0 9,0 C5.48,0 2.44,2.02 0.96,4.96 L3.87,7.22 C4.6,5.05 6.62,3.48 9,3.48 L9,3.48 Z"
              fill="#EA4335"
            />
            <path
              d="M17.64,9.2 C17.64,8.46 17.58,7.92 17.45,7.36 L9,7.36 L9,10.7 L13.96,10.7 C13.86,11.53 13.32,12.78 12.12,13.62 L14.96,15.82 C16.66,14.25 17.64,11.94 17.64,9.2 L17.64,9.2 Z"
              fill="#4285F4"
            />
            <path
              d="M3.88,10.78 C3.69,10.22 3.58,9.62 3.58,9 C3.58,8.38 3.69,7.78 3.87,7.22 L0.96,4.96 C0.35,6.18 0,7.55 0,9 C0,10.45 0.35,11.82 0.96,13.04 L3.88,10.78 L3.88,10.78 Z"
              fill="#FBBC05"
            />
            <path
              d="M9,18 C11.43,18 13.47,17.2 14.96,15.82 L12.12,13.62 C11.36,14.15 10.34,14.52 9,14.52 C6.62,14.52 4.6,12.95 3.88,10.78 L0.97,13.04 C2.45,15.98 5.48,18 9,18 L9,18 Z"
              fill="#34A853"
            />
            <polygon fill="none" points="0 0 18 0 18 18 0 18" />
          </g>
        </g>
      </svg>
    </AuthButton>
  );
};

GoogleAuthButton.propTypes = {
  handleSignIn: PropTypes.func.isRequired,
};

const AuthButton = styled(Button)`
  width: 100%;
`;

export default GoogleAuthButton;
