import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { startDeleteTransaction } from '../redux/actions/transactionActions';

const ExpenseList = () => {
  const transactions = useSelector(state => state.transactions.transactions);
  const dispatch = useDispatch();

  const handleDeleteTransaction = (id) => {
    dispatch(startDeleteTransaction(id));
  };

  return (
    <div>
      <h1>Expenses</h1>
      <ul>
        {transactions.filter(transaction => transaction.category === 'Expense').map(transaction => (
          <li key={transaction.id}>
            {transaction.description}: ${transaction.amount} on {transaction.date}
            <button onClick={() => handleDeleteTransaction(transaction.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;