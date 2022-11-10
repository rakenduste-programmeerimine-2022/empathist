import { useState } from "react"
import { Link } from "react-router-dom"

const Navbar = () => {
  const [navToggle, setNavToggle] = useState("")
  const [navMenu, setNavMenu] = useState("")

  const handleNavToggle = () => {
    navToggle === "" ? setNavToggle("is-active") : setNavToggle("")
    navMenu === "" ? setNavMenu("is-active") : setNavMenu("")
  }

  return (
    <>
      <nav className="navbar is-dark" role="navigation">
        <div className="navbar-brand">
          <div
            className=" navbar-item is-size-2 is-size-4-touch ml-3 mr-6 has-text-light"
            id="navTitle"
          >
            Empathist
          </div>
          <div
            role="button"
            className={`navbar-burger ${navToggle}`}
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
            onClick={handleNavToggle}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </div>
        </div>
        <div
          id="navbar"
          className={`navbar-menu is-size-4 has-background-dark ${navMenu}`}
        >
          <div className="navbar-start">
            <Link id="navItem" className="navbar-item has-text-light" to="/">
              Welcome
            </Link>
            <Link className="navbar-item has-text-light" to="findChat">
              Find chat
            </Link>
            <Link className="navbar-item has-text-light" to="chat">
              Chat
            </Link>
          </div>
          <div className="navbar-end">
            <div className="navbar-item has-dropdown is-hoverable mr-3">
              <div className="navbar-link has-text-light">Profile</div>
              <div className="navbar-dropdown is-right has-background-dark">
                <Link
                  className="navbar-item is-size-4 has-text-light"
                  to="login"
                >
                  Login
                </Link>
                <Link
                  className="navbar-item is-size-4 has-text-light"
                  to="signup"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
export default Navbar
