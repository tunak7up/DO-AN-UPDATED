const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AppointmentHistory = sequelize.define(
  "AppointmentHistory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    appointment_id: {
      type: DataTypes.BIGINT.UNSIGNED,
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
      allowNull: true,
    },
    old_payment_status: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    new_payment_status: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    old_technician_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    new_technician_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "appointment_histories",
    timestamps: false,
  }
);

module.exports = AppointmentHistory;
