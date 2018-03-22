const env = process.env.NODE_ENV ? 'production' : 'development';
const config = require('./config.json')[env];
const secret = config.use_env_variable && process.env[config.use_env_variable] || config;

module.exports = {
  secret
};
