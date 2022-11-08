import "./App.css"
import "bulma/css/bulma.css"
import { Route, Routes } from "react-router-dom"
import NotFound from "./components/global/NotFound"
import Welcome from "./pages/welcome/Welcome"
import FindChat from "./pages/chat/FindChat"
import Chat from "./pages/chat/Chat"
import Login from "./components/global/Login"
import Signup from "./components/global/Signup"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/findChat" element={<FindChat />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
