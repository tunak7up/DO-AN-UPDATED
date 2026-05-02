const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Gallery = sequelize.define('Gallery', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  thumbnail: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  tableName: 'gallery',
  timestamps: false
});

module.exports = Gallery;