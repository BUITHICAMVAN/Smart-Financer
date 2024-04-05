const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('smartfinancer', 'postgres', '0812', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: false, 
});

sequelize.authenticate()
  .then(() => console.log('Database connected.'))
  .catch(err => console.error('Unable to connect to the database:', err));
  
module.exports = sequelize;
