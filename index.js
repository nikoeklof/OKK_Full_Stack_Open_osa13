require("dotenv").config();
const { Sequelize, Model, DataTypes, INTEGER } = require("sequelize");
const express = require("express");
const bodyParser = require("body-parser");
const { string } = require("yargs");

const app = express();
app.use(express.json());

const jsonParser = bodyParser.json();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
});

class Blog extends Model {}
Blog.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    author: { type: DataTypes.TEXT, allowNull: false },
    url: { type: DataTypes.TEXT, allowNull: false },
    title: { type: DataTypes.TEXT, allowNull: false },
    likes: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { sequelize, underscored: true, timestamps: false, modelName: "blog" }
);
app.get("/api/blogs", async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});
app.get("/api/blogs/:id", async (req, res) => {
  const blogs = await Blog.findByPk(req.params.id);
  res.json(blogs);
});
app.post("/api/blogs/", async (req, res) => {
  console.log(isNaN(req.body.likes));
  if (req.body) {
    const blog = req.body;
    if (blog.author && blog.url && blog.title) {
      if (!blog.likes || isNaN(blog.likes)) {
        const reformattedBlog = {
          author: blog.author,
          url: blog.url,
          title: blog.title,
          likes: 0,
        };
        Blog.create(reformattedBlog);
        return res.end(`Blog \"${reformattedBlog.title}\" Added.`);
      } else {
        Blog.create(blog);
        return res.end(`Blog \"${blog.title}\" Added.`);
      }
    }
  } else {
    return res.end("400 Bad Request.");
  }
});
app.delete("/api/blogs/:id", async (req, res) => {
  console.log(req.params);
  if (req.params.id) {
    Blog.destroy({ where: { id: req.params.id } }).then(
      function (rowDeleted) {
        if (rowDeleted === 1) {
          res.status(200).end(`Blog Deleted.`);
        }
      },
      function (err) {
        console.log(err);
      }
    );
  } else {
    res.status(400).end("Bad request, check parameters");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
