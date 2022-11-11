import { Link } from "react-router-dom"

const Signup = () => {
  return (
    <>
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-card px-2">
          <header className="modal-card-head">
            <p className="modal-card-title is-size-3">Sign up</p>
            <button className="delete" aria-label="close"></button>
          </header>
          <section className="modal-card-body">
            <form>
              <div className="field">
                <label className="label is-size-5">Username</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    placeholder="Username"
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
                  ></input>
                </div>
              </div>
              <div className="field">
                <p>
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </div>
              <div className="field is-grouped">
                <p className="control">
                  <button className="button is-link">Submit</button>
                </p>
                <p className="control">
                  <button className="button is-link is-light">Cancel</button>
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
