import {useChatStore} from "../../store/chatStore";
import {useEffect, useState} from "react";
import './MessageInput.css';

export const MessageInput = ({setScrollAtNext}) => {

    const messageToEditID = useChatStore(state => state.messageToEditID)
    const handleSendEditMessage = useChatStore(state => state.handleSendEditMessage)
    const isMessageEditorOpen = useChatStore(state => state.isMessageEditorOpen)
    const [isError,setIsError] = useState(false)
    const [message, setMessage] = useState("")
    const sendMessage = useChatStore((state) => state.sendMessage)
    const handleChange = (e) => {
        setMessage(e.target.value)
    }
    const handleMessageSubmit =  () => {
        if(isMessageEditorOpen) {
            handleSendEditMessage(message)
            setMessage("")
        }else if (message.length) {
            sendMessage(message)
            setMessage("")
            setIsError(false)
            setScrollAtNext(true)
        } else {
            console.log("Message is too short")
            setIsError(true)
        }
    }

    useEffect(() => {
        if (isMessageEditorOpen) {
            setMessage(messageToEditID)
        }
    },[isMessageEditorOpen])
    return (
    <section className="input-field mt-4">
        {isMessageEditorOpen&&
            <div className="stage">
                <div className="dot-flashing"></div>
            </div>
        }
        <textarea
            className={isError ? "textarea has-fixed-size is-danger" : isMessageEditorOpen?"textarea has-fixed-size is-warning":"textarea has-fixed-size"}
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
    )
}