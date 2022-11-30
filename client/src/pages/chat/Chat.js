import { useState, useEffect } from "react"
import FindChat from "./FindChat"
import { useNavbarStore, useUserStore } from "../../store/store"

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

const Chat = () => {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState(defaultMessages)
  const [rooms, setRooms] = useState([])
  const [roomName, setRoomName] = useState("")
  const setIsEnterNameOpen = useNavbarStore((state) => state.setIsEnterNameOpen)
  const sendMessage = useUserStore((state) => state.sendMessage)
  const handleMessageSubmit = () => {
    if (message.length) {
      sendMessage(message)
      setMessage("")
    }
  }
  const user = useUserStore((state) => state.user)
  const setSocket = useUserStore((state) => state.setSocket)
  const setRoomID = useUserStore((state) => state.setRoomID)
  const roomID = useUserStore((state) => state.roomID)
  const isFindChatOpen = useNavbarStore((state) => state.isFindChatOpen)
  const enterRoom = useUserStore((state) => state.enterRoom)
  const setGlobalNotification = useNavbarStore((state) => state.setGlobalNotification)
  

  useEffect(() => {
      const socket = new WebSocket("ws://localhost:2500/chat")
      setSocket(socket)
      socket.onopen = (event) => {
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
          setIsEnterNameOpen(true)
        }
      }

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
        setGlobalNotification("Connected to chat service")
      }
      if (message.event === "error") {
        console.log(`error: ${message.content}`)
        if (message.type === "connectionError") {
          setIsEnterNameOpen(true)
        }
        setGlobalNotification(message.content)
      }
      if (message.event === "entered") {
        console.log(message.content)
        setRoomName(message.roomName)
        setRoomID(message.roomID)
      }
      if (message.event === "exited") {
        console.log(message.content)
        setRoomID(null)
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
    socket.onclose = (event) => {
        setGlobalNotification("Could not connect to chat service")
        console.log("Disconnected from chat service")
    }
    return () => socket.close()
    // eslint-disable-next-line
  }, [user])
  // const drawHandler = (x, y, color) => {
  //   ctx.beginPath();
  //   ctx.arc(x, y, 2, 0, 2 * Math.PI);
  //   ctx.fillStyle = color;
  //   ctx.fill();
  // }

  if (roomID) {
    return (
      <div>
        <div className="container is-fluid">
          <div className="title pt-5">Chat page</div>
          <div className="columns pt-3">
            <div className="column is-half">
              <div className="box">
                <section className="hero is-halfheight">
                  {isFindChatOpen ? <FindChat rooms={rooms} /> : <Canvas />}
                </section>
              </div>
            </div>
            <div className="column is-half">
              <div className="box chat-box">
                <section className="hero is-halfheight">
                  <section className="hero-head">
                    <div className="title">{roomName.length?roomName:"Chat"}</div>
                  </section>
                  <section className="hero-body p-2 chat mt-3">
                    {messages.map((message) => (
                      <article
                        className={`message ${
                          message.username === user.username ? "right" : "left"
                        } `}
                        key={new Date(message.sentAt).getTime()}
                        style={{backgroundColor: message.userColors?.background}}
                      >
                        <div className="message-header p-2" style={{backgroundColor:message.userColors?.header}}>
                          {message.username}
                        </div>
                        <div className="message-body  p-2" style={{color: message.userColors?.font}}>
                          {message.content}
                        </div>
                        <span className="time m-1">
                          {new Date(message.sentAt).toLocaleTimeString(
                            "en-GB"
                          )}
                        </span>
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
                      onClick={handleMessageSubmit}
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
  return <FindChat rooms={rooms} />
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
