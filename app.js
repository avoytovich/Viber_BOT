const http = require('http');
const ViberBot = require('viber-bot').Bot;
const winston = require('winston');
const toYAML = require('winston-console-formatter');
const { getPublicUrl } = require('./server/helper/function');
const { checkUrlAvailability } = require('./server/helper/function');
const env = process.env.NODE_ENV ? 'production' : 'development';
const config = require(`${__dirname}/./config/config.json`)[env];
const secret = config.use_env_variable && process.env[config.use_env_variable] || config;

const createLogger = () => {
  const logger = new winston.Logger({
    level: "debug"
  });
  logger.add(winston.transports.Console, toYAML());
  return logger;
};

const logger = createLogger();

const bot = new ViberBot(logger, secret);

bot.onTextMessage(/./, (message, response) => {
  checkUrlAvailability(response, message.text);
});

getPublicUrl()
  .then((url) => {
    const port = parseInt(process.env.PORT, 10) || 5000;
    http.createServer(bot.middleware()).listen(port, () => {
      bot.setWebhook(url);
      console.log('The server is running at localhost:' + port);
    });
  })
    .catch((err) => console.log('err', err));
