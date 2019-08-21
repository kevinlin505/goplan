import { css } from 'styled-components';

/*
  Breakpoint returns css wrapped in media queries based on config/state
  Looks like this:
  ${breakpointMin('large', css`
    height: 50vh;
  `)};
  First arg is the size you want, the rest is a string containing the css.
*/
export default function breakpointMin(minSize, cssToUse, orientation) {
  return props => {
    const mediaSize = props.theme.sizes[minSize];

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
