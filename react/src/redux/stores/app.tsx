import { createStore } from 'redux';
import appReducer from '../reducers/app';
import { composeWithDevTools } from 'redux-devtools-extension';
export let store = createStore(appReducer, composeWithDevTools())
