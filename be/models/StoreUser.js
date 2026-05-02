const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const StoreUser = sequelize.define(
  "StoreUser",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "stores_users",
    timestamps: false,
  }
);

module.exports = StoreUser;
