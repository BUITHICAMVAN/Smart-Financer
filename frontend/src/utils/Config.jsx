import axios from "axios";
import { history } from "..";
import { jwtDecode } from 'jwt-decode'

export const TOKEN = 'token'
export const DOMAIN_BACKEND = ''
// Cau hinh cho cac file dung chung cho he thong 
//  Cau hinh interceptor cho axios (cau hinh cho tat ca request va response khi su dung axios)
// Tao ra 1 phien ban cua axios (instance axios)

export const http = axios.create({
    baseURL: DOMAIN_BACKEND, // Correct property name
    timeout: 30000, // Maximum time for a request
});

// Cau hinh request
http.interceptors.request.use((config) => {
    // Tat ca cac request gui di se duoc chua trong phan header la token dang nhap
    config.headers = {
        ...config.headers,
        Authorization: `Bearer ${localStorage.getItem(TOKEN)}`
    }
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
    console.log('util', error.response)
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
        console.log(date)
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
