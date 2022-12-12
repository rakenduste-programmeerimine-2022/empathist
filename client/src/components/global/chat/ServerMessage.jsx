

const style = {
    position: "fixed",
    opacity: 0,
    userSelect: "none",
    animation: "fadeInOut 8s ease-in-out"
}
const ServerMessage = ({messages}) => {

    return (
        <article style={style} className={"message is-primary is-info is-ghost is-light is-size-7"}>
            <div className="message-body">
                {`Server: ${messages?.at(-1)?.content}`}
            </div>
        </article>
    )
}

export default ServerMessage