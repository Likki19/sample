import axios from 'axios';

// Action Types
export const ADD_TRANSACTION = 'ADD_TRANSACTION';
export const DELETE_TRANSACTION = 'DELETE_TRANSACTION';
export const EDIT_TRANSACTION = 'EDIT_TRANSACTION';
export const SET_TRANSACTIONS = 'SET_TRANSACTIONS';

// Action Creators
export const addTransaction = (transaction) => ({
  type: ADD_TRANSACTION,
  payload: transaction,
});

export const deleteTransaction = (id) => ({
  type: DELETE_TRANSACTION,
  payload: id,
});

export const editTransaction = (id, updatedTransaction) => ({
  type: EDIT_TRANSACTION,
  payload: { id, updatedTransaction },
});

export const setTransactions = (transactions) => ({
  type: SET_TRANSACTIONS,
  payload: transactions,
});

// Thunks
export const startFetchTransactions = () => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) throw new Error('No token found');
      const response = await axios.get('http://localhost:5001/api/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setTransactions(response.data));
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };
};

export const startDeleteTransaction = (id) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) throw new Error('No token found');
      await axios.delete(`http://localhost:5001/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(deleteTransaction(id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };
};