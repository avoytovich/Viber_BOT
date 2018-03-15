const http = require('http');
const ViberBot = require('viber-bot').Bot;
const { getPublicUrl, checkUrlAvailability, createLogger } = require('./server/helper/function');
const { secret } = require('./config/config.env');

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
