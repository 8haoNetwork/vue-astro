import { apiClient } from './api'
import { resolveRequestLang } from '../utils/lang'

/** 术式类型（LiurenPanType） */
export const LIUREN_TYPE_OPTIONS = [
  { value: 'daliuren', label: '大六壬' },
  { value: 'jinkoujue', label: '金口诀' }
]

/** 贵人起法（LiurenGuiRenMethod） */
export const LIUREN_GUI_METHOD_OPTIONS = [
  { value: 'tian', label: '天贵' },
  { value: 'di', label: '地贵' }
]

/** 金口诀地分（LiurenDiFen） - value使用拼音 */
export const LIUREN_DI_FEN_OPTIONS = [
  { value: 'zi', label: '子' },
  { value: 'chou', label: '丑' },
  { value: 'yin', label: '寅' },
  { value: 'mao', label: '卯' },
  { value: 'chen', label: '辰' },
  { value: 'si', label: '巳' },
  { value: 'wu', label: '午' },
  { value: 'wei', label: '未' },
  { value: 'shen', label: '申' },
  { value: 'you', label: '酉' },
  { value: 'xu', label: '戌' },
  { value: 'hai', label: '亥' }
]

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
 * 构建大六壬请求体（LiurenQry）
 * @param {Object} form
 */
export function buildLiurenBody(form) {
  const date = String(form.date ?? '').trim()
  const time = normalizeTimeToSeconds(form.time)
  const body = {
    qry_dt: `${date} ${time}`,
    type: form.type || 'daliuren',
    gui_method: form.guiMethod || 'tian',
    lang: resolveRequestLang(form.lang),
    tz: form.tz ?? 8,
    dst_auto: form.dstAuto !== false
  }

  if (form.longitude != null && form.longitude !== '') {
    body.longitude = Number(form.longitude)
  }
  if (form.isSolarTime != null) {
    body.is_solar_time = form.isSolarTime !== false
  }
  if (body.type === 'jinkoujue' && form.diFen) {
    body.di_fen = form.diFen
  }

  return body
}

/**
 * POST /liuren
 * @returns {Promise<{ code: number, msg?: string, data?: object, exe_time?: number }>}
 */
export async function fetchLiuren(form) {
  const body = buildLiurenBody(form)
  return apiClient.post('/liuren', body)
}
