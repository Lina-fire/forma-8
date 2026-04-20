const databaseConfig = require('../config/knexfile');
var knex = require('knex')(databaseConfig);

exports.add = (req, res) => {
  const { name, description, price, size, color, material, image } = req.body;
  
  knex('products')
    .insert({ name, description, price, size, color, material, image })
    .then(product => {
      res.status(200).send({
        message: 'Товар успешно добавлен',
        product
      });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    });
};