const initialState = {
  isAuthenticated: false,
  user: null,
  transactions: [],
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

export const transactionReducer = (state = initialState.transactions, action) => {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return action.payload;
    case 'ADD_TRANSACTION':
      return [...state, action.payload];
    case 'REMOVE_TRANSACTION':
      return state.filter(transaction => transaction.id !== action.payload);
    default:
      return state;
  }
};
