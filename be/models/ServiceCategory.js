const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ServiceCategory = sequelize.define('ServiceCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'service_categories',
  timestamps: false
});

module.exports = ServiceCategory;
