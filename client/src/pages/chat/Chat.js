import { useState,useEffect } from "react"
import FindChat from "./FindChat"
import {useNavbarStore, useUserStore} from "../../store/store"

const defaultMessages = [
  {
    username: "firstUser",
    content: "Lorem ipsum dolor sit amet, ",
  },
  {
    username: "secondUser",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
  },
  {
    username: "thirdUser",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  },
]

const Chat = () => {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState(defaultMessages)
  const [rooms, setRooms] = useState([])
  const handleMessageSubmit = (e) => {
    console.log(message)
  }
  const user = useUserStore((state) => state.user)
  const setSocket = useUserStore((state) => state.setSocket)
  const setUser = useUserStore((state) => state.setUser)
  const isFindChatOpen = useNavbarStore((state) => state.isFindChatOpen)
  const socket = useUserStore((state) => state.socket)
  const enterRoom = useUserStore((state) => state.enterRoom)

  useEffect(() => {
    if (user.id || user.username) {
      const newSocket = new WebSocket('ws://localhost:2500/chat');
      setSocket(newSocket)
      newSocket.onopen = (event) => {
        if (user.id || user.username) {
          console.log(`Trying to connect as ${user.username}`)
          socket.send(JSON.stringify( {
            id: user.id,
            username: user.username,
            event: "connect"
          }))
        } else {
          console.log("Log in to connect to chat")
          //Here we can redirect to login/set name page
        }
      }
    }
    // eslint-disable-next-line
  }, [user.id, user.username])

  if (socket){
    socket.onmessage = (event) => {
      let message = JSON.parse(event.data)
      console.log(`event: ${message.event}`)
      if (message.event === "chatUpdate") {
        setMessages(message.messages)
        setRooms(message.rooms)
      }
      if (message.event === "connected") {
        console.log(message.content)
        setRooms(message.rooms)
        console.log(`Connected as ${user.username}`)
      }
      if (message.event === "error") {
        console.log(`error: ${message.content}`)
      }
      if (message.event === "entered") {
        console.log(message.content)
        setUser({...user,roomID:message.roomID})
      }
      if (message.event === "exited") {
        console.log(message.content)
        user.roomID = null
        setRooms(message.rooms)
      }
      if (message.event === "roomCreated") {
        console.log(message.content)
        enterRoom(message.createdRoomId)
      }
      if (message.event === "roomDeleted") {
        console.log(message.content)
        setRooms(message.rooms)
      }
      if (message.event === "roomUpdated") {
        console.log(message.content)
        setRooms(message.rooms)
      }
      if (message.event === "updateCanvas") {
        //drawHandler(message.x, message.y, message.color)
      }
    }
  }

  // const drawHandler = (x, y, color) => {
  //   ctx.beginPath();
  //   ctx.arc(x, y, 2, 0, 2 * Math.PI);
  //   ctx.fillStyle = color;
  //   ctx.fill();
  // }


  if (user.roomID) {
    return (
        <div>
          <div className="container is-fluid">
            <div className="title pt-5">Chat page</div>
            <div className="columns pt-3">
              <div className="column is-half">
                <div className="box">
                  <section className="hero is-halfheight">
                    {isFindChatOpen ?<FindChat rooms={rooms} />:<Canvas/>}
                  </section>
                </div>
              </div>
              <div className="column is-half">
                <div className="box chat-box">
                  <section className="hero is-halfheight">
                    <section className="hero-head">
                      <div className="title">Chat</div>
                    </section>
                    <section className="hero-body p-2 chat mt-3">
                      {messages.map((message) => (
                          <article
                              className={`message ${message.username===user.username?"right":"left"} is-primary`}
                              key={message.sendedAt}
                          >
                            <div className="message-header p-2">
                              {message.username}
                            </div>
                            <div className="message-body  p-2">{message.content}</div>
                          </article>
                      ))}
                    </section>
                    <section className="input-field mt-4">
                  <textarea
                      className="textarea has-fixed-size"
                      placeholder="Type your message here..."
                      rows="2"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                      <button
                          className="button is-info mt-3"
                          onClick={(e) => handleMessageSubmit(e)}
                      >
                        Send
                      </button>
                    </section>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
  }
    return (
        <FindChat rooms={rooms}/>
    )
}
export default Chat

const Canvas = () => {
  return (
    <>
      <section className="hero-head">
        <div className="title">Canvas</div>
      </section>
    </>
  )
}
