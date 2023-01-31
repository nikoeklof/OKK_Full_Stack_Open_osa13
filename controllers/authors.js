const sequelize = require("sequelize");
const router = require("express").Router();

const { Blog } = require("../models/");

router.get("/", async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      "author",
      "likes",
      [sequelize.fn("COUNT", sequelize.col("author")), "articles"],
    ],
    group: ["author", "likes"],
    order: [[sequelize.fn("SUM", sequelize.col("likes")), "DESC"]],
  });

  res.json(authors).end();
});

module.exports = router;
