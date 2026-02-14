const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./Category');
const User = require('./User');

const Transaction = sequelize.define('Transaction', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  type: { type: DataTypes.ENUM('income','expense'), allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  description: { type: DataTypes.STRING },
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  categoryId: { type: DataTypes.INTEGER },
  userId: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'transactions' });

// Relasi
User.hasMany(Category, { foreignKey: 'userId' });
Category.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

Category.hasMany(Transaction, { foreignKey: 'categoryId' });
Transaction.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = Transaction;
