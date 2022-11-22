import axios from 'axios'

export const API_URL = `http://localhost:2500/user`

const $user = axios.create({
    withCredentials:true,
    baseURL:API_URL
})

$user.interceptors.request.use( config=>{
    config.headers.Authorisation = `Bearer ${localStorage.getItem('token')}`
    return config
})

export default $user
