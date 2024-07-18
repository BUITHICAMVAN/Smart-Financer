import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { history } from "../"

export const TOKEN = 'token'
export const DOMAIN_BACKEND = 'http://localhost:5000/api/v1/'

// Cau hinh cho cac file dung chung cho he thong 
//  Cau hinh interceptor cho axios (cau hinh cho tat ca request va response khi su dung axios)
// Tao ra 1 phien ban cua axios (instance axios)

export const http = axios.create({
    baseURL: DOMAIN_BACKEND,
    timeout: 30000,
})

// Cau hinh request
http.interceptors.request.use((config) => {
    // Tat ca cac request gui di se duoc chua trong phan header la token dang nhap
    const token = localStorage.getItem(TOKEN)
    config.headers['Authorization'] = token ? `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4LCJpYXQiOjE3MjEyNjMxNzN9.E6ogsww8VYw7tRLlm16OomUp1DMwwJ8ByLpEnIuSR8o` : ''
    return config
}, error => {
    return Promise.reject(error)
})

//Cau hinh response
http.interceptors.response.use((res) => {
    // Thanh cong
    return res
}, error => {
    // Xu ly that bai
    // lay code tu response
    const statusCode = error.response.status
    // Duong dan khong hop le
    if (statusCode === 400) {
        // Chuyen huong trang ve home
        history.push('/')
    } else if (statusCode === 401) {
        // kiem tra token het han hay chua
        // neu het han thi goi api refreshToken
        const decodedToken = jwtDecode(localStorage.getItem(TOKEN)) // Lay token va decode
        const date = new Date(decodedToken.exp + 1000)
        if (date < Date.now()) { // neu time cua token nhỏ hơn hiện tại => hết hạn
            // Goi api refresh tokem 
            console.log('goi api refresh token')
        }
        // khong co token
        alert('Đăng nhập để vào trang này')
        // chuyen ve trang dang nhap
        history.push('/react-router-hook-login')
    } else if (statusCode === 403) {
        alert('Khong du quyen truy cap')
        history.push('/')
    }
    return Promise.reject(error)
})