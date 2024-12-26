// importar sequelize
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('nodesequelize' , 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})



// exportar
module.exports = sequelize