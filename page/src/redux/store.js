import { createStore, applyMiddleware, combineReducers } from 'redux';
import { loadState, saveState } from './reducers/localStorage';  // Adjust the import path if needed
import authReducer from './reducers/authReducer';
import transactionReducer from './reducers/transactionReducer';
import {thunk} from 'redux-thunk';

const rootReducer = combineReducers({
  auth: authReducer,
  transactions: transactionReducer
});

const persistedState = loadState();

const store = createStore(
  rootReducer,
  persistedState,
  applyMiddleware(thunk)
);

store.subscribe(() => {
  saveState({
    auth: store.getState().auth,
    transactions: store.getState().transactions
  });
});

export default store;