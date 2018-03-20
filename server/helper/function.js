const http = require("http");
const request = require('request');
const ViberBot = require('viber-bot').Bot;
const TextMessage = require('viber-bot').Message.Text;
const winston = require('winston');
const toYAML = require('winston-console-formatter');
const rp = require('request-promise');
const { message, reqExp } = require('./message');
const { options } = require('./constant');
const { secret } = require('./../../config/config.env');

const createLogger = () => {
  const logger = new winston.Logger({
    level: "debug"
  });
  logger.add(winston.transports.Console, toYAML());
  return logger;
};

const logger = createLogger();
const bot = new ViberBot(logger, secret);

const say = (response, message) => response.send(new TextMessage(message));

const checkUrlAvailability = (botResponse, urlToCheck) => {

  if (urlToCheck === '') {
    say(botResponse, message.urlCheck);
    return;
  }

  say(botResponse, message.oneSecond);

  const url = urlToCheck.replace(reqExp.http, '');
  request(`http://isup.me/${url}`, (error, requestResponse, body) => {
    if (error || requestResponse.statusCode !== 200) {
      say(botResponse, message.somethingWrong);
      return;
    }

    const phrase = ((phrase) => body.search(phrase) !== -1);

    if (!error && requestResponse.statusCode === 200) {
      switch(true) {
        case phrase('is up'):
          say(botResponse, `Hooray! ${urlToCheck}. looks good to me.`);
          break;
        case phrase('Huh'):
          say(botResponse, `Hmmmmm ${urlToCheck}. does not look like a website to me.`);
          break;
        case phrase('down from here'):
          say(botResponse, `Oh no! ${urlToCheck}. is broken.`);
          break;
        default:
          return say(botResponse, message.somethingWrong);
      }
    }
  })
};

const getPublicUrl = () => {

  const opt = {
    headers: {
      'User-Agent': 'Request-Promise'
    },
    uri: 'http://127.0.0.1:4040',
    json: true
  };

  /*return rp(opt)
    .then((data) => {
      const str = JSON.stringify(data);
      let indexStrStart = str.indexOf('URL');
      const intermediateStr = str.slice(indexStrStart);
      indexStrStart = intermediateStr.indexOf('https');
      const indexStrFinish = intermediateStr.indexOf('io');
      const majorityStr = intermediateStr.slice(indexStrStart, indexStrFinish+2);
      return majorityStr;
    })
      .catch((err) => console.log('err5', err));*/

  return new Promise((resolve, reject) => {

    const req = http.request(options, (res) => {
      console.log('res', res);
      res.setEncoding('utf8');
      res.on('data', (config) => {
        config = JSON.parse(config);
        const httpsTunnel = config.tunnels.filter(t => t.proto === 'https').pop();
        resolve(httpsTunnel.public_url);
      });
    });

    req.on('error', (e) => reject(e.message));

    req.end();

  });
};

module.exports = {
  bot,
  checkUrlAvailability,
  getPublicUrl,
  createLogger
};
