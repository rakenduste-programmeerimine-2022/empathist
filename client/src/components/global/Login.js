import { useState } from "react"
import { useNavbarStore, useUserStore } from "../../store/store"

const Login = ({ isActive, setIsActive }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const login = useUserStore((state) => state.login)
  const setIsSignupOpen = useNavbarStore((state) => state.setIsSignupOpen)

  const handleLogin = (e) => {
    login(email, password)
      .then(() => setEmail(""))
      .then(() => setPassword(""))
      .then(() => setIsActive(false))
  }

  const handleSwitch = () => {
    setIsSignupOpen(true)
    setIsActive(false)
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
            <div className="field">
              <label className="label is-size-5">Email</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Email address"
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
            <div className="field is-grouped">
              <p className="mt-2">Don't have an account?</p>
              <button
                className="button is-ghost p-0 ml-2"
                style={{ color: "#2565AE" }}
                onClick={handleSwitch}
              >
                Sign up
              </button>
            </div>
            <div className="field is-grouped">
              <p className="control">
                <button onClick={handleLogin} className="button is-link">
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
          </section>
        </div>
      </div>
    </>
  )
}
export default Login
