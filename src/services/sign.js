/**
 * 星座 API - 与 openapi-processed.json 中 /signs/**、/mySign 一致
 * 星座列表、星座详情、星座配对、我的星座
 */

import { apiClient } from './api'

const SIGN_UID = 'default'



/** 格式：1999-10-17 21:00:00 */
function toDateTime(dateStr, timeStr) {
  let t = (timeStr || '12:00:00').toString().trim()
  if (t.split(':').length === 2) t = t + ':00'
  return `${dateStr} ${t}`.trim() || `${dateStr} 12:00:00`
}

function unwrap(res) {
  if (res && typeof res === 'object' && 'data' in res) return res.data
  return res
}

/**
 * 星座列表 GET /signs
 * @returns {Promise<Array>} SignVo[]
 */
export async function fetchSigns() {
  const res = await apiClient.get('/signs')
  const data = unwrap(res)
  return Array.isArray(data) ? data : (data ? [data] : [])
}

/**
 * 星座详情 GET /signs/{sign_id}
 * @param {number} signId 1-12
 * @returns {Promise<object>} SignVo
 */
export async function fetchSignDetail(signId) {
  const res = await apiClient.get(`/signs/${signId}`)
  return unwrap(res) ?? null
}

/**
 * 星座配对 GET /signs/{sign_id}/compat
 * @param {number} signId 1-12
 * @returns {Promise<object>} dict int -> SignCompatVo[]，或 { [signId]: SignCompatVo[] }
 */
export async function fetchSignCompat(signId) {
  const res = await apiClient.get(`/signs/${signId}/compat`)
  return unwrap(res) ?? {}
}

/**
 * 我的星座 POST /mySign/{uid}
 * @param {object} params - { birthDate, birthTime, longitude, latitude, tz?, dst_auto? }
 * @param {string} uid
 * @returns {Promise<object>} MySignRespVo
 */
export function buildMySignBody(params) {
  const {
    birthDate,
    birthTime,
    longitude,
    latitude,
    tz = 8,
    dst_auto = true
  } = params
  return {
    birth_dt: toDateTime(birthDate, birthTime),
    longitude: Number(longitude),
    latitude: Number(latitude),
    tz: Number(tz) || 8,
    dst_auto: !!dst_auto
  }
}

export async function fetchMySign(params, uid = SIGN_UID) {
  const body = buildMySignBody(params)
  const res = await apiClient.post(`/mySign/${uid}`, body)
  return unwrap(res) ?? null
}
