import { apiClient } from './api'
import { resolveRequestLang } from '../utils/lang'

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
 * 构建七政四余请求体，对齐 QizhengNatalQry / QizhengQry。
 */
export function buildQizhengBody(params, { includeTarget = false } = {}) {
  const birthday = params.birthday
    || `${params.birthDate} ${normalizeTimeToSeconds(params.birthTime)}`

  const genderMap = { 男: 'male', 女: 'female', male: 'male', female: 'female' }
  const body = {
    birth_dt: birthday,
    tz: params.tz ?? 8,
    gender: genderMap[params.gender] || params.gender || 'male',
    is_solar_time: params.is_solar_time === true,
    is_late_zi: params.is_late_zi === true,
    dst_auto: params.dst_auto !== false,
    lang: resolveRequestLang(params?.lang)
  }

  if (params.longitude != null && params.longitude !== '') {
    const lon = parseFloat(params.longitude)
    if (!Number.isNaN(lon)) body.longitude = lon
  }
  if (params.latitude != null && params.latitude !== '') {
    const lat = parseFloat(params.latitude)
    if (!Number.isNaN(lat)) body.latitude = lat
  }
  if (includeTarget && params.target_dt) {
    body.target_dt = params.target_dt
  }
  return body
}

const QIZHENG_TIMEOUT = 30000

export async function fetchQizhengNatal(params) {
  const body = buildQizhengBody(params, { includeTarget: false })
  return apiClient.post('/zhengyu/natal', body, { timeout: QIZHENG_TIMEOUT })
}

export async function fetchQizhengChart(params) {
  const body = buildQizhengBody(params, { includeTarget: true })
  return apiClient.post('/zhengyu/chart', body, { timeout: QIZHENG_TIMEOUT })
}
