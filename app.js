const http = require('http');
const bot = require('./server/helper/bots');
const { message } = require('./server/helper/message');

const port = parseInt(process.env.PORT, 10) || 5000;
http.createServer(bot.middleware())
  .listen(port, () => console.log(message.server_running + port));
