import { useState, useEffect, useRef } from "react"
import FindChat from "./FindChat"
import { useNavbarStore, useUserStore } from "../../store/store"
import { NewMessageInChat } from "../../components/global/chat/NewMessageInChat"
import Canvas from "../canvas/Canvas"
import ChatMessageContextMenu from "./ChatMessageContextMenu";
import {useChatStore} from "../../store/chatStore";
import ServerMessage from "../../components/global/chat/ServerMessage";

const Chat = () => {
  const [message, setMessage] = useState("")
  const sendMessage = useChatStore((state) => state.sendMessage)
  const user = useUserStore((state) => state.user)
  const roomID = useChatStore((state) => state.roomID)
  const isFindChatOpen = useNavbarStore((state) => state.isFindChatOpen)
  const messages = useChatStore((state) => state.messages)
  const serverMessages = useChatStore((state) => state.serverMessages)
  const [lastServerMessage, setLastServerMessage] = useState(null)
  const rooms = useChatStore((state) => state.rooms)
  const isNewMessageInChat = useChatStore((state) => state.isNewMessageInChat)
  const setIsNewMessageInChat = useChatStore((state) => state.setIsNewMessageInChat)
  const roomName = useChatStore((state) => state.roomName)
  const [isOpenMessageContextMenu,setIsOpenMessageContextMenu] = useState(false)
  const [messageContextMenuPosition,setMessageContextMenuPosition] = useState({x:0,y:0})
  const unreadMessage = useRef(null)
  const [isError,setIsError] = useState(false)
  const [scrollAtNext,setScrollAtNext] = useState(false)
  const [isNewServerMessage,setIsNewServerMessage] = useState(false)

  const handleMessageSubmit =  () => {
    if (message.length) {
      sendMessage(message)
      setMessage("")
      setIsError(false)
      setScrollAtNext(true)
    } else {
      console.log("Message is too short")
      setIsError(true)
    }

  }
  const handleScrollToNewMessage = () => {
    unreadMessage.current.scrollIntoView({behavior: "smooth"})
    setIsNewMessageInChat(false)
  }

  useEffect(() => {
    if(scrollAtNext){
        handleScrollToNewMessage()
        setScrollAtNext(false)
    }
  }, [messages])

  useEffect(() => {
    if(serverMessages[serverMessages.length - 1] !== lastServerMessage) {
      setIsNewServerMessage(true)
      setLastServerMessage(serverMessages[serverMessages.length - 1])
      const timeout = setTimeout(() => {
        setIsNewServerMessage(false)
      }, 8000)
      return () => clearTimeout(timeout)
    }
  }, [serverMessages])


  const handleChatMessageContextMenu = (e) => {
    if (isOpenMessageContextMenu) {
        setIsOpenMessageContextMenu(false)
    }
    if (!isOpenMessageContextMenu) {
      setMessageContextMenuPosition({x: e.target.offsetLeft , y: e.pageY - e.target.offsetHeight})
      setIsOpenMessageContextMenu(true)
    }
  }

  if (roomID) {
    return (
      <div>
        <div className="container is-fluid" >
          <div className="title pt-5">Chat page</div>
          <div className="columns pt-3 ">
            <div className="column is-half canvas-column">
              <div className="box">
                {isFindChatOpen ? <FindChat rooms={rooms} /> : <Canvas />}
              </div>
            </div>
            <div className="column is-half">
              <div className="box chat-box"  >
                <section className="hero is-halfheight">
                  <section className="hero-head">
                    <div className="title">
                      {roomName?.length ? roomName : "Chat"}
                    </div>
                  </section>
                  {isOpenMessageContextMenu&&<ChatMessageContextMenu position={messageContextMenuPosition} isActive={setIsOpenMessageContextMenu} />}
                  <section className="hero-body p-2 chat mt-3" onClick={()=>setIsOpenMessageContextMenu(false)}>
                    {isNewServerMessage&&<ServerMessage messages={serverMessages}/>}
                    {isNewMessageInChat && (
                      <NewMessageInChat
                        handleScrollToNewMessage={handleScrollToNewMessage}
                      />
                    )}
                    {messages.length
                        ?(messages.map((message) =>
                          <article
                            className={`message chat-element ${
                              message.username === user.username ? "right" : "left"
                            } `}
                            key={new Date(message.sentAt).getTime()}
                            style={{
                              backgroundColor: message.userColors?.background,
                            }}
                            onMouseEnter={(e)=>handleChatMessageContextMenu(e)}
                          >
                            <div
                              className="message-header p-2"
                              style={{
                                backgroundColor: message.userColors?.header,
                              }}
                            >
                              {message.username}
                            </div>
                            <div
                              className="message-body  p-2"
                              style={{ color: message.userColors?.font }}
                            >
                              {message.content}
                            </div>
                            <span className="time m-1" ref={unreadMessage}>
                              {new Date(message.sentAt).toLocaleTimeString("en-GB")}
                            </span>
                          </article>
                        ))
                        :<div className="notification is-empty">No messages found</div>
                    }
                  </section>
                  <section className="input-field mt-4">
                    <textarea
                      className={isError ? "textarea has-fixed-size is-danger" : "textarea has-fixed-size"}
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
