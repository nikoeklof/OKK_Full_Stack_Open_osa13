const createTimestamp = (hours = 8) => {
  const now = Date.now();
  const then = now + hours * 3600000;

  const stamp = new Date(then).toISOString();
  return stamp;
};

const verifyTimestamp = (stamp) => {
  const now = Date.now();
  const then = Date.parse(stamp);

  if (isNaN(then)) {
    throw new Error("Invalid timestamp");
  }

  return now - then <= 0;
};

module.exports = { createTimestamp, verifyTimestamp };
