import $user from '../http/interceptor'


export default class AuthService{
    static async login(email,password){
        return $user.post('/login',{email,password})
    }
    static async registration(email,password){
        return $user.post('/registration',{email,password})
    }
    static async logout(){
        return $user.post('/logout')
    }
    static async fetchUsers(){
        return $user.get('/all')
    }
}
