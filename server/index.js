const express = require('express')
const app = express()
const WSServer = require('express-ws')(app)
require('dotenv').config()

const PORT = process.env.PORT || 5000

// app.ws('/',(ws,req)=>{
//
// })

app.listen(PORT,()=>console.log(`Server started on PORT: ${PORT}`))