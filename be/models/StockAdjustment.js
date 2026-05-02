const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const StockAdjustment = sequelize.define(
  "StockAdjustment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    adjusted_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    old_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    new_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "stock_adjustment",
    timestamps: false,
  }
);

module.exports = StockAdjustment;
