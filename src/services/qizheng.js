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

function mapGender(gender) {
  const genderMap = { 男: 'male', 女: 'female', male: 'male', female: 'female' }
  return genderMap[gender] || gender || 'male'
}

/** 单人生辰（比较盘 user_list 一项 / 本命请求共用字段） */
export function buildQizhengPerson(params) {
  const birthday = params.birthday
    || `${params.birthDate} ${normalizeTimeToSeconds(params.birthTime)}`

  const body = {
    birth_dt: birthday,
    tz: params.tz ?? 8,
    gender: mapGender(params.gender),
    is_solar_time: params.is_solar_time === true,
    is_late_zi: params.is_late_zi === true,
    dst_auto: params.dst_auto !== false
  }

  if (params.longitude != null && params.longitude !== '') {
    const lon = parseFloat(params.longitude)
    if (!Number.isNaN(lon)) body.longitude = lon
  }
  if (params.latitude != null && params.latitude !== '') {
    const lat = parseFloat(params.latitude)
    if (!Number.isNaN(lat)) body.latitude = lat
  }
  return body
}

/**
 * 构建七政四余请求体，对齐 QizhengNatalQry / QizhengQry。
 */
export function buildQizhengBody(params, { includeTarget = false } = {}) {
  const body = {
    ...buildQizhengPerson(params),
    lang: resolveRequestLang(params?.lang)
  }
  if (includeTarget && params.target_dt) {
    body.target_dt = params.target_dt
  }
  return body
}

const QIZHENG_TIMEOUT = 30000

export async function fetchQizhengChart(params) {
  const body = buildQizhengBody(params, { includeTarget: true })
  return apiClient.post('/zhengyu/chart', body, { timeout: QIZHENG_TIMEOUT })
}

/** 比较盘：user_list[0]=A 内盘，[1]=B 外盘叠星 */
export async function fetchQizhengComparison({ personA, personB, lang } = {}) {
  const body = {
    user_list: [buildQizhengPerson(personA), buildQizhengPerson(personB)],
    lang: resolveRequestLang(lang)
  }
  return apiClient.post('/zhengyu/comparison', body, { timeout: QIZHENG_TIMEOUT })
}
