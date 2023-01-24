const Blog = require("./Blog");
const User = require("./User");

User.hasMany(Blog);
Blog.belongsTo(User);

Blog.sync({ alter: true });
User.sync({ alter: true });

module.exports = {
  Blog,
  User,
};
