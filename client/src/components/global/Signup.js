import { Link } from "react-router-dom"
import { useState } from "react"

const Signup = ({ isActive, setIsActive }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")

  const handleFormSubmit = (e) => {
    e.preventDefault()
    console.log(username, password, email)
  }
  return (
    <>
      <div className={isActive ? "modal is-active" : "modal"}>
        <div className="modal-background"></div>
        <div className="modal-card px-2">
          <header className="modal-card-head">
            <p className="modal-card-title is-size-3">Sign up</p>
            <button
              className="delete"
              aria-label="close"
              onClick={() => setIsActive(false)}
            ></button>
          </header>
          <section className="modal-card-body">
            <form onSubmit={handleFormSubmit}>
              <div className="field">
                <label className="label is-size-5">Username</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="field">
                <label className="label is-size-5">Email</label>
                <div className="control">
                  <input
                    className="input"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="field">
                <label className="label is-size-5">Password</label>
                <div className="control">
                  <input
                    className="input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="field">
                <p>
                  Already have an account? <Link>Login</Link>
                </p>
              </div>
              <div className="field is-grouped">
                <p className="control">
                  <button className="button is-link" type="submit">
                    Submit
                  </button>
                </p>
                <p className="control">
                  <button
                    className="button is-link is-light"
                    onClick={() => setIsActive(false)}
                  >
                    Cancel
                  </button>
                </p>
              </div>
            </form>
          </section>
        </div>
      </div>
    </>
  )
}
export default Signup
