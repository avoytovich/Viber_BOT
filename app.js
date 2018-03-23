const http = require('http');
const { getPublicUrl } = require('./server/helper/function');
const bot = require('./server/helper/bot');
const { message } = require('./server/helper/message');

getPublicUrl()
  .then((url) => {
    const port = parseInt(process.env.PORT, 10) || 5000;
    bot.setWebhook(url);
    http.createServer(bot.middleware()).listen(port, () => console.log(message.server_running + port));
  })
    .catch((err) => console.log('err', err));
