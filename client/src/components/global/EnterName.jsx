import { useState } from "react"
import { useNavbarStore, useUserStore } from "../../store/store"

export const EnterName = () => {
  const isEnterNameOpen = useNavbarStore((state) => state.isEnterNameOpen)
  const setIsEnterNameOpen = useNavbarStore((state) => state.setIsEnterNameOpen)
  const setIsLoginOpen = useNavbarStore((state) => state.setIsLoginOpen)
  const setUser = useUserStore((state) => state.setUser)
  const [inputError, setInputError] = useState(false)
  const [username, setUsername] = useState("")
  const handleEnterName = () => {
    setInputError(false)
    if (username.length) {
      setUser({ username })
      setIsEnterNameOpen(false)
      setInputError(true)
      setUsername("")
    } else {
      alert("Input is empty")
      setInputError(true)
      //add error status to input
    }
  }
  const handleSwitchToLogin = () => {
    setIsLoginOpen(true)
    setIsEnterNameOpen(false)
  }

  return (
    <div className={isEnterNameOpen ? "modal is-active" : "modal"}>
      <div
        className="modal-background"
        onClick={() => setIsEnterNameOpen(false)}
      ></div>
      <div className="modal-card px-2">
        <header className="modal-card-head">
          <p className="modal-card-title is-size-3">Log in as guest</p>
          <button
            className="delete"
            aria-label="close"
            onClick={() => setIsEnterNameOpen(false)}
          ></button>
        </header>
        <section className="modal-card-body">
          <div className="field">
            <label className="label is-size-5">
              Choose a username to connect
            </label>
            <div className="control">
              <input
                className={inputError ? "input is-danger" : "input"}
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              ></input>
            </div>
          </div>
          <div className="field is-grouped">
            <p className="mt-2">Already have an account? </p>
            <button
              className="button is-ghost p-0 ml-2"
              style={{ color: "#2565AE" }}
              onClick={handleSwitchToLogin}
            >
              Login
            </button>
          </div>
          <div className="field is-grouped">
            <p className="control">
              <button onClick={handleEnterName} className="button is-link">
                Submit
              </button>
            </p>
            <p className="control">
              <button
                className="button is-link is-light"
                onClick={() => setIsEnterNameOpen(false)}
              >
                Cancel
              </button>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
