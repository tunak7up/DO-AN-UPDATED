const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ImportReceipt = sequelize.define(
  "ImportReceipt",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    supplier_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    total_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    note: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "import_receipt",
    timestamps: false,
  }
);

module.exports = ImportReceipt;
