import create from 'zustand';

export const useNavbarStore = create((set) => ({
    isLoginOpen: false,
    isSignupOpen: false,
    loginButtonClicks: 0,
    setIsLoginOpen: (value) => set(() => ({ isLoginOpen: value })),
    setIsSignupOpen: (value) => set(() => ({ isSignupOpen: value })),
    incrementLoginButtonClicks: () => set((state) => ({ loginButtonClicks: state.loginButtonClicks + 1 })),
}))

export const useUserStore = create((set) => ({
    user: {name:"Mares"},
    isAuth: true,
    setUser: (value) => set(() => ({ user: value })),
    logout: () => set(() => ({ user: {}, isAuth: false })),
}))
