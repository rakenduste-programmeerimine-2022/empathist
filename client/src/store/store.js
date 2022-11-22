import create from 'zustand';

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
    logout: () => set(() => ({ user: {}, isAuth: false })),
}))
