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
const User = require("./models/user-model");

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
    sentAt: new Date(),
    type: "server-message",
    id: Math.floor(Math.random() * Math.floor(Math.random() * new Date().getTime())),
}

let bannedNames = ["server","admin","moderator"]

let rooms = [
    {id:1, name:"Room 1", messages:[],users:[],type:"public",creator:"server",serverMessages:[{...defaultMessage, content: "Welcome to room #1"}]},
    {id:2, name:"Room 2", messages:[],users:[],type:"public",creator:"server",serverMessages:[{...defaultMessage, content: "Welcome to room #1"}]},
    {id:3, name:"Room 3", messages:[],users:[],type:"public",creator:"server",serverMessages:[{...defaultMessage, content: "Welcome to room #1"}]},
]

const chatColors = [
    {header:"#c293d7",background:"#7c6da5",font:"#3d4d74"},
    {header: "#939ed7",background: "#cad6e8",font: "#212939" },
    {header: "#92b18e",background: "#cbd7a3",font: "#efefe6"},
    {header: "#e7cfd5",background: "#f6f6f2",font: "#101000"},
    {header: "#c8b5db",background: "#efe0ef",font: "#777886"},
    {header: "#cbd2ea",background: "#f0eef0",font: "#1f202f"},
    {header: "#cebd4b",background: "#d6d66f",font: "#7c7974"},
    {header: "#cac6a5",background: "#e0c8c8",font: "#10010e"},
    {header: "#dfa0df",background: "#e5bbc7",font: "#7e777a"},
    {header: "#d98197",background: "#e2a7b9",font: "#582b43"},
    {header: "#dcdc95",background: "#e2e2ae",font: "#d9b47d"},
    {header: "#483073",background: "#ae7297",font: "#acac7b"},
    {header: "#1a3080",background: "#e2e2ae",font: "#d4c066"},
    {header: "#d4c066",background: "#e2e2ae",font: "#1a3080"},
    {header: "#cab5a5",background: "#d8d8c1",font: "#180905"},
    {header: "#db85da",background: "#cab5a5",font: "#e8e8c9"},
    {header: "#559e9d",background: "#a5caba",font: "#717b78"},
    {header: "#74764c",background: "#b8b27f",font: "#000000"},
    {header: "#2bb3c8",background: "#2bc9a9",font: "#e5e5b0"},
    {header: "#a6b882",background: "#bcbf8d",font: "#f8f8f8"},
    {header: "#ccd4ea",background: "#74764c",font: "#c2a96a"},
]

let activeUsers = []

setInterval(handleDisconnect,1000)

function handleDisconnect() {
    activeUsers = []
    expressWs.getWss().clients.forEach(client => {
        if (client.username && client.connected) {
            activeUsers.push({id:client.id,username:client.username})
        }
    })
    rooms = rooms
        .map(room=>room.users.length?{...room,users:[...room.users
                .filter(user=>{
                   if (activeUsers.includes(user)){
                       return saveMessage({...defaultMessage,content:`${user.username} has disconnected`},room.id)
                   }
                })]}:room)
}

function broadcast(roomID,event){
    roomID = parseInt(roomID)
    expressWs.getWss().clients.forEach(client => {
        if(client.roomID) {
            if (client.roomID === roomID) {
                const room = rooms.find(item => item.id === roomID)
                if (event === "chatUpdate") {
                    client.send(JSON.stringify({
                        event: event,
                        roomID: room.id,
                        room: room.name,
                        users: room.users,
                        messages: room.messages,
                        serverMessages: room.serverMessages,
                        rooms: mapRooms(client),
                        roomType: room.type
                    }))
                }
            }
        }
    })
}



