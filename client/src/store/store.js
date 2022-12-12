import create from 'zustand';
import AuthService from "../services/authService";
import axios from "axios";
import {API_URL} from "../http/interceptor";

export const useNavbarStore = create((set) => ({
    isLoginOpen: false,
    isSignupOpen: false,
    isFindChatOpen: false,
    isEnterNameOpen: false,
    isErrorModalOpen: false,
    isNotificationOpen: false,
    globalNotification: 'Welcome to our project',
    globalError: '',
    setIsLoginOpen: (value) => set(() => ({ isLoginOpen: value })),
    setIsSignupOpen: (value) => set(() => ({ isSignupOpen: value })),
    setIsFindChatOpen: (value) => set(() => ({ isFindChatOpen: value })),
    setIsEnterNameOpen: (value) => set(() => ({ isEnterNameOpen: value })),
    setIsErrorModalOpen: (value) => set(() => ({ isErrorModalOpen: value })),
    setGlobalError: (value) => set(() => ({ globalError: value })),
    setIsNotificationOpen: (value) => set(() => ({ isNotificationOpen: value })),
    setGlobalNotification: (value) => set(() => ({ globalNotification: value })),

}))

export const useUserStore = create((set,get) => ({
    user: {},
    isAuth: false,
    setUser: (user) => set(() => ({ user: user })),
    login: async (email, password) => {
        try {
            const response = await AuthService.login(email, password)
            localStorage.setItem('token', response.data.accessToken)
            set(() => ({isAuth: true,user: response.data.user}))
        } catch (err) {
            console.log(err.response?.data?.message)
            set(() => ({isAuth:false, user: {},roomID: null}))
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
            set(() => ({isAuth: false,roomID: null,user: {}}))
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
    }
}))
