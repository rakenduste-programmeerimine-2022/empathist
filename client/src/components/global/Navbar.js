import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <>
      <nav className="navbar is-dark is-spaced" role="navigation">
        <div className="navbar-brand">
          <div
            className=" navbar-item title is-size-3 mr-6 has-text-light"
            id="navTitle"
          >
            Empathist
          </div>
        </div>
        <div id="navbar" className="navbar-menu is-size-4">
          <div className="navbar-start">
            <Link className="navbar-item" to="/">
              Welcome
            </Link>
            <Link className="navbar-item" to="findChat">
              Find chat
            </Link>
            <Link className="navbar-item" to="chat">
              Chat
            </Link>
          </div>
          <div className="navbar-end">
            <Link className="navbar-item is-size-4 mx-3" to="login">
              Login
            </Link>
            <Link className="navbar-item is-size-4 mx-3" to="signup">
              Sign up
            </Link>
          </div>
        </div>
      </nav>
    </>
  )
}
export default Navbar
