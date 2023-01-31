const { Model, DataTypes } = require("sequelize");

const { sequelize } = require("../utils/db");

class Blog extends Model {}

Blog.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.TEXT, allowNull: false },
    author: { type: DataTypes.TEXT, allowNull: true },
    url: { type: DataTypes.TEXT, allowNull: false },
    likes: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1991,
      validate: {
        min: {
          args: [[1991]],
          msg: "Year must be no earlier than 1991!",
        },
        max: {
          args: [[2023]],
          msg: "Year must be not be in the future!",
        },
      },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "blog",
  }
);

module.exports = Blog;
