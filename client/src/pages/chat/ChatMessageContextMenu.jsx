import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faReply,faTrash,faPen,faCheck,faFaceSmile } from '@fortawesome/free-solid-svg-icons'

import {useEffect} from "react";
import {useChatStore} from "../../store/chatStore";

const options = [
    {id:1,name:"Reply",icon:faReply,action:"reply"},
    {id:2,name:"React",icon:faFaceSmile,action:"react"},
    {id:3,name:"Select",icon:faCheck,action:"select"},
    {id:4,name:"Edit",icon:faPen,action:"edit"},
    {id:5,name:"Delete",icon:faTrash,action:"delete"},
]

const ChatMessageContextMenu = ({position,isActive,targetMessage}) => {
    const handleOpenMessageEditor = useChatStore(state => state.handleOpenMessageEditor)
    const handleClick = (action) => {
        console.log(action)
        switch (action) {
            case "reply":
                console.log("reply")
                break;
            case "react":
                console.log("react")
                break;
            case "select":
                console.log("select")
                break;
            case "edit":
                handleOpenMessageEditor(targetMessage)
                console.log("edit",targetMessage)
                break;
            case "delete":
                console.log("delete")
                break;
            default:
                console.log("No action found")
        }
        isActive(false)
    }

    useEffect(() => {
        console.log(targetMessage)
    },[targetMessage])

    return (
        <div onMouseLeave={()=>isActive(false)} className="chat-message-context-menu-container is-flex-direction-row has-background-white"
        style={{position:"absolute",top:position.y,left:position.x}}>
            {options.map((option)=>{
                return (
                    <div key={option.id} onClick={()=>handleClick(option.action)} className="chat-message-context-menu-option">
                        <span className="icon">
                            <FontAwesomeIcon icon={option.icon} />
                        </span>
                        <span>{option.name}</span>
                    </div>
                )
            })}
        </div>
    )
}
export default ChatMessageContextMenu
