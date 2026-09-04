const format = (level, message) =>
  JSON.stringify({
    level,
    message,
    timestamp: new Date().toISOString(),
  });

const logger = {
  info(message) {
    console.log(format("info", message));
  },
  error(message) {
    console.error(format("error", message));
  },
};

module.exports = logger;
