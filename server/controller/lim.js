const databaseConfig = require('../config/knexfile');
var knex = require('knex')(databaseConfig);

exports.lim = (req, res) => {
  const offset = parseInt(req.query.offset);
  const limit = parseInt(req.query.limit);

  knex('products')
    .select()
    .limit(limit)
    .offset(offset)
    .then(products => {
      if (products.length == 0) {
        res.status(401).json('Нет товаров');
      } else {
        res.status(200).send({
          products
        });
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    });
};