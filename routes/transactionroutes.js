const express = require('express');
const { getTransactionsByUserId, getAllTransactions, makeTransaction } = require('../controllers/transactioncontroller');

const router = express.Router();

router.get('/transactions/user/:userId', getTransactionsByUserId);
router.get('/transactions', getAllTransactions);
router.post('/transaction', makeTransaction); // Make new transaction route

module.exports = router;
