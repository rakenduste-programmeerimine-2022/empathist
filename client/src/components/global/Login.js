import { Link } from "react-router-dom"
import { useState } from "react"

const Login = ({ isActive, setIsActive }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleFormSubmit = (e) => {
    e.preventDefault()
    console.log(username, password)
  }
  return (
    <>
      <div className={isActive ? "modal is-active" : "modal"}>
        <div className="modal-background"></div>
        <div className="modal-card px-2">
          <header className="modal-card-head">
            <p className="modal-card-title is-size-3">Log in</p>
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
                  Don't have an account?
                  <Link>Sign up</Link>
                </p>
              </div>
              <div className="field is-grouped">
                <p className="control">
                  <button className="button is-link">Submit</button>
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
export default Login
