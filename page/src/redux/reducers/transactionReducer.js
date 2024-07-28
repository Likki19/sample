import { ADD_TRANSACTION, DELETE_TRANSACTION, EDIT_TRANSACTION, SET_TRANSACTIONS } from '../actions/transactionActions';
const initialState = {
  transactions: [],
};

const transactionReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(transaction => transaction.id !== action.payload),
      };
    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(transaction =>
          transaction.id === action.payload.id ? { ...transaction, ...action.payload.updatedTransaction } : transaction
        ),
      };
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload,
      };
    default:
      return state;
  }
};

export default transactionReducer;