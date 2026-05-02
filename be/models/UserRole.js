const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserRole = sequelize.define('UserRole', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'users_roles',
  timestamps: false
});

module.exports = UserRole;