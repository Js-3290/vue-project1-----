import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

// 创建axios实例
const request = axios.create({
  baseURL: '/api', // 接口地址
  timeout: 600000 // 请求超时时间
})

//axios响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response.status == 401) {//token失效
      //提示信息
      ElMessage.error('登录超时，请重新登录')
      // 跳转到登录页面
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

//axios请求拦截器
request.interceptors.request.use(
  (config) => {//成功回调
    // 从本地存储中获取用户信息，转换为对象
      const loginUser = JSON.parse(localStorage.getItem('loginUser'))
      // 设置请求头
      if(loginUser && loginUser.token) {
        config.headers.token = loginUser.token
      }
    return config
  },
  (error) => {//失败回调
    return Promise.reject(error)
  }
)



export default request