// improtar datatypes
const {DataTypes} = require('sequelize')

// importar a conexao com o banco
const db = require('../db/conn')

// importar model de usuarios
const User = require('./User')


// criar o model
const Adress = db.define('Adress', {

    street: {   
        type: DataTypes.STRING,
        require:true,
    },

    number: {   
        type: DataTypes.STRING,
        require:true,
    },

    city: {   
        type: DataTypes.STRING,
        require:true,
    },

})

// relacionamneto entre models

// dizer q user pertence a um addres
User.hasMany(Adress)
// dizendo q umpertence ao outro
Adress.belongsTo(User)

// exportar o model
module.exports = Adress