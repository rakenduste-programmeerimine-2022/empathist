const messages = [
  {
    username: "firstUser",
    message: "Lorem ipsum dolor sit amet, ",
    color: "is-primary",
    align: "left",
  },
  {
    username: "secondUser",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
    color: "is-info",
    align: "right",
  },
  {
    username: "thirdUser",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    color: "is-success",
    align: "left",
  },
]

const Chat = () => {
  return (
    <div>
      <div className="container is-fluid has-background-light">
        <div className="title pt-5">Chat page</div>
        <div className="columns pt-3">
          <div className="column is-half">
            <div className="box">
              <section className="hero is-halfheight">
                <div className="title">Canvas</div>
              </section>
            </div>
          </div>
          <div className="column is-half">
            <div className="box">
              <section className="hero is-halfheight">
                <section className="hero-head">
                  <div className="title">Chat</div>
                </section>
                <section className="hero-body p-2 chat mt-3">
                  {messages.map((message) => (
                    <article
                      className={`message ${message.align} ${message.color}`}
                    >
                      <div className="message-header p-2">
                        {message.username}
                      </div>
                      <div className="message-body  p-2">{message.message}</div>
                    </article>
                  ))}
                </section>
                <section className="input-field mt-4">
                  <textarea
                    className="textarea has-fixed-size"
                    placeholder="Type your message here..."
                    rows="2"
                  ></textarea>
                  <button className="button is-info mt-3">Send</button>
                </section>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Chat
