const http = require('http');
const { bot, getPublicUrl, checkUrlAvailability, createLogger } = require('./server/helper/function');

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
