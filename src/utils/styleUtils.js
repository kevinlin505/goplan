import { css } from 'styled-components';

/*
  Breakpoint returns css wrapped in media queries based on config/state
  Looks like this:
  ${({ theme }) => breakpointMin(theme.sizes.small, css`
    height: 50vh;
  `)};
  First arg is the size you want, the rest is a string containing the css.
*/
export function breakpointMin(mediaSize, cssToUse, orientation) {
  return () => {
    if (orientation) {
      return css`
        @media (min-width: ${mediaSize}px and orientation: ${orientation}) {
          ${cssToUse}
      }`;
    }

    return css`
      @media (min-width: ${mediaSize}px) {
        ${cssToUse};
      }
    `;
  };
}

/*
  Text truncation
*/
export function truncate(width) {
  return css`
    max-width: ${width};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `;
}

/*
  Convert hex (shorthand or longhand) color values to RGB
  Looks like this:
    background: rgba(${props => hexToRgb(props.theme.colors.black)}, 0.8);
*/
export function hexToRgb(hex) {
  const hexChars = 'a-f\\d';
  const match3 = `#?[${hexChars}]{3}`;
  const match6 = `#?[${hexChars}]{6}`;
  const nonHexChars = new RegExp(`[^#${hexChars}]`, 'gi');
  const validHexSize = new RegExp(`^${match3}$|^${match6}$`, 'i');

  if (
    typeof hex !== 'string' ||
    nonHexChars.test(hex) ||
    !validHexSize.test(hex)
  ) {
    throw new TypeError('Expected a valid hex string');
  }

  let hexValue = hex.replace(/^#/, '');

  if (hexValue.length === 3) {
    hexValue =
      hexValue[0] +
      hexValue[0] +
      hexValue[1] +
      hexValue[1] +
      hexValue[2] +
      hexValue[2];
  }

  /* eslint-disable no-bitwise */
  const num = parseInt(hexValue, 16);
  const red = (num >> 16) & 255;
  const green = (num >> 8) & 255;
  const blue = num & 255;
  /* eslint-enable no-bitwise */

  return `${red},${green},${blue}`;
}
