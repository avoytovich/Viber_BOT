const ViberBot = require('viber-bot').Bot;
const { checkUrlAvailability } = require('./function');
const { secret } = require('./../../config/config.env');
const { logger } = require('./logger');

const bot = new ViberBot(logger, secret);

bot.onTextMessage(/./, (message, response) => {
  checkUrlAvailability(response, message.text);
});

module.exports.bot = bot;
