import {useUserStore} from "../../store/store";
import {useState} from "react";
import {useChatStore} from "../../store/chatStore";

const ChatMessage = ({messages,handler,unreadMessage}) => {
    const user = useUserStore((state) => state.user)
    const isMessageEditorOpen = useChatStore(state => state.isMessageEditorOpen)

    return messages.map( message =>
    <article
        className={`message  ${
            message.username === user.username ? "right" : "left"
        } `}
        key={new Date(message.sentAt).getTime()}
        id={message.id}
        style={{
            backgroundColor: message.userColors?.background,
        }}
        onMouseEnter={(e)=>handler(e)}
    >
        <div
            id={message.id}
            className="message-header p-2"
            style={{
                backgroundColor: message.userColors?.header,
            }}
        >
            {message.username}
        </div>
        <div
            id={message.id}
            className="message-body p-2"
            style={{
                color: message.userColors?.font,
                overflowWrap: "break-word",
            }}
        >
            {message.content.split(" ")
                .map(word => word.startsWith("http") ? <a href={word} target="_blank" rel="noreferrer">{word}</a> : word)
                .reduce((prev, curr) => [prev, ' ', curr])}
        </div>
        <span className="time m-1" ref={unreadMessage} id={message.id}>
              {new Date(message.sentAt).toLocaleTimeString("en-GB")}
        </span>
    </article>
    )
}

export default ChatMessage
