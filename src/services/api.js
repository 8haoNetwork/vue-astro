import axios from 'axios'

// 创建axios实例
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 从环境变量获取API基础URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
    'appId': '',
    'entId': ''
  }
})

// 请求拦截器
apiClient.interceptors.request.use(
  config => {
    // 添加 X-App-Id 和 X-App-Key 头部
    const appId = import.meta.env.VITE_APP_ID || ''
    const appKey = import.meta.env.VITE_APP_KEY || ''
    if (appId) {
      config.headers['X-App-Id'] = appId
    }
    if (appKey) {
      config.headers['X-App-Key'] = appKey
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.error('API请求错误:', error)
    return Promise.reject(error)
  }
)
