const databaseConfig = require('../config/knexfile');
var knex = require('knex')(databaseConfig);

exports.all = (req, res) => {
  knex('products')
    .select()
    .then(products => {
      if (products.length == 0) {
        res.status(401).json('Нет товаров');
      } else {
        res.send({
          count: products.length
        });
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    });
};