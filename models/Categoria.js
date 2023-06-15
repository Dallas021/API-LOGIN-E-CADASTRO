const mongoose = require("mongoose")

const Usuario = mongoose.model("Usuario" , {
    name: String,
    email: String,
    password: String
})

module.exports = Usuario 