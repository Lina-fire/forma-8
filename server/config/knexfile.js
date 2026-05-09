const path = require('path');
require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'Polina@12121020',
      database: process.env.DB_NAME || 'forma8_db'
    },
    migrations: {
      directory: path.join(__dirname, '../migrations')
    },
    seeds: {
      directory: path.join(__dirname, '../seeds')
    }
  }
};