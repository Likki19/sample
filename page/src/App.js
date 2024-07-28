import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import IncomeList from './components/IncomeList';
import ExpenseList from './components/ExpenseList';

const App = () => {
  const token = localStorage.getItem('jwtToken');

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/income" element={token ? <IncomeList /> : <Navigate to="/login" />} />
      <Route path="/expenses" element={token ? <ExpenseList /> : <Navigate to="/login" />} />
      
      <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
    </Routes>
  );
};

export default App;
