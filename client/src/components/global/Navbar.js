import {useEffect, useState} from "react"
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
import {EnterName} from "./EnterName";
import {Notification} from "../errors/Notification";
import {InteractiveLogo} from "../navbar/InteractiveLogo";
import {Logo} from "../navbar/Logo";

const findChat = { name: "Find chat", path: "/chat", icon: faMagnifyingGlass }
const chat = { name: "Chat", path: "/chat", icon: faMessage }
const welcome = { name: "Welcome", path: "/", icon: faHome }



const Navbar = () => {
  const [navToggle, setNavToggle] = useState("")
  const [navMenu, setNavMenu] = useState("")
  const isAuth = useUserStore((state) => state.isAuth)
  const logout = useUserStore((state) => state.logout)
  const user = useUserStore((state) => state.user)
  const setIsLoginOpen = useNavbarStore((state) => state.setIsLoginOpen)
  const setIsSignupOpen = useNavbarStore((state) => state.setIsSignupOpen)
  const setISFindChatOpen = useNavbarStore((state) => state.setIsFindChatOpen)
  const isFindChatOpen = useNavbarStore((state) => state.isFindChatOpen)
  const isLoginOpen = useNavbarStore((state) => state.isLoginOpen)
  const isSignupOpen = useNavbarStore((state) => state.isSignupOpen)
  const roomID = useUserStore((state) => state.roomID)
  const exitRoom = useUserStore((state) => state.exitRoom)
  const globalNotification = useNavbarStore((state) => state.globalNotification)
  const setGlobalNotification = useNavbarStore((state) => state.setGlobalNotification)
  const setIsNotificationOpen = useNavbarStore((state) => state.setIsNotificationOpen)
  const [isSecretLogoOpen, setIsSecretLogoOpen] = useState(false)

  const handleWelcomeClick = async () => {
    console.log("Going to welcome page")
    await exitRoom()
    setGlobalNotification("You have left the chat")
    setIsNotificationOpen(true)
    window.location.replace(welcome.path);


  }

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

  const handleLogout = async () => {
    await logout()
    setGlobalNotification("You have logged out")
    setIsNotificationOpen(true)
    window.location.replace(welcome.path);
  }

  useEffect(() => {
    setIsNotificationOpen(true)
    console.log("Notification is updated")
  },[globalNotification])


  return (
    <>
      <nav className="navbar is-dark" role="navigation">
        <div className="navbar-brand">
            {isSecretLogoOpen ? <InteractiveLogo handleSwitch={setIsSecretLogoOpen}/> : <Logo handleSwitch={setIsSecretLogoOpen}/>}
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
              <Link
                key={welcome.name}
                id="navItem"
                className="navbar-item has-text-light is-size-4 px-5"
                onClick={handleWelcomeClick}
              >
                <span className="icon-text">
                  <span className="icon pr-2">
                    <FontAwesomeIcon icon={welcome.icon} />
                  </span>
                  <span>{welcome.name}</span>
                </span>
              </Link>
              <Link
                  key={roomID?chat.name:findChat.name}
                  id="navItem"
                  className="navbar-item has-text-light is-size-4 px-5"
                  to={chat.path}
                  onClick={()=>setISFindChatOpen(false)}
              >
              <span className="icon-text">
                <span className="icon is-small pr-2">
                  <FontAwesomeIcon className="fas" icon={roomID?chat.icon:findChat.icon} />
                </span>
                <span>{roomID?chat.name:findChat.name}</span>
              </span>
              </Link>
            {roomID&&<Link
                onClick={isFindChatOpen?()=>setISFindChatOpen(false):()=>setISFindChatOpen(true)}
                className=" navbar-item is-link has-text-light is-size-4 px-5">
              <span className="icon-text">
                <span className="icon pr-2">
                  <FontAwesomeIcon icon={findChat.icon} />
                </span>
                <span>{findChat.name}</span>
              </span>
            </Link>}

          </div>
          <div className="navbar-end">
            <div className="navbar-item has-dropdown is-hoverable mr-3">
              <div className="navbar-link has-text-light">
                <span className="icon-text">
                  <span className="icon pr-2">
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                  <span>{isAuth?user.username:"Profile"}</span>
                </span>
              </div>
              <div className="navbar-dropdown is-right has-background-dark">
                {isAuth ? (
                  <button
                    className="navbar-item is-size-4 button is-ghost has-text-black"
                    onClick={handleLogout}
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
                {!isAuth&&<button
                  className="navbar-item is-size-4 button is-ghost has-text-black"
                  onClick={() => handleSignupClick()}
                >
                  Sign up
                </button>}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <Signup isActive={isSignupOpen} setIsActive={setIsSignupOpen}/>
      <Login isActive={isLoginOpen} setIsActive={setIsLoginOpen}/>
      <EnterName/>
      <Notification/>
    </>
  )
}
export default Navbar
