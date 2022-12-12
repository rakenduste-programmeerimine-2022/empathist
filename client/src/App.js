import "./App.css"
import "bulma/css/bulma.css"
import { Route, Routes } from "react-router-dom"
import NotFound from "./components/global/NotFound"
import Welcome from "./pages/welcome/Welcome"
import Chat from "./pages/chat/Chat"
import Navbar from "./components/global/Navbar"
import {useUserStore} from "./store/store";
import {useEffect} from "react";
import {useChatStore} from "./store/chatStore";

function App() {
    const setSocket = useChatStore((state) => state.setSocket)
    const setListeners = useChatStore((state) => state.setListeners)
    const checkAuth = useUserStore((state) => state.checkAuth)
    const user = useUserStore((state) => state.user)
    const roomID = useChatStore((state) => state.roomID)
    useEffect(()=>{
        if (localStorage.getItem( ('token'))){
            checkAuth()
        }
        // eslint-disable-next-line
    },[])

    useEffect(() => {
        const newSocket = new WebSocket("ws://localhost:2500/chat")
        setSocket(newSocket)
        setListeners()
        // eslint-disable-next-line
    }, [user])

    useEffect(() => {
        console.log(`RoomID is updated: ${roomID}`)
    },[roomID])


  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
