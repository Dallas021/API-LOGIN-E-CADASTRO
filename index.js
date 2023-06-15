const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()
const public = require('./Rotas/Rotas Publicas/Public')
const private = require('./Rotas/Rotas privadas/Private')

//Configuração
    //Middleware
        //Express.JSON
        app.use(express.json())
        //Cors
        app.use(cors())
        //bodyparser
        app.use(bodyparser.urlencoded({extended: true}))    
    // Rota
        //Rota Publica
        app.use(public)
        //Rota Privada
        app.use(private)

    //Mongoose
    mongoose.connect("mongodb://127.0.0.1:27017/meusite" , {
        useNewUrlParser: true,
        useUniFiedTopology: true
    }).then(() => {
        console.log("Conectado com sucesso ao banco de dados")
    }).catch((err) => {
        console.log("Erro ao se conectar ao banco de dados: "+err)
    })
    //Servidor online
    app.listen(8081, () => {
        console.log("Servidor online")
    })