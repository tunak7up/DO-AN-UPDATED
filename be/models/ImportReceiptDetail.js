const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ImportReceiptDetail = sequelize.define(
  "ImportReceiptDetail",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    receipt_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    unit_price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    total_price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "import_receipt_detail",
    timestamps: false,
  }
);

module.exports = ImportReceiptDetail;
