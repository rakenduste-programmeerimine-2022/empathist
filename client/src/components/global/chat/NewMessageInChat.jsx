import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMessage} from "@fortawesome/free-solid-svg-icons";

const style = {
    position: "fixed",
    cursor: "pointer",
}
export const NewMessageInChat = ({handleScrollToNewMessage}) => {

    return (
        <span
            className="icon-text has-text-info-dark right mr-6"
            style={style}
            onClick={handleScrollToNewMessage}>
            <span className="icon">
                <FontAwesomeIcon icon={faMessage} />
            </span>
        <span>New Message in chat</span>
    </span>
    )
}