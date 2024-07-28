import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { startFetchTransactions, startDeleteTransaction } from '../redux/actions/transactionActions';

const IncomeList = () => {
  const transactions = useSelector(state => state.transactions.transactions);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startFetchTransactions());
  }, [dispatch]);

  const handleDeleteTransaction = (id) => {
    dispatch(startDeleteTransaction(id));
  };

  return (
    <div>
      <h1>Income</h1>
      <ul>
        {transactions.filter(transaction => transaction.category === 'Income').map(transaction => (
          <li key={transaction.id}>
            {transaction.description}: ${transaction.amount} on {transaction.date}
            <button onClick={() => handleDeleteTransaction(transaction.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IncomeList;