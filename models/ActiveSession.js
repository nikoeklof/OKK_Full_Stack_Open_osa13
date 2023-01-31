const { Model, DataTypes } = require("sequelize");

const { sequelize } = require("../utils/db");

class ActiveSession extends Model {}

ActiveSession.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    expiration: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    createdAt: true,
    updatedAt: false,
    modelName: "activeSession",
  }
);

module.exports = ActiveSession;
