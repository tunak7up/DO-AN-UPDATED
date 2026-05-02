const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(150),
    allowNull: false
  }
}, {
  tableName: 'roles',
  timestamps: false
});

module.exports = Role;