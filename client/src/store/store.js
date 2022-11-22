import create from 'zustand';
import AuthService from "../services/authService";
import axios from "axios";
import {API_URL} from "../http/interceptor";

export const useNavbarStore = create((set) => ({
    isLoginOpen: false,
    isSignupOpen: false,
    loginButtonClicks: 0,
    setIsLoginOpen: (value) => set(() => ({ isLoginOpen: value })),
    setIsSignupOpen: (value) => set(() => ({ isSignupOpen: value }))
}))

export const useUserStore = create((set) => ({
    user: {name:"Mares"},
    isAuth: false,
    setUser: (value) => set(() => ({ user: value })),
    login: async (email, password) => {
        try {
            const response = await AuthService.login(email, password)
            console.log(response)
            localStorage.setItem('token', response.data.accessToken)
            set(() => ({isAuth: true}))
            this.setUser(response.data.user)
        } catch (err) {
            console.log(err.response?.data?.message)
        }
    },
    registration: async (email, password) => {
        try {
            const response = await AuthService.registration(email,password)
            console.log(response)
            localStorage.setItem('token',response.data.accessToken)
            set(() => ({isAuth: true}))
            this.setUser(response.data.user)
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
            this.setUser({})
        } catch (err) {
            console.log(err.response?.data?.message)
        }
    },
    checkAuth: async () => {
        try {
            const response = await axios.get(`${API_URL}/refresh`,{withCredentials:true})
            localStorage.setItem('token',response.data.accessToken)
            set(() => ({isAuth: true}))
            this.setUser(response.data.user)
        }catch (err){
            console.log(err.response?.data?.message)
        }
    }
}))
