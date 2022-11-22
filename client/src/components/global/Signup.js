import { useState } from "react"
import {useNavbarStore, useUserStore} from "../../store/store";

const Signup = ({ isActive, setIsActive }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const registration = useUserStore((state) => state.registration)
    const setIsLoginOpen = useNavbarStore((state) => state.setIsLoginOpen)

  const handleRegistration = () =>{
    registration(email,password,username)
        .then(()=>setEmail(''))
        .then(()=>setPassword(''))
        .then(()=>setIsActive(false))
  }

  const handleSwitch = () => {
    setIsLoginOpen(true)
    setIsActive(false)
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
                  Already have an account? <button className="button is-text" style={{color:"#2565AE"}} onClick={handleSwitch}>Login</button>
                </p>
              </div>
              <div className="field is-grouped">
                <p className="control">
                  <button onClick={handleRegistration} className="button is-link" >
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
export default Signup
