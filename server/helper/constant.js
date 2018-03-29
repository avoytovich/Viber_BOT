const options = {
  hostname: '127.0.0.1',
  port: 4040,
  path: '/api/tunnels',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
};

const messages = {
  urlExist: 'is up',
  urlNotExist: 'Huh',
  is_broken: 'down from here',
}

module.exports = {
  options,
  messages
};
