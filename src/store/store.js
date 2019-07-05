import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import rootReducer from '@providers/_index';

const enhancer = composeWithDevTools(applyMiddleware(thunk));

export default function configureStore(initialState) {
  return createStore(rootReducer, initialState, enhancer);
}
