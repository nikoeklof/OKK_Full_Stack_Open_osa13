const express = require("express");
require("express-async-errors");

const { PORT } = require("./utils/config");
const { connectToDatabase } = require("./utils/db");
const { errorHandler, userExtractor } = require("./utils/middleware");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const logoutRouter = require("./controllers/logout");
const authorsRouter = require("./controllers/authors");
const readinglistRouter = require("./controllers/readingList");

const app = express();

app.use(express.json());

app.use(userExtractor);

app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/blogs", blogsRouter);
app.use("/api/authors", authorsRouter);
app.use("/api/readinglist", readinglistRouter);

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
