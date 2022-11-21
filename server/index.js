const express = require('express')
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose");
const app = express()
const expressWs = require('express-ws')(app)
const errorMiddleware = require('./middlewares/error-middleware')
require('dotenv').config()
const user = require('./routes/user-routes')



const PORT = process.env.PORT || 5000

app.use(morgan('dev'))
app.use(express.json())
app.use(cors({
    credentials:true,
    origin: process.env.CLIENT_URL
}))
app.use(cookieParser())
app.use('/user',user)

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

let defaultMessage = {
    username:"Server",
    sendedAt: new Date(),
}

let bannedNames = ["server","admin","moderator"]

let privateRooms = []

let rooms = [
    {id:1, name:"Room 1", messages:[{...defaultMessage, content: "Welcome to room #1"}],users:[],type:"public",creator:"server"},
    {id:2, name:"Room 2", messages:[{...defaultMessage, content: "Welcome to room #2"}],users:[],type:"public",creator:"server"},
    {id:3, name:"Room 3", messages:[{...defaultMessage, content: "Welcome to room #3"}],users:[],type:"public",creator:"server"},
]

let activeUsers = []


setInterval(handleDisconnect,10000)

function handleDisconnect() {
    activeUsers = []
    expressWs.getWss().clients.forEach(client => {
        if (client.username && client.connected) {
            activeUsers.push(client.username)
        }
    })

    console.log(`activeUsers: ${activeUsers.length?activeUsers:"none"}`)
    rooms = rooms.map(room=>room.users.length?{...room,users:[...room.users.filter(user=>activeUsers.includes(user))]}:room)

}

function broadcast(roomID){
    roomID = parseInt(roomID)
    expressWs.getWss().clients.forEach(client => {
        console.log(`Checking ${client.username} in room ${client.roomID}`)
        console.log(`private: ${privateRooms}`)
        if(client.roomID===roomID){
            console.log(`Broadcasting to ${client.username} in room ${client.roomID}`)
            const room = rooms.find(item=>item.id===roomID)
            client.send(JSON.stringify({
                event: "chatUpdate",
                roomID: room.id,
                room: room.name,
                users: room.users,
                messages: room.messages
            }))
        }
    })
}



function checkUsername(username){
    if (bannedNames.includes(username.toLowerCase())){
        console.log(`User ${username} is banned`)
        return false
    }
    return !activeUsers.includes(username);

}

function enterRoomHandler(ws,roomID){
    roomID = parseInt(roomID)
    let room = rooms.find(item=>item.id===roomID)
    if(room){
        rooms = rooms.map(room=>room.id===roomID?{...room,users: [...room.users,ws.username]}:room)
        try {
            ws.roomID = roomID
            console.log(`User ${ws.username} entered room ${ws.roomID}`)
            return true
        }
        catch (e) {
            console.log(e)
            return false
        }
    }
    return false
}

function exitRoom(roomID,username){
    let room = rooms.find(item=>item.id===roomID)
    if(room){
        rooms = rooms.map(room=>room.id===roomID?{...room,users:[...room.users.filter(user=>user!==username)]}:room)
        return true
    }
    return false
}

function saveMessage(message,roomID){
    let room = rooms.find(item=>item.id===roomID)
    if(room){
        rooms = rooms.map(room=>room.id===roomID? {...room,messages: [...room.messages,message]}:room)
        return true
    }
    return false
}

function connectUser(ws,message){
    try {
        const isValidUsername = checkUsername(message.username)
        if (isValidUsername) {
            ws.id = message.id
            ws.username = message.username
            ws.connected = true
            ws.createdRooms = []
            return true
        }
        return false
    }
    catch (e) {
        console.log(e)
        return false
    }
}

