import axios from 'axios'
import config from '@/config'
import { HideLoading, ShowLoading } from './loading'
import Cookies from 'js-cookie'
const SESSION_ID = 'session_id'
const TOKEN = 'token'

// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

console.log(import.meta.env)
const request = axios.create({
  baseURL: config.baseUrl,
  timeout: 60000,
  timeoutErrorMessage: '请求超时, 请稍后再试',
  // withCredentials: true
})

request.interceptors.request.use(
  (config) => {
    // console.log('config: ', config)
    // @ts-ignore
    if (config.showLoading) {
      ShowLoading()
      // NProgress.start()
    }
    config.auth = {
      username: 'gUpZyIjPhK8gexafAZvY9VKkSAYs1D',
      password: 'dYjiybelD2bPUOHAPFxsBzD8PKFa2j',
    }
    // const token: any = sessionStorage.getItem(TOKEN)
    // if (token) {
    //     config.headers.Authorization = 'Bearer ' + JSON.parse(token).token
    // }

    // const value: any = storage.get(TOKEN)
    // if (value) {
    //     console.log(value.token)
    //     config.headers.Authorization = 'Bearer ' + value.token
    // }

    const cookieToken = Cookies.get(TOKEN)
    if (cookieToken) {
      config.headers.Authorization = 'Bearer ' + cookieToken
    }
    const cookieSessionId = Cookies.get(SESSION_ID)
    if (cookieSessionId) {
      config.headers.set('X-Session-Id', cookieSessionId)
    }

    // if (import.meta.env.VITE_MOCK === 'true') {
    //     config.baseURL = import.meta.env.VITE_MOCK_API
    // } else {
    //     config.baseURL = import.meta.env.VITE_BASE_API
    // }
    return config
  },
  (err) => {
    return Promise.reject(err)
  },
)

request.interceptors.response.use(
  (resp) => {
    // @ts-ignore
    if (resp.config.showLoading) {
      HideLoading()
    }
    // NProgress.done()
    return resp
  },
  (err) => {
    if (err.config && err.config.showLoading) {
      HideLoading()
    }
    // NProgress.done()
    return Promise.reject(err)
  },
)

export default request
