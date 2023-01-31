const router = require("express").Router();

const { UserReading } = require("../models");
const { sessionAuthenticator } = require("../utils/middleware");

router.post("/", async (req, res) => {
  await UserReading.create({
    userId: req.body.userId,
    blogId: req.body.blogId,
  });

  res.status(201).end();
});

router.put("/:id", sessionAuthenticator, async (req, res) => {
  if (req.user === null || req.session === null) {
    return res.status(401).end();
  }

  const readingList = await UserReading.findByPk(req.params.id);
  console.log(readingList);

  if (readingList) {
    readingList.isRead = req.body.isRead;
    await readingList.save();
    res.json(readingList);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
