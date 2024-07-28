const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();
 
const authenticateToken = require('./middleware/authMiddleware'); // Import the middleware
 
const app = express();
const port = 5001;
 
// Middleware
app.use(cors());
app.use(bodyParser.json());
 
// Ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET environment variable is not set.');
  process.exit(1);
}
 
const usersFilePath = path.join(__dirname, 'data', 'users.json');
const transactionsFilePath = path.join(__dirname, 'data', 'transactions.json');
 
// Function to read JSON files
const readJSONFile = (filePath) => {
  try {
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
};
 
// Function to write to JSON files
const writeJSONFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
  }
};
 
// Register endpoint
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;
  const users = readJSONFile(usersFilePath);
 
  const usernameExists = users.some(user => user.username === username);
  const emailExists = users.some(user => user.email === email);
 
  if (usernameExists && emailExists) {
    return res.status(400).json({ message: 'Username and email already exist. Please log in.' });
  } else if (usernameExists) {
    return res.status(400).json({ message: 'Username already exists. Please choose another username.' });
  } else if (emailExists) {
    return res.status(400).json({ message: 'Email already registered. Please log in.' });
  }
 
  // Add new user and save
  const newUser = {
    id: (users.length + 1).toString(),
    username,
    email,
    password
  };
  users.push(newUser);
  writeJSONFile(usersFilePath, users);
  res.status(201).json({ message: 'User registered successfully. Please log in.' });
});
 
// Login endpoint
app.post('/api/login', (req, res) => {
  const { usernameOrEmail, password } = req.body;
  const users = readJSONFile(usersFilePath);
 
  const user = users.find(user =>
    (user.email === usernameOrEmail || user.username === usernameOrEmail) && user.password === password
  );
 
  if (user) {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});
 
// Get all transactions for a user
app.get('/api/transactions', authenticateToken, (req, res) => {
  const transactions = readJSONFile(transactionsFilePath);
  const userTransactions = transactions.filter(transaction => transaction.userId === req.user.id);
  res.json(userTransactions);
});
 
// Get a specific transaction by ID
app.get('/api/transactions/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const transactions = readJSONFile(transactionsFilePath);
  const transaction = transactions.find(tx => tx.id === id && tx.userId === req.user.id);
 
  if (transaction) {
    res.json(transaction);
  } else {
    res.status(404).json({ message: 'Transaction not found' });
  }
});
 
// Add a transaction endpoint
app.post('/api/transactions', authenticateToken, (req, res) => {
  const { description, category, amount, date } = req.body;
  const transactions = readJSONFile(transactionsFilePath);
 
  // Create a new transaction
  const newTransaction = {
    id: (transactions.length + 1).toString(),
    userId: req.user.id,
    description,
    category,
    amount,
    date
  };
 
  transactions.push(newTransaction);
  writeJSONFile(transactionsFilePath, transactions);
  res.status(201).json({ message: 'Transaction added successfully', transaction: newTransaction });
});
 
// Update a transaction endpoint
app.put('/api/transactions/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { description, category, amount, date } = req.body;
  const transactions = readJSONFile(transactionsFilePath);
 
  const transactionIndex = transactions.findIndex(transaction => transaction.id === id && transaction.userId === req.user.id);
  if (transactionIndex === -1) {
    return res.status(404).json({ message: 'Transaction not found' });
  }
 
  transactions[transactionIndex] = {
    ...transactions[transactionIndex],
    description,
    category,
    amount,
    date
  };
 
  writeJSONFile(transactionsFilePath, transactions);
 
  res.status(200).json({ transaction: transactions[transactionIndex] });
});
 
// Delete a transaction endpoint
app.delete('/api/transactions/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const transactions = readJSONFile(transactionsFilePath);
  const transactionIndex = transactions.findIndex(transaction => transaction.id === id && transaction.userId === req.user.id);
 
  if (transactionIndex === -1) {
    return res.status(404).json({ message: 'Transaction not found' });
  }
 
  transactions.splice(transactionIndex, 1);
  writeJSONFile(transactionsFilePath, transactions);
  res.status(200).json({ message: 'Transaction deleted successfully' });
});
 
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});