const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Appointment = sequelize.define(
  "Appointment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    technician_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    appointment_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    price_at_booking: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "pending",
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    payment_status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "Unpaid",
    },
  },
  {
    tableName: "appointments",
    timestamps: false,
  },
);

module.exports = Appointment;
