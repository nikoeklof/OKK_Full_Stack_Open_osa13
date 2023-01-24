const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.TEXT, allowNull: false },
    title: { type: DataTypes.TEXT, allowNull: false, unique: true },
    likes: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { sequelize, underscored: true, timestamps: false, modelName: "blog" }
);

module.exports = Blog;
