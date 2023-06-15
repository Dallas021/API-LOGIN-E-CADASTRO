const express = require('express')
const public  = express.Router()

public.get("/" , (req, res) => {
    res.status(200).json({msg: "Rota publica funcionando"})
})

module.exports = public 