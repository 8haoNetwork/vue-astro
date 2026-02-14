import { apiClient } from './api'

// 八字 - 基本盘 API
export const fetchBaziNatal = async (qry) => {
  try {
    const response = await apiClient.post('/bazi/natal', qry)
    return response
  } catch (error) {
    console.error('获取八字基本盘失败:', error)
    throw error
  }
}

// 八字 - 流盘 API
export const fetchBaziFlow = async (qry) => {
  try {
    const response = await apiClient.post('/bazi/flow', qry)
    return response
  } catch (error) {
    console.error('获取八字流盘失败:', error)
    throw error
  }
}

// 八字 - 综合总结 API
export const fetchBaziSummary = async (qry) => {
  try {
    const response = await apiClient.post('/bazi/summary', qry)
    return response
  } catch (error) {
    console.error('获取八字综合失败:', error)
    throw error
  }
}

// 八字 - 合盘 API
export const fetchBaziMatch = async (qry) => {
  try {
    const response = await apiClient.post('/bazi/match', qry)
    return response
  } catch (error) {
    console.error('获取八字合盘失败:', error)
    throw error
  }
}
