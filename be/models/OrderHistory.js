const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const OrderHistory = sequelize.define(
  "OrderHistory",
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
    changed_by_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    old_status: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    new_status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    old_payment_status: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    new_payment_status: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    old_shipper_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    new_shipper_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "order_histories",
    timestamps: false,
  }
);

module.exports = OrderHistory;
