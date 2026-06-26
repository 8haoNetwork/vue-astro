import { apiClient } from './api'
import { resolveRequestLang } from '../utils/lang'

/**
 * 规范时间为 HH:mm:ss
 */
function normalizeTimeToSeconds(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return '00:00:00'
  const t = timeStr.trim()
  const parts = t.split(':')
  const h = parts[0]?.padStart(2, '0') || '00'
  const m = parts[1]?.padStart(2, '0') || '00'
  const s = parts[2] != null ? String(parts[2]).padStart(2, '0') : '00'
  return `${h}:${m}:${s}`
}

/**
 * 构建紫微斗数请求体（与 vue_ziwei 一致）
 * @param {Object} params - 前端参数
 * @returns {Object} 后端请求体
 */
export function buildZiweiRequestBody(params) {
  let birthday = params.birthday
  if (!birthday && params.birthDate) {
    const timeStr = params.birthTime
      ? normalizeTimeToSeconds(params.birthTime)
      : '00:00:00'
    birthday = `${params.birthDate} ${timeStr}`
  }

  const genderMap = {
    男: 'male',
    女: 'female',
    male: 'male',
    female: 'female'
  }
  const gender = genderMap[params.gender] || params.gender

  const body = {
    birth_dt: birthday,
    tz: params.tz ?? 8,
    gender,
    is_solar_time: params.is_solar_time === true
  }

  if (params.target_date != null && params.target_date !== '') {
    body.target_date = params.target_date
  }
  if (params.longitude != null && params.longitude !== '') {
    const lon = parseFloat(params.longitude)
    if (!Number.isNaN(lon)) body.longitude = lon
  }
  if (params.latitude != null && params.latitude !== '') {
    const lat = parseFloat(params.latitude)
    if (!Number.isNaN(lat)) body.latitude = lat
  }
  if (params.is_late_zi !== undefined) {
    body.is_late_zi = params.is_late_zi
  }
  if (params.leap_boundary) {
    body.leap_boundary = params.leap_boundary
  }
  if (params.custom_transform_type) {
    body.custom_transform_type = params.custom_transform_type
  }
  if (params.custom_transforms) {
    body.custom_transforms = params.custom_transforms
  }

  body.lang = resolveRequestLang(params?.lang)

  return body
}

/**
 * 本命盘（仅本命，无大限/流年等）
 * POST /ziwei/natal
 */
export async function fetchZiweiNatal(params) {
  const body = buildZiweiRequestBody(params)
  delete body.target_date
  const response = await apiClient.post('/ziwei/natal', body)
  return response
}

/**
 * 完整运限盘（本命 + 大限 + 流年 + 流月 + 流日 + 流时）
 * POST /ziwei/detail
 */
export async function fetchZiweiDetail(params) {
  const body = buildZiweiRequestBody(params)
  const response = await apiClient.post('/ziwei/detail', body)
  return response
}
