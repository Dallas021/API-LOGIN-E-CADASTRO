const express = require('express')
const private = express.Router()
const mongoose = require('mongoose')
const Usuario = require('../../models/Categoria')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

private.post("/auth/register", async (req, res) => {
    const {name, email, password, confirmpassword} = req.body

    // validação
    if(!name) {
        res.status(422).json({msg: "O nome é obrigatório"})
    }
    else if(!email) {
        res.status(422).json({msg: "O email é obrigatório"})
    }
    else if(!password) {
        res.status(422).json({msg: "A senha é obrigatório"})
    }
    else if (password !== confirmpassword){
        res.status(422).json({msg: "As senhas não conferem"})
    }

    // Checar se o usuário já existe
    const usuarioExistente = await Usuario.findOne({email: email})
    if (usuarioExistente) {
       return res.status(422).json({msg: "E-mail já Cadastrado"})
    }

    //Criar senha
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    //Criar usuario
    const usuario = new Usuario({
        name,
        email,
        password: passwordHash
    })

    try {
        await usuario.save()
        res.redirect("http://localhost:3000/auth/login") 
    } catch(error) {
        console.log(error)
        res.status(500).json({msg: "Ops, aconteceu algum erro no servidor, tente novamente mais tarde!"})
    }
})

//Registro de usuário
private.post("/auth/login", async (req, res) => {
        const {email, password} = req.body

        //Valdação 
        if (!email) {
            res.status(422).json({msg: "O email é obrigatório"})
        }
        else if (!password) {
            res.status(422).json({msg: "A senha é obrigatória"})
        }

        // Checar se o usuário existe 
        const user = await Usuario.findOne({email: email})

        if(!user) {
            return (
                res.status(404).json({msg: "Usuário não encontrado"})
            )
        }
 
        //checar senha
        const checkPassword = await bcrypt.compare(password, user.password)
        if (!checkPassword) {
            return res.status(422).json({msg: "Senha incorreta"})
        }

        try {
            const secret = process.env.SECRET
            const token = jwt.sign({
                id: user._id
                }, secret
            )

            res.status(200).json({msg: "Autenticação realizada com sucesso" + token})
        } catch (err) {
            console.log(err)
            
            res.status(500).json({msg: "Ops, ocorreu um erro no servidor, tente novamente mais tarde"})
        }
    })

    private.get("/user/:id", checkToken, async (req, res) => {

        const id = req.params.id

        // Consultar se o usuário existe

        const user = await Usuario.findById(id, '-password')

        if(!user) {
            return res.status(404).json({msg: "Usuário não encontrado"})
        } 

        res.status(200).json(user)

    })

    function checkToken(req, res, next) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(" ")[1]

        if (!token) {
            return res.status(401).json({msg: "Acesso negado"})
        }

        try {
            const secret = process.env.SECRET

            jwt.verify(token, secret)

            next()
        } catch (error) {
            res.status(400).json({msg: "Token Invalido"})
        }
        
    
    }

module.exports = private 