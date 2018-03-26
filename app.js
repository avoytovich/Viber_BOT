const http = require('http');
const Bot = require('./server/helper/bot');
const { secret } = require('./config/config.env');
const logger = require('./server/helper/logger');
const { message } = require('./server/helper/message');

const bot = new Bot(logger, secret);

bot.onTextMessage(/./, (message, response) => {
  Bot.checkUrlAvailability(response, message.text);
});

bot.getPublicUrl()
  .then((url) => bot.setWebhook(url))
  .catch((err) => console.log('err', err));

const port = parseInt(process.env.PORT, 10) || 5000;
http.createServer(bot.middleware()).listen(port, () => console.log(message.server_running + port));