async function checkUsername(username, id) {
    const user = await User.findOne({username, id})
    if (user) {
        console.log(`User ${username} already exists in DB`)
        return false
    }
    if (bannedNames.includes(username.toLowerCase())) {
        console.log(`User ${username} is banned`)
        return false
    }
    activeUsers.forEach(user => {
        if (user.username === username && user.id !== id) {
            console.log(`User ${username} is already taken`)
            return false
        }
    })
    return true
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

function deleteMessage(roomID,messageID){
    let room = rooms.find(item=>item.id===roomID)
    if(room){
        rooms = rooms.map(room=>room.id===roomID? {...room,messages: [...room.messages.filter(message=>message.id!==messageID)]}:room)
        return true
    }
    return false
}

function saveMessage(message,roomID){
    let room = rooms.find(item=>item.id===roomID)
    console.log(room)
    if(room){
        switch (message.type) {
            case "user-message":
                rooms = rooms.map(room => room.id === roomID ? {...room, messages: [...room.messages, message]} : room)
                return true
            case "server-message":
                rooms = rooms.map(room => room.id === roomID ? {...room, serverMessages: [...room.serverMessages, message]} : room)
                return true
            default:
                return false
        }
    }
    return false
}

async function connectUser(ws, message) {
    if (message.id) {
        const user = await User.findOne({id: message.id})
        if (user) {
            console.log(`User ${user.username} found in DB`)
            ws.id = message.id
            ws.isRegistered = true
            ws.username = user.username
        }else {
            console.log(`User ${message.username} was not found in database`)
            return false
        }
    }else {
        console.log(`checking ${message.username}`)
        const isValidUsername = await checkUsername(message.username, message.id)
        console.log(`username is valid: ${isValidUsername}`)
        if (isValidUsername) {
            ws.id = (Math.floor(Math.random() * 100) + 1) +
                new Date().getTime() +
                (Math.floor(Math.random() * 100) + 1)
            ws.username = message.username
        }else {
            return false
        }
    }
    ws.connected = true
    ws.createdRooms = []
    ws.userColors = chatColors[Math.floor(Math.random() * chatColors.length)]
    return true

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

const saveCanvas = (roomID,canvas) => {

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
    ws.on('message', async msg => {
        if (msg) {
            let message = JSON.parse(msg)
            console.log(`event: ${message.event} from ${ws.username}`)
            if (message.event === "message") {
                const newMessage = {
                    id: Math.floor(Math.random() * Math.floor(Math.random() * new Date().getTime())),
                    content: message.content,
                    username: ws.username,
                    sentAt: new Date(),
                    type: "user-message",
                    userColors: ws.userColors
                }
                if (ws.connected) {
                    const saved = saveMessage(newMessage, ws.roomID)
                    if (saved) {
                        broadcast(ws.roomID, "chatUpdate")
                    }
                } else {
                    ws.send(JSON.stringify({event: "error", message: "You are not connected"}))
                }
                console.log(msg)
            }

            if (message.event === "enter") {
                if ((ws.username && ws.id) && ws.username !== "undefined") {
                    const entered = enterRoomHandler(ws, message.roomID)
                    if (entered) {
                        const saved = saveMessage({
                                username: "Server",
                                sentAt: new Date(),
                                content: `User ${ws.username} has entered`,
                                type: "server-message"
                            },
                            message.roomID)
                        if (saved) {
                            ws.send(JSON.stringify({
                                event: "entered",
                                content: `Entered room ${ws.roomID}`,
                                roomName: rooms.find(item => item.id === ws.roomID).name,
                                roomID: ws.roomID,
                            }))
                            broadcast(ws.roomID, "chatUpdate")

                        } else {
                            ws.send(JSON.stringify({event: "error", content: `Room ${message.roomID} not found`}))
                        }
                    }
                } else {
                    ws.send(JSON.stringify({event: "error", message: "User not found"}))
                }
            }
            if (message.event === "connect") {
                console.log(`${message.username} is trying to connect`)
                handleDisconnect()
                const connected = await connectUser(ws, message)
                console.log(`connected: ${connected}`)
                if (connected) {
                    console.log(`${message.username} is connected`)
                    if (ws.username && ws.id) {
                        ws.send(JSON.stringify({
                            event: "connected",
                            content: `${message.username} is connected`,
                            user: {id: ws.id, username: ws.username, connected: true},
                            rooms: mapRooms(ws)
                        }))
                    } else {
                        ws.send(JSON.stringify({event: "error", message: "User not defined"}))
                    }
                } else {
                    console.log(`${message.username} is not connected`)
                    ws.send(JSON.stringify({
                        event: "error",
                        type: "connectionError",
                        content: `Connection error: username '${message.username}' is not valid or already taken, try another one`
                    }))
                }
            }
            if (message.event === "exit") {
                if (ws.roomID) {
                    const exited = exitRoom(ws.roomID, ws.username)
                    if (exited) {
                        const oldRoomID = ws.roomID
                        ws.roomID = null
                        const saved = saveMessage({
                                username: "Server",
                                sentAt: new Date(),
                                content: `User ${ws.username} has exited`,
                                type: "server-message"
                            },
                            oldRoomID)
                        if (saved) {
                            ws.send(JSON.stringify({
                                event: "exited",
                                content: `Exited room ${oldRoomID}`,
                                rooms: mapRooms(ws)
                            }))
                            broadcast(oldRoomID, "chatUpdate")
                        } else {
                            ws.send(JSON.stringify({event: "error", content: `Room ${oldRoomID} not found`}))
                        }
                    } else {
                        ws.send(JSON.stringify({event: "error", content: `Could not exit room ${ws.roomID}`}))
                    }
                } else {
                    ws.send(JSON.stringify({event: "error", message: "You are not in a room"}))
                }
            }
            if (message.event === "createRoom") {
                const created = createRoom(ws, message.roomName, message.roomType)
                if (created) {
                    ws.send(JSON.stringify({
                        event: "roomCreated",
                        content: `Created room ${message.roomName}`,
                        createdRoomId: ws.createdRooms[ws.createdRooms.length - 1],
                        rooms: mapRooms(ws)
                    }))
                } else {
                    ws.send(JSON.stringify({event: "error", content: `Could not create room ${message.name}`}))
                }
            }

            if (message.event === "draw") {
                const saved = saveCanvas(ws.roomID, message.canvas)
            }

        } else {
            console.log("No message")
            ws.send(JSON.stringify({event: "error", content: "Empty message"}))
        }
    })

})



app.listen(PORT,()=>console.log(`Server started on PORT: ${PORT}`))