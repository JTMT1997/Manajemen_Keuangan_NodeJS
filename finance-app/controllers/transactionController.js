// finance-app/controllers/transactionController.js

const Transaction = require('../models/Transaction');
const { Op } = require('sequelize');
const ExcelJS = require('exceljs');

// ========================
// GET ALL TRANSACTIONS
// ========================
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({ where: { userId: req.user.id } });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ========================
// CREATE TRANSACTION
// ========================
exports.createTransaction = async (req, res) => {
  try {
    const { type, amount, description, date, categoryId } = req.body;

    if (!type || !['income','expense'].includes(type))
      return res.status(400).json({ error: 'Type must be income or expense' });
    if (!amount || isNaN(amount)) return res.status(400).json({ error: 'Amount is required and must be a number' });

    const transaction = await Transaction.create({
      type,
      amount,
      description: description || '',
      date: date || new Date(),
      categoryId: categoryId || null,
      userId: req.user.id
    });

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ========================
// UPDATE TRANSACTION
// ========================
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, description, date, categoryId } = req.body;

    const [updated] = await Transaction.update(
      { type, amount, description, date, categoryId },
      { where: { id, userId: req.user.id } }
    );

    if (!updated) return res.status(404).json({ error: 'Transaction not found' });

    res.json({ message: 'Transaction updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ========================
// DELETE TRANSACTION
// ========================
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Transaction.destroy({ where: { id, userId: req.user.id } });

    if (!deleted) return res.status(404).json({ error: 'Transaction not found' });

    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ========================
// FILTER & PAGINATION
// ========================
exports.filterTransactions = async (req, res) => {
  try {
    let { startDate, endDate, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = { userId: req.user.id };
    if (startDate && endDate) {
      where.date = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }

    const { count, rows } = await Transaction.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['date', 'DESC']]
    });

    res.json({
      total: count,
      page: parseInt(page),
      perPage: parseInt(limit),
      transactions: rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ========================
// DASHBOARD STATISTIK
// ========================
exports.getDashboardStats = async (req, res) => {
  try {
    const { year } = req.query; // Contoh: ?year=2026
    const startYear = new Date(year, 0, 1);
    const endYear = new Date(year, 11, 31, 23, 59, 59);

    const transactions = await Transaction.findAll({
      where: {
        userId: req.user.id,
        date: { [Op.between]: [startYear, endYear] }
      }
    });

    const summary = {
      monthlyIncome: {},
      monthlyExpense: {},
      totalIncome: 0,
      totalExpense: 0
    };

    for (let i = 1; i <= 12; i++) {
      summary.monthlyIncome[i] = 0;
      summary.monthlyExpense[i] = 0;
    }

    transactions.forEach(t => {
      const month = t.date.getMonth() + 1;
      if (t.type === 'income') {
        summary.monthlyIncome[month] += t.amount;
        summary.totalIncome += t.amount;
      } else {
        summary.monthlyExpense[month] += t.amount;
        summary.totalExpense += t.amount;
      }
    });

    summary.balance = summary.totalIncome - summary.totalExpense;
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ========================
// EXPORT KE EXCEL
// ========================
exports.exportTransactionsExcel = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({ where: { userId: req.user.id } });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transactions');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Type', key: 'type', width: 10 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Description', key: 'description', width: 25 },
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Category ID', key: 'categoryId', width: 15 }
    ];

    transactions.forEach(t => {
      worksheet.addRow({
        id: t.id,
        type: t.type,
        amount: t.amount,
        description: t.description,
        date: t.date,
        categoryId: t.categoryId
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
