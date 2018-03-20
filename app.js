const http = require('http');
const { getPublicUrl } = require('./server/helper/function');
const { bot } = require('./server/helper/bot');

getPublicUrl()
  .then((url) => {
    const port = parseInt(process.env.PORT, 10) || 5000;
    http.createServer(bot.middleware()).listen(port, () => {
      bot.setWebhook(url);
      console.log('The server is running at localhost:' + port);
    });
  })
    .catch((err) => console.log('err', err));
