const options = {
  hostname: '127.0.0.1',
  port: 4040,
  path: '/api/tunnels',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
};

module.exports = {
  options
};
