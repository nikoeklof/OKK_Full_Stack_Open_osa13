const { Op } = require("sequelize");
const router = require("express").Router();

const { blogFinder, sessionAuthenticator } = require("../utils/middleware");
const { Blog, User } = require("../models/");

router.get("/", async (req, res) => {
  const search = req.query.search;
  let where = {};

  if (search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          author: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ],
    };
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    where,
    order: [["likes", "DESC"]],
  });

  res.json(blogs);
});

router.post("/", sessionAuthenticator, async (req, res) => {
  if (req.user === null || req.session === null) {
    return res.status(401).end();
  }

  const blog = await Blog.create({
    ...req.body,
    userId: req.user.id,
  });

  res.json(blog);
});

router.delete("/:id", sessionAuthenticator, blogFinder, async (req, res) => {
  if (req.user === null || req.session === null) {
    res.status(401).end();
    return;
  }

  if (req.blog) {
    await req.blog.destroy();
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

router.put("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes;
    await req.blog.save();
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
