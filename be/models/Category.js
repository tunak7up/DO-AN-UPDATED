const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  thumbnail: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'category',
  timestamps: false
});

module.exports = Category;