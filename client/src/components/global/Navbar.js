import { useState } from "react"
import { Link } from "react-router-dom"
import { useNavbarStore, useUserStore } from "../../store/store"
import Signup from "./Signup"
import Login from "./Login"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHome,
  faUser,
  faMagnifyingGlass,
  faMessage,
} from "@fortawesome/free-solid-svg-icons"
const pages = [
  { name: "Welcome", path: "/", icon: faHome },
  { name: "Find chat", path: "/findchat", icon: faMagnifyingGlass },
  { name: "Chat", path: "/chat", icon: faMessage },
]

const Navbar = () => {
  const [navToggle, setNavToggle] = useState("")
  const [navMenu, setNavMenu] = useState("")
  const isAuth = useUserStore((state) => state.isAuth)
  const logout = useUserStore((state) => state.logout)
  const setIsLoginOpen = useNavbarStore((state) => state.setIsLoginOpen)
  const setIsSignupOpen = useNavbarStore((state) => state.setIsSignupOpen)
  const isLoginOpen = useNavbarStore((state) => state.isLoginOpen)
  const isSignupOpen = useNavbarStore((state) => state.isSignupOpen)

  const handleLoginClick = () => {
    setIsLoginOpen(true)
    setNavMenu("")
    setNavToggle("")
  }

  const handleSignupClick = () => {
    setIsSignupOpen(true)
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
                className="navbar-item has-text-light is-size-4 px-5"
                to={page.path}
              >
                <span className="icon-text">
                  <span className="icon pr-2">
                    <FontAwesomeIcon icon={page.icon} />
                  </span>
                  <span>{page.name}</span>
                </span>
              </Link>
            ))}
          </div>
          <div className="navbar-end">
            <div className="navbar-item has-dropdown is-hoverable mr-3">
              <div className="navbar-link has-text-light">
                <span className="icon-text">
                  <span className="icon pr-2">
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                  <span>Profile</span>
                </span>
              </div>
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
      <Signup isActive={isSignupOpen} setIsActive={setIsSignupOpen}/>
      <Login isActive={isLoginOpen} setIsActive={setIsLoginOpen}/>
    </>
  )
}
export default Navbar
