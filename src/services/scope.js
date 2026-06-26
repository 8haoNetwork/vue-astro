/**
 * 运势 API - 与 openapi-processed.json 中 /scope/** 一致
 * 日/周/月/年运势：ScopeQryReq(birth_point, transit_point) -> ScopeRespVo
 */

import { apiClient } from './api'
import { resolveRequestLang } from '../utils/lang'

const SCOPE_UID = 'default'

/** 格式：1999-10-17 21:00:00 */
function toDateTime(dateStr, timeStr) {
  let t = (timeStr || '12:00:00').toString().trim()
  if (t.split(':').length === 2) t = t + ':00'
  return `${dateStr} ${t}`.trim() || `${dateStr} 12:00:00`
}



/**
 * 构建运势请求体 ScopeQryReq
 * @param {object} params - { birthDate, birthTime, latitude, longitude, transitDate?, transitTime?, tz?, dst_auto? }
 */
export function buildScopeBody(params) {
  const {
    birthDate,
    birthTime,
    latitude,
    longitude,
    transitDate,
    transitTime,
    tz = 8,
    dst_auto = true
  } = params
  const birth_dt = toDateTime(birthDate, birthTime)
  const transit_dt = transitDate ? toDateTime(transitDate, transitTime || '12:00:00') : birth_dt
  const point = (dt) => ({
    birth_dt: dt,
    longitude: Number(longitude),
    latitude: Number(latitude),
    tz: Number(tz) || 8,
    dst_auto: !!dst_auto
  })
  return {
    birth_point: point(birth_dt),
    transit_point: point(transit_dt),
    lang: resolveRequestLang(params?.lang)
  }
}

/**
 * 请求运势接口
 * @param {'day'|'week'|'month'|'year'} scopeType
 * @param {object} params - 同 buildScopeBody
 * @param {string} uid - 路径中的 uid，默认 SCOPE_UID
 * @returns {Promise<object>} 接口返回的 data（ScopeRespVo）
 */
export async function fetchScope(scopeType, params, uid = SCOPE_UID) {
  const path = `/scope/${scopeType}/${uid}`
  const body = buildScopeBody(params)
  const res = await apiClient.post(path, body)
  return res?.data ?? res
}
