const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TechTask = sequelize.define('TechTask', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  task_type: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'tech_task',
  timestamps: false
});

module.exports = TechTask;