function createRoom(ws,name,type){
    try {
        let room = {
            id:  Math.floor(Math.random() * Math.floor(Math.random() * new Date().getTime())),
            name:name,
            messages: [{...defaultMessage,
                content: `Welcome to room ${name} created by ${ws.username}`}],
            users: [ws.username],
            type:type,
            creator: ws.username}
            rooms.push(room)
        ws.createdRooms.push(room.id)
        return true
    }
    catch (e) {
        console.log(e)
        return false
    }
}

const mapRooms = (ws) => rooms
    .filter(room=>room.type==="public"||ws.createdRooms.includes(room.id))
    .map(room=>({
        id:room.id,
        users:room.users.length,
        name:room.name,
        type:room.type
    }))

app.use(cors())
app.use(express.json())
app.ws('/chat', (ws, req) => {
    ws.connected = false
    console.log("New page opened")
    ws.on('message', msg => {
        if (msg) {
            let message = JSON.parse(msg)
            console.log(`event: ${message.event} from ${ws.username}`)
            if (message.event === "message") {
                const newMessage = {...message, sendedAt: new Date()}
                if (ws.connected) {
                    const saved = saveMessage(newMessage, ws.roomID)
                    if (saved) {
                        broadcast(message.roomID)
                    }
                } else {
                    ws.send(JSON.stringify({event: "error", message: "You are not connected"}))
                }
                console.log(msg)
            }

            if (message.event === "enter") {
                const entered = enterRoomHandler(ws, message.roomID)
                if (entered) {
                    const saved = saveMessage({
                            username: "Server",
                            sendedAt: new Date(),
                            content: `User ${ws.username} has entered`
                        },
                        ws.roomID)
                    if (saved) {
                        ws.send(JSON.stringify({
                            event: "entered",
                            content: `Entered room ${message.roomID}`,
                            roomID: message.roomID
                        }))
                        broadcast(ws.roomID)

                    } else {
                        ws.send(JSON.stringify({event: "error", content: `Room ${message.roomID} not found`}))
                    }
                }
            }
            if (message.event === "connect") {
                console.log(`${message.username} is trying to connect`)
                const connected = connectUser(ws, message)
                if (connected) {
                    console.log(`${message.username} is connected`)
                    ws.send(JSON.stringify({
                        event: "connected",
                        content: `${message.username} is connected`,
                        user: {id: ws.id, username: ws.username, connected: ws.connected},
                        rooms: mapRooms(ws)
                    }))
                } else {
                    console.log(`${message.username} is not connected`)
                    ws.send(JSON.stringify({event: "error", content: "Connection error: username is not valid or already taken"}))
                }
            }
            if (message.event === "exit") {
                const exited = exitRoom(ws.roomID,ws.username)
                if (exited) {
                    ws.roomID = null
                    const saved = saveMessage({
                            username: "Server",
                            sendedAt: new Date(),
                            content: `User ${ws.username} has exited`
                        },
                        message.roomID)
                    if (saved) {
                        ws.send(JSON.stringify({
                            event: "exited",
                            content: `Exited room ${message.roomID}`,
                            rooms: mapRooms(ws)
                        }))
                        broadcast(message.roomID)
                    } else {
                        ws.send(JSON.stringify({event: "error", content: `Room ${message.roomID} not found`}))
                    }
                }else {
                    ws.send(JSON.stringify({event: "error", content: `Could not exit room ${message.roomID}`}))
                }
            }
            if (message.event === "createRoom") {
                const created = createRoom(ws,message.roomName,message.roomType)
                if (created) {
                    ws.send(JSON.stringify({
                        event: "roomCreated",
                        content: `Created room ${message.roomName}`,
                        createdRoomId: ws.createdRooms[ws.createdRooms.length-1],
                        rooms: mapRooms(ws)
                    }))
                } else {
                    ws.send(JSON.stringify({event: "error", content: `Could not create room ${message.name}`}))
                }
            }

        }
        else {
            console.log("No message")
            ws.send(JSON.stringify({event: "error", content: "Empty message"}))
        }
    })

})



app.listen(PORT,()=>console.log(`Server started on PORT: ${PORT}`))