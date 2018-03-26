const http = require('http');
const ViberBot = require('viber-bot').Bot;
const TextMessage = require('viber-bot').Message.Text;
const request = require('request');
const { message, reqExp } = require('./message');
const { options, messages } = require('./constant');

class Bot extends ViberBot {

  static say(response, message) {
      response.send(new TextMessage(message));
    };

  static checkUrlAvailability(botResponse, urlToCheck) {
    if (urlToCheck === '') {
      this.say(botResponse, message.urlCheck);
      return;
    }

    this.say(botResponse, message.oneSecond);

    const url = urlToCheck.replace(reqExp.http, '');
    request(`http://isup.me/${url}`, (error, requestResponse, body) => {
      if (error || requestResponse.statusCode !== 200) {
        this.say(botResponse, message.somethingWrong);
        return;
      }

      const phrase = ((phrase) => body.search(phrase) !== -1);

      if (!error && requestResponse.statusCode === 200) {
        switch(true) {
          case phrase(messages.urlExist):
            this.say(botResponse, `Hooray! ${urlToCheck}. looks good to me.`);
            break;
          case phrase(messages.urlNotExist):
            this.say(botResponse, `Hmmmmm ${urlToCheck}. does not look like a website to me.`);
            break;
          case phrase(messages.is_broken):
            this.say(botResponse, `Oh no! ${urlToCheck}. is broken.`);
            break;
          default:
            return this.say(botResponse, message.somethingWrong);
        }
      }
    });
  };

  getPublicUrl() {

    const opt = {
      headers: {
        'User-Agent': 'Request-Promise'
      },
      uri: 'http://127.0.0.1:4040',
      json: true
    };
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

}

module.exports = Bot;
