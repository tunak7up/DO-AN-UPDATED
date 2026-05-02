const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ShippingLog = sequelize.define(
  "ShippingLog",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    action: {
      type: DataTypes.ENUM("assigned", "picked_up", "delivered", "failed"),
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "shipping_log",
    timestamps: false,
  }
);

module.exports = ShippingLog;
