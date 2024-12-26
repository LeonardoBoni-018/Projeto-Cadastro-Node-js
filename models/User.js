// improtar datatypes
const {DataTypes} = require('sequelize')

// importar a conexao com o banco
const db = require('../db/conn')

// model
const User = db.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
        // id criado automaticamente
    },
    occupation: {
        type: DataTypes.STRING,
        required: true
    },
    newsLetter: {
        type: DataTypes.BOOLEAN,
    },
})

// exportar o model 
module.exports = User