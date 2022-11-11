const express = require('express')
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express()
const WSServer = require('express-ws')(app)
const errorMiddleware = require('./middlewares/error-middleware')
require('dotenv').config()
const user = require('./routes/user-routes')
//const chat = require('./routes/chat-routes')


const PORT = process.env.PORT || 5000

app.use(morgan('dev'))
app.use(cors({
    credentials:true,
    origin: process.env.CLIENT_URL
}))

app.use('/user',user)
//app.use('/chat',chat)

app.get('*', (req, res) => {
    res.send(`<h1>There's definitely something interesting around here, just keep looking...</h1>`)
})

app.use(errorMiddleware)

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@empathist.epepriy.mongodb.net/?retryWrites=true&w=majority`
const connectToDB = async () => {
    try{
        await mongoose.connect(uri)
        console.log('Database connection established')
    }catch (err){
        console.log(err)
    }
}

connectToDB()

app.listen(PORT,()=>console.log(`Server started on PORT: ${PORT}`))