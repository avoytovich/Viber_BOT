const http = require("http");
const request = require('request');
const TextMessage = require('viber-bot').Message.Text;
const { message, reqExp } = require('./message');
const { options } = require('./constant');


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

    if (!error && requestResponse.statusCode === 200) {
      if (body.search('is up') !== -1) {
        say(botResponse, `Hooray! ${urlToCheck}. looks good to me.`);
      } else if (body.search('Huh') !== -1) {
        say(botResponse, `Hmmmmm ${urlToCheck}. does not look like a website to me.`);
      } else if (body.search('down from here') !== -1) {
        say(botResponse, `Oh no! ${urlToCheck}. is broken.`);
      } else {
        say(botResponse, message.somethingWrong);
      }
    }
  })
};

const getPublicUrl = () => {

  return new Promise((resolve, reject) => {

    const req = http.request(options, (res) => {
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
  checkUrlAvailability,
  getPublicUrl
};
