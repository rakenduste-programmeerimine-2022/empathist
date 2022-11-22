import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDown } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"
import { useState} from "react"
import {useUserStore} from "../../store/store";

const searchOptions = [{ name: "By name" }]

const FindChat = ({rooms}) => {
  const [searchRequest, setSearchRequest] = useState("")
  const enterRoom = useUserStore((state) => state.enterRoom)
  console.log(searchRequest)


  return (
    <>
      <section className="hero-head">
        <div className="title">Find chat</div>
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
                    <Link className="dropdown-item">{option.name}</Link>
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
        {rooms.map((room) => (
          <div key={room.id} className="notification chat-item">
            <p className="is-size-3 has-text-weight-medium">
              {room.name} | {room.users} {room.users === 1 ? "user" : "users"} | {room.type} room
            </p>
            <div className="button is-info px-5 is-size-5" onClick={()=>enterRoom(room.id)}>Join</div>
          </div>
        ))}
      </section>
    </>
  )
}
export default FindChat
