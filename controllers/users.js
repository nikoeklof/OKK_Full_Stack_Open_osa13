const router = require("express").Router();

const User = require("../models/User");
const Blog = require("../models/Blog");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
    },
  });
  res.json(users);
});

router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    return res.status(400).json({ Error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});
router.delete("/:id", async (req, res) => {
  if (req.params.id) {
    User.destroy({ where: { id: req.params.id } });
    res.status(200).end(`Row with id: ${req.params.id} Deleted.`);
  } else {
    res.status(400).end("invalid parameters");
  }
});
router.put("/:username", async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } });
  if (user) {
    await user.update({ name: req.body.name });
    user.save();
    res.json(user);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
