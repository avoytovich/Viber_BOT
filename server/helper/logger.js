const winston = require('winston');
const toYAML = require('winston-console-formatter');

const createLogger = () => {
  const logger = new winston.Logger({
    level: "debug"
  });
  logger.add(winston.transports.Console, toYAML());
  return logger;
};

const logger = createLogger();

module.exports = logger;
