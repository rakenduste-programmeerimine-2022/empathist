import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDown } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"
import { useState } from "react"
import { useNavbarStore, useUserStore } from "../../store/store"
import {useChatStore} from "../../store/chatStore";

const searchOptions = [{ name: "By name" }]

const FindChat = () => {
  const [searchRequest, setSearchRequest] = useState("")
  const enterRoom = useChatStore((state) => state.enterRoom)
  const exitRoom = useChatStore((state) => state.exitRoom)
  const storedRoomID = useChatStore((state) => state.roomID)
  const user = useUserStore((state) => state.user)
  const setIsEnterNameOpen = useNavbarStore((state) => state.setIsEnterNameOpen)
  const rooms = useChatStore((state) => state.rooms)

  const handleEnterRoom = async (roomID) => {
    if (storedRoomID !== null) {
      await exitRoom()
    }
    if (roomID !== storedRoomID) {
      await enterRoom(roomID)
    }
  }

  return (
    <>
      <section className="hero is-halfheight">
        <section className="hero-head">
          <div className="search-bar py-3">
            <div className="dropdown is-hoverable">
              <div className="dropdown-trigger">
                <button
                  className="button"
                  aria-haspopup="true"
                  aria-controls="dropdown-menu"
                >
                  <span>Search options</span>
                  <span className="icon is-small">
                    <FontAwesomeIcon icon={faAngleDown} />
                  </span>
                </button>
                <div className="dropdown-menu" id="dropdown-menu" role="menu">
                  <div className="dropdown-content">
                    {searchOptions.map((option) => (
                      <Link key={option.name} className="dropdown-item">
                        {option.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="field">
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Search"
                  onChange={(e) => setSearchRequest(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="hero-body p-2 mt-3 chat-list">
          {!user.username && !user.id && (
            <div
              onClick={() => setIsEnterNameOpen(true)}
              className="button is-info"
            >
              Log in to see chat list
            </div>
          )}
          {rooms.length ? (
            rooms
              .filter((room) => room.id !== storedRoomID)
              .map((room) => (
                <ul key={room.id} className="notification chat-item">
                  <li className="is-size-3 has-text-weight-medium">
                    {room.name} | {room.users}{" "}
                    {room.users === 1 ? "user" : "users"} | {room.type} room
                  </li>
                  <div
                    className="button is-info px-5 is-size-5"
                    onClick={() => handleEnterRoom(room.id)}
                  >
                    Join
                  </div>
                </ul>
                ))
          ) : (
            <div className="notification is-empty">No rooms found</div>
          )}
        </section>
      </section>
    </>
  )
}
export default FindChat
