const jwt = require("jsonwebtoken");

const { SECRET } = require("./config");
const { verifyTimestamp } = require("../utils/timeStamp");
const { Blog, User, ActiveSession } = require("../models/");

const decodeToken = (req) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return jwt.verify(authorization.substring(7), SECRET);
  } else {
    return null;
  }
};

const compareTokens = (first, second) => {
  let token1 = first;
  let token2 = second;

  if (token1.toLowerCase().startsWith("bearer ")) {
    token1 = token1.substring(7);
  }

  if (token2.toLowerCase().startsWith("bearer ")) {
    token2 = token2.substring(7);
  }

  console.log("token1", token1);
  console.log("token2", token2);
  return token1 === token2;
};

const tokenExtractor = (req, res, next) => {
  req.decodedToken = decodeToken(req);

  next();
};

const userExtractor = async (req, res, next) => {
  const token = decodeToken(req);
  const userId = token?.id;

  req.user = null;
  req.session = null;

  if (userId) {
    req.user = await User.findByPk(userId);
  }

  next();
};

const sessionAuthenticator = async (req, res, next) => {
  const session = await ActiveSession.findOne({
    where: {
      userId: req.user.id,
    },
  });

  if (session) {
    const givenToken = req.get("authorization");

    if (
      verifyTimestamp(session.expiration) &&
      !req.user.isDisabled &&
      compareTokens(session.token, givenToken)
    ) {
      req.session = session;
    } else {
      session.destroy();
    }
  }

  next();
};

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

const errorHandler = (err, req, res, next) => {
  console.log(err);

  switch (err.name) {
    case "JsonWebTokenError":
      return res.status(401).json({
        error: "invalid token",
      });
    case "TokenExpiredError":
      return res.status(401).json({
        error: "token expired",
      });
    case "SequelizeValidationError":
      return res.status(400).json({
        error: generateSqlErrorMessage(err.errors[0]),
      });
  }

  return res.status(500).json({
    error: err.toString(),
  });
};

const generateSqlErrorMessage = (error) => {
  const message = `${error.type} in ${error.path}: ${error.value}. ${error.message}`;
  return message;
};

module.exports = {
  tokenExtractor,
  userExtractor,
  sessionAuthenticator,
  blogFinder,
  errorHandler,
  generateSqlErrorMessage,
};
