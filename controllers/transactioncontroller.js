const Transaction = require('../models/transaction');
const User = require('../models/user');

// Controller to fetch transactions for a specific user
const getTransactionsByUserId = async (req, res) => {
  const { userId, status, startDate, endDate, type, page = 1, limit = 10 } = req.query;

  try {
    const filters = { userId };
    if (status) filters.status = status;
    if (type) filters.type = type;
    if (startDate && endDate) filters.transactionDate = { $gte: new Date(startDate), $lte: new Date(endDate) };

    const transactions = await Transaction.aggregate([
      { $match: filters },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      { $unwind: '$userDetails' },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) },
    ]);

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching transactions', error: err });
  }
};

// Controller to fetch all transactions with filters
const getAllTransactions = async (req, res) => {
  const { status, startDate, endDate, type, page = 1, limit = 10 } = req.query;

  try {
    const filters = {};
    if (status) filters.status = status;
    if (type) filters.type = type;
    if (startDate && endDate) filters.transactionDate = { $gte: new Date(startDate), $lte: new Date(endDate) };

    const transactions = await Transaction.aggregate([
      { $match: filters },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      { $unwind: '$userDetails' },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) },
    ]);

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching transactions', error: err });
  }
};

// Controller to make a new transaction
const makeTransaction = async (req, res) => {
  const { userId, status, type, transactionDate, amount } = req.body;

  if (!userId || !status || !type || !transactionDate || !amount) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const transaction = new Transaction({
      userId,
      status,
      type,
      transactionDate,
      amount,
    });

    await transaction.save();
    res.status(201).json({ message: 'Transaction created successfully', transaction });
  } catch (err) {
    res.status(500).json({ message: 'Error creating transaction', error: err });
  }
};

module.exports = { getTransactionsByUserId, getAllTransactions, makeTransaction };
