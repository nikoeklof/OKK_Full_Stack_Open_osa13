const router = require("express").Router();
const { Blog, User } = require("../models/index");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../utils/config");
const { Sequelize, Op } = require("sequelize");

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      console.log(authorization.substring(7));
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch (error) {
      console.log(error);
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

router.get("/", async (req, res) => {
  if (req.query.search) {
    const searchQuery = req.query.search.toLowerCase();
    const blogs = await Blog.findAll(
      {
        where: {
          [Op.or]: [
            {
              title: Sequelize.where(
                Sequelize.fn("LOWER", Sequelize.col("title")),
                "LIKE",
                "%" + searchQuery + "%"
              ),
            },
            {
              author: Sequelize.where(
                Sequelize.fn("LOWER", Sequelize.col("author")),
                "LIKE",
                "%" + searchQuery + "%"
              ),
            },
          ],
        },
      },

      {
        attributes: { exclude: ["userId"] },
        include: {
          model: User,
          attributes: ["name"],
        },
      }
    );
    res.json(blogs);
  } else {
    const blogs = await Blog.findAll({
      attributes: { exclude: ["userId"] },
      include: {
        model: User,
        attributes: ["name"],
      },
    });
    res.json(blogs);
  }
});
router.get("/:id", async (req, res) => {
  const blogs = await Blog.findByPk(req.params.id, {
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
  });
  res.json(blogs);
});
router.post("/", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);

  if (user) {
    const blog = Blog.build({
      author: req.body.author,
      url: req.body.url,
      title: req.body.title,
      likes: req.body.likes,
      userId: user.id,
      date: new Date(),
    });
    if (!blog.likes || isNaN(blog.likes)) {
      const fixedBlog = Blog.build({
        author: req.body.author,
        url: req.body.url,
        title: req.body.title,
        likes: 0,
        userId: user.id,
        date: new Date(),
      });

      await fixedBlog.save();
      return res.end(`Blog \"${fixedBlog.title}\" Added.`);
    } else {
      await blog.save();
      return res.end(`Blog \"${blog.title}\" Added.`);
    }
  } else {
    return res.end("400 Bad Request.");
  }
});
router.delete("/:id", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.findByPk(req.params.id);
  if (user.id === blog.userId) {
    await blog.destroy({ where: { id: req.params.id } }).then(
      function (rowDeleted) {
        if (rowDeleted === 1) {
          res.status(200).end(`Blog Deleted.`);
        }
      },
      function (err) {
        res.json(err);
      }
    );
  } else {
    res.status(400).end("Invalid user");
  }
});
router.put("/:id", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.findByPk(req.params.id);
  if (user.id === blog.userId) {
    await blog.update({ likes: req.body.likes });
    await blog.save();
    return res.end(`${blog.title} likes set to: ${blog.likes}`);
  } else {
    res.status(400).end();
  }
});

module.exports = router;
