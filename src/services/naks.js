import { apiClient } from './api'
import { withRequestLang } from '../utils/lang'

// 星宿分析 API
export const fetchStar = async (qry) => {
  try {
    const response = await apiClient.post('/naks/relations', withRequestLang(qry))
    return response
  } catch (error) {
    console.error('获取星宿分析失败:', error)
    throw error
  }
}
