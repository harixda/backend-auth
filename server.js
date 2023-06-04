const express = require("express");
const router = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const asyncHandler = require("express-async-handler")
const Register = require("./model/registerModel");
// const auth = require('./auth.js');
require("dotenv").config();


mongoose.connect(process.env.CONNECTION_STRING)
    .then((res) => {
        console.log("connected to db", res.connection.host, res.connection.name)
    }).catch((err) => {
        console.log(err)
        process.exit(1)
    })

const app = express(
);
app.use(cors())
app.use(express.json())
app.use(router)

app.post("/register", asyncHandler(async (req, res, next) => {
    console.log(req.body)
    const { name, email, password } = req.body
    console.log(name, email, password)
    if (!name || !email || !password) {
        throw new Error("all fields are required")
    }
    const user = await Register.create({
        name,
        email,
        password
    })
    res.json({ user })
    res.json({ name, email, password })
    next()
}))

app.post("/login", asyncHandler(async (req, res, next) => {
    console.log(req.body)
    const { email, password } = req.body
    console.log(email, password)
    if (!email || !password) {
        throw new Error("all fields are required")
    }
    const user = await Register.findOne({ email })
    if (!user) {
        throw new Error("not exists")
    }
    const token = jwt.sign({ email }, 'secret')
    res.cookie("token", token, {
        httpOnly: true
    })
    res.json({ email })
    console.log(token)
    next()
}))

app.post("/verify", asyncHandler(async (req, res, next) => {
    console.log(req.body)
    const { token } = req.body
    if (!token) {
        res.status(401);
        throw new Error("no token")
    }
    const decoded = jwt.verify(token, 'secret')
    res.json({ decoded })
    next()
}))


//dynamic server
const port = 1337;
app.listen(port, () => {
    console.log(`Server running on ${port}`)
})
