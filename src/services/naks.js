import { apiClient } from './api'

// 星宿分析 API
export const fetchStar = async (qry) => {
  try {
    const response = await apiClient.post('/naks/relations', qry)
    return response
  } catch (error) {
    console.error('获取星宿分析失败:', error)
    throw error
  }
}
