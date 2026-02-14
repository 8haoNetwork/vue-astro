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
    // 可以在这里添加认证token等
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

// 星座运势API
export const fetchConstellation = async (constellation, type) => {
  try {
    const response = await apiClient.get('/constellation', {
      params: {
        constellation,
        type
      }
    })
    return response
  } catch (error) {
    console.error('获取星座运势失败:', error)
    throw error
  }
}

// 个人星盘API
export const fetchHoroscope = async (birthDate, birthTime, birthPlace) => {
  try {
    const response = await apiClient.get('/horoscope', {
      params: {
        birthDate,
        birthTime,
        birthPlace
      }
    })
    return response
  } catch (error) {
    console.error('获取个人星盘失败:', error)
    throw error
  }
}

// 紫薇斗数API
export const fetchZiwei = async (birthDate, birthTime, gender) => {
  try {
    const response = await apiClient.get('/ziwei', {
      params: {
        birthDate,
        birthTime,
        gender
      }
    })
    return response
  } catch (error) {
    console.error('获取紫薇斗数失败:', error)
    throw error
  }
}

