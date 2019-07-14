import { createSelectorCreator, defaultMemoize } from 'reselect';
import deepEqual from 'fast-deep-equal';

/*
  Helper to create a custom selector with custom deepEqual equality
  check for objects rather than default === reference check
*/
const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  (currentVal, previousVal) => deepEqual(currentVal, previousVal),
);

export default createDeepEqualSelector;
