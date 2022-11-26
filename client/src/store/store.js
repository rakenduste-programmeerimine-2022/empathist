import create from 'zustand';
import AuthService from "../services/authService";
import axios from "axios";
import {API_URL} from "../http/interceptor";

export const useNavbarStore = create((set) => ({
    isLoginOpen: false,
    isSignupOpen: false,
    isFindChatOpen: false,
    isEnterNameOpen: false,
    setIsLoginOpen: (value) => set(() => ({ isLoginOpen: value })),
    setIsSignupOpen: (value) => set(() => ({ isSignupOpen: value })),
    setIsFindChatOpen: (value) => set(() => ({ isFindChatOpen: value })),
    setIsEnterNameOpen: (value) => set(() => ({ isEnterNameOpen: value })),

}))

export const useUserStore = create((set,get) => ({
    user: {},
    socket: null,
    isAuth: false,
    roomID: null,
    setRoomID: (value) => set(() => ({ roomID: value })),
    setSocket : (socket) => set(() => ({ socket: socket })),
    setUser: (user) => set(() => ({ user: user })),
    login: async (email, password) => {
        try {
            const response = await AuthService.login(email, password)
            localStorage.setItem('token', response.data.accessToken)
            set(() => ({isAuth: true}))
            set(() => ({ user: response.data.user }))
        } catch (err) {
            console.log(err.response?.data?.message)
        }
    },
    registration: async (email, password,username) => {
        try {
            const response = await AuthService.registration(email,password,username)
            localStorage.setItem('token',response.data.accessToken)
            set(() => ({isAuth: true}))
            set(() => ({ user: response.data.user }))
        }catch (err){
            console.log(err.response?.data?.message)
        }
    },
    logout: async () => {
        try {
            const response = await AuthService.logout()
            console.log(response)
            localStorage.removeItem('token')
            set(() => ({isAuth: false}))
            set(() => ({}))
        } catch (err) {
            console.log(err.response?.data?.message)
        }
    },
    checkAuth: async () => {
        try {
            const response = await axios.get(`${API_URL}/refresh`,{withCredentials:true})
            localStorage.setItem('token',response.data.accessToken)
            set(() => ({isAuth: true}))
            set(() => ({ user: response.data.user }))
        }catch (err){
            console.log(err.response?.data?.message)
        }
    },
    enterRoom: (roomID) => {
        console.log(`Trying to enter room ${roomID}`)
        get().socket.send(JSON.stringify({event: "enter", roomID}))
    },
    exitRoom: () => {
        console.log(`Trying to exit room ${get().roomID}`)
        get().socket.send(JSON.stringify({event: "exit"}))
    },
    sendMessage: (message) => {
        console.log(`Trying to send message ${message}`)
        get().socket.send(JSON.stringify({event: "message", content:message}))
    }
}))
