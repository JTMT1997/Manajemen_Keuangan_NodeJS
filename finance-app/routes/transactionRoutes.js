const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/authMiddleware');

router.use(auth);

// GET
router.get('/', transactionController.getAllTransactions);
router.get('/filter', transactionController.filterTransactions);
router.get('/export', transactionController.exportTransactionsExcel);
router.get('/dashboard', transactionController.getDashboardStats);

// POST
router.post('/', transactionController.createTransaction);

// PUT
router.put('/:id', transactionController.updateTransaction);

// DELETE
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
