const ViberBot = require('viber-bot').Bot;
const { checkUrlAvailability, getPublicUrl } = require('./function');
const { secret } = require('./../../config/config.env');
const logger = require('./logger');

const bot = new ViberBot(logger, secret);

bot.onTextMessage(/./, (message, response) => {
  checkUrlAvailability(response, message.text);
});

getPublicUrl()
  .then((url) => bot.setWebhook(url))
    .catch((err) => console.log('err', err));

module.exports = bot;
