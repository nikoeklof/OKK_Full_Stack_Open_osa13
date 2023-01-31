const Blog = require("./Blog");
const User = require("./User");
const UserReading = require("./UserReading");
const ActiveSession = require("./ActiveSession");

User.hasMany(Blog, { as: "blogsCreated" });
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: UserReading, as: "blogsReading" });
Blog.belongsToMany(User, { through: UserReading, as: "inReadingList" });

User.hasOne(ActiveSession);
ActiveSession.belongsTo(User);

module.exports = {
  Blog,
  User,
  UserReading,
  ActiveSession,
};
