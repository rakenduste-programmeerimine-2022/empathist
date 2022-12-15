import create from "zustand";
import {useNavbarStore, useUserStore} from "./store";

const defaultMessages = [
    {
        username: "firstUser",
        content: "Lorem ipsum dolor sit amet, ",
        sentAt: "2021-05-01T12:00:00.000Z",
    },
    {
        username: "secondUser",
        content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
        sentAt: "2021-05-01T12:00:12.000Z",
    },
    {
        username: "thirdUser",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        sentAt: "2021-05-01T12:00:24.000Z",
    },
]
export const useChatStore = create((set,get) => ({
    socket: null,
    messages: defaultMessages,
    serverMessages: [],
    rooms: [],
    isNewMessageInChat: false,
    roomID: null,
    roomName: null,
    users: null,
    messageToEditID: null,
    isMessageEditorOpen: false,

    setUsers: (users) => set(() => ({ users: users })),
    setRoomID: (value) => set(() => ({ roomID: value })),
    setRoomName: (value) => set(() => ({ roomName: value })),
    setMessages: (messages) => set(() => ({ messages: messages })),
    setServerMessages: (messages) => set(() => ({ serverMessages: messages })),
    setRooms: (rooms) => set(() => ({ rooms: rooms })),
    setSocket: (socket) => set(() => ({ socket: socket })),
    setIsNewMessageInChat: (value) => set(() => ({ isNewMessageInChat: value })),
    enterRoom: (roomID) => {
        console.log(`Trying to enter room ${roomID}`)
        get().socket.send(JSON.stringify({event: "enter", roomID}))
    },
    exitRoom: async () => {
        console.log(`Trying to exit room ${get().roomID}`)
        get().setIsNewMessageInChat(false)
        await get().socket.send(JSON.stringify({event: "exit"}))
    },
    sendMessage:(message) => {
        console.log(`Trying to send message ${message}`)
        get().socket.send(JSON.stringify({event: "message", content: message}))
    },
    handleOpenMessageEditor: (messageID) => {
        set(() => ({ messageToEditID: messageID }))
        set(() => ({ isMessageEditorOpen: true }))
    },
    handleSendEditMessage: (newMessage) => {
        console.log(`Trying to edit message ${get().messageToEditID} to ${newMessage}`)
        set(() => ({ isMessageEditorOpen: false }))
        get().socket.send(JSON.stringify({event: "edit", edit :{oldMessageID: get().messageToEditID, newMessage: newMessage}}))
    },

    setListeners: () => {
        const socket = get().socket
        const user = useUserStore.getState().user
        socket.onopen = (e) => {
            if (user.id && user.username) {
                console.log(`Trying to connect as ${user.username}`)
                socket.send(
                    JSON.stringify({
                        id: user.id,
                        username: user.username,
                        event: "connect",
                    })
                )
            }
            if (user.username && !user.id) {
                socket.send(
                    JSON.stringify({
                        username: user.username,
                        event: "connect",
                    })
                )
            }
            if (!user.username && !user.id) {
                console.log("Log in to connect to chat")
                useNavbarStore.getState().setIsEnterNameOpen(true)
            }
        }
        get().socket.onmessage = (e) => {
            const data = JSON.parse(e.data)
            switch (data.event) {
                case "chatUpdate":
                    get().setMessages(data.messages)
                    if (data.serverMessages!==get().serverMessages) {
                        get().setServerMessages(data.serverMessages)
                    }
                    get().setRooms(data.rooms)
                    if(data.messages.length > 3) {
                        get().setIsNewMessageInChat(true)
                    }
                    break
                case "connected":
                    console.log(data.content)
                    get().setRooms(data.rooms)
                    console.log(`Connected as ${user.username}`)
                    useNavbarStore.getState().setGlobalNotification("Connected to chat service")
                    useNavbarStore.getState().setIsEnterNameOpen(false)
                    break
                case "entered":
                    console.log(data.content)
                    get().setRoomName(data.roomName)
                    get().setRoomID(data.roomID)
                    break
                case "exited":
                    console.log(data.content)
                    get().setRoomName(null)
                    get().setRooms(data.rooms)
                    break
                case "usersUpdate":
                    get().setUsers(data.users)
                    break
                case "error":
                    console.log(`error: ${data.content}`)
                    if (data.type === "connectionError") {
                        console.error(data)
                    }
                    useNavbarStore.getState().setGlobalNotification(data.content)
                    break
                case "roomCreated":
                    console.log(data)
                    break
                case "roomDeleted":
                    console.log(data)
                    break
                case "roomUpdated":
                    console.log(data)
                    break
                default:
                    break
            }
        }
        socket.onclose = (e) => {
            useNavbarStore.getState().setGlobalNotification("Connection to chat service lost")
            console.log("Disconnected from chat service")
        }
    }
}));

