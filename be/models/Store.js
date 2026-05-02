const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Store = sequelize.define('Store', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(56),
    allowNull: true
  },
  address: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'store',
  timestamps: false
});

module.exports = Store;