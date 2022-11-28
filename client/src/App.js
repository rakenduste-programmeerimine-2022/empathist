import "./App.css"
import "bulma/css/bulma.css"
import { Route, Routes } from "react-router-dom"
import NotFound from "./components/global/NotFound"
import Welcome from "./pages/welcome/Welcome"
import Chat from "./pages/chat/Chat"
import Navbar from "./components/global/Navbar"
import {useUserStore} from "./store/store";
import {useEffect} from "react";

function App() {

    const checkAuth = useUserStore((state) => state.checkAuth)
    useEffect(()=>{
        if (localStorage.getItem( ('token'))){
            checkAuth()
        }
        // eslint-disable-next-line
    },[])




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
