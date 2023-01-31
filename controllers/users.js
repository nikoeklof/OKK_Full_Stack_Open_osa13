const router = require("express").Router();

const { User, Blog } = require("../models");
const { sessionAuthenticator } = require("../utils/middleware");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      as: "blogsCreated",
      attributes: { exclude: ["userId"] },
    },
  });
  res.json(users);
});

router.post("/", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

router.get("/:id", async (req, res) => {
  let searchByRead = null;
  let where = {};

  if (req.query?.read) {
    searchByRead = req.query.read;
  }

  if (searchByRead !== null) {
    where = {
      isRead: searchByRead,
    };
  }

  const user = await User.findByPk(req.params.id, {
    include: [
      {
        model: Blog,
        as: "blogsCreated",
        attributes: {
          exclude: ["userId"],
        },
      },
      {
        model: Blog,
        as: "blogsReading",

        attributes: {
          exclude: [""],
        },
        through: {
          attributes: ["isRead", "id"],
          where,
        },
      },
    ],
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.put("/:username", sessionAuthenticator, async (req, res) => {
  if (req.user === null || req.session === null) {
    return res.status(401).end();
  }

  const newUsername = req.body.username;
  const user = await User.findOne({ username: req.params.username });

  if (user) {
    user.username = newUsername;
    await user.save();
    return res.status(201).end();
  }

  res.status(404).end();
});

router.delete("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    await user.destroy();
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

router.post("/:id/disable", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    const isDisabled = !user.isDisabled;

    await user.update({
      isDisabled,
    });
  } else {
    return res.status(404).end();
  }

  res.status(200).end();
});

module.exports = router;
