import { useState } from "react"
import { Link } from "react-router-dom"
import { useNavbarStore, useUserStore } from "../../store/store"
import Signup from "./Signup"
import Login from "./Login"
const pages = [
  { name: "Welcome", path: "/" },
  { name: "Find chat", path: "/findchat" },
  { name: "Chat", path: "/chat" },
]

const Navbar = () => {
  const [navToggle, setNavToggle] = useState("")
  const [navMenu, setNavMenu] = useState("")
  const isAuth = useUserStore((state) => state.isAuth)
  const logout = useUserStore((state) => state.logout)
  const [signupModal, setSignupModal] = useState(false)
  const [loginModal, setLoginModal] = useState(false)

  const handleLoginClick = () => {
    setLoginModal(true)
    setNavMenu("")
    setNavToggle("")
  }

  const handleSignupClick = () => {
    setSignupModal(true)
    setNavMenu("")
    setNavToggle("")
  }

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
            {pages.map((page) => (
              <Link
                key={page.name}
                id="navItem"
                className="navbar-item has-text-light"
                to={page.path}
              >
                {page.name}
              </Link>
            ))}
          </div>
          <div className="navbar-end">
            <div className="navbar-item has-dropdown is-hoverable mr-3">
              <div className="navbar-link has-text-light">Profile</div>
              <div className="navbar-dropdown is-right has-background-dark">
                {isAuth ? (
                  <button
                    className="navbar-item is-size-4 button is-ghost has-text-black"
                    onClick={() => logout()}
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    className="navbar-item is-size-4 button is-ghost has-text-black"
                    onClick={() => handleLoginClick()}
                  >
                    Login
                  </button>
                )}
                <button
                  className="navbar-item is-size-4 button is-ghost has-text-black"
                  onClick={() => handleSignupClick()}
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <Signup isActive={signupModal} setIsActive={setSignupModal} />
      <Login isActive={loginModal} setIsActive={setLoginModal} />
    </>
  )
}
export default Navbar
