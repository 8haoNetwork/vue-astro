/**
 * 星盘 API - 与 openapi-processed.json 定义一致
 * 来源：astro_apiworks_web/public/openapi-processed.json
 * 鉴权：请求头 X-App-Id、X-App-Key（需配置 VITE_APP_ID / VITE_APP_KEY，或由代理注入）
 */

import { apiClient } from './api'

const CHART_BASE = '/chart'

// 星盘类型 → 接口路径 + 请求体类型（与 OpenAPI 一致）
// userListOrder: 'AB' | 'BA' 表示合盘时 user_list 为 [A,B] 或 [B,A]（比较盘A/B、马克盘A/B、马盘A/B三限/次限）
const CHART_API_MAP = [
  // ---------- 单盘（你给的 10 种）--------------
  { value: 'current', label: '天相盘', path: '/chart/current', schema: 'SinglePointQry' },
  { value: 'natal', label: '本命盘', path: '/chart/natal', schema: 'SinglePointQry' },
  { value: 'transit', label: '行运盘', path: '/chart/transit', schema: 'DoublePointQry' },
  { value: 'lunarReturn', label: '月返盘', path: '/chart/lunarReturn', schema: 'DoublePointQry' },
  { value: 'solarReturn', label: '日返盘', path: '/chart/solarReturn', schema: 'DoublePointQry' },
  { value: 'tripleLimit', label: '三限盘', path: '/chart/tripleLimit', schema: 'SpTransitDateQry' },
  { value: 'secondaryLimit', label: '次限盘', path: '/chart/secondaryLimit', schema: 'SpTransitDateQry' },
  { value: 'solarArc', label: '日弧盘', path: '/chart/solarArc', schema: 'SpTransitDateQry' },
  { value: 'smallLimit', label: '小限盘', path: '/chart/smallLimit', schema: 'SpTransitDateQry' },
  { value: 'firdaria', label: '法达盘', path: '/chart/firdaria', schema: 'SpTransitDateQry' },
  // ---------- 合盘（你给的 14 种）--------------
  { value: 'comparison_a', label: '比较盘A', path: '/chart/comparison', schema: 'DoublePointQry', userListOrder: 'AB' },
  { value: 'comparison_b', label: '比较盘B', path: '/chart/comparison', schema: 'DoublePointQry', userListOrder: 'BA' },
  { value: 'composite', label: '组合盘', path: '/chart/composite', schema: 'DoublePointQry' },
  { value: 'timesMidPoint', label: '时空中点盘', path: '/chart/timesMidPoint', schema: 'DoublePointQry' },
  { value: 'mark_a', label: '马克盘A', path: '/chart/marks', schema: 'DoublePointQry', userListOrder: 'AB' },
  { value: 'mark_b', label: '马克盘B', path: '/chart/marks', schema: 'DoublePointQry', userListOrder: 'BA' },
  { value: 'composeTripleLimit', label: '组合三限盘', path: '/chart/composeTripleLimit', schema: 'DpTransitDateQry' },
  { value: 'composeSecLimit', label: '组合次限盘', path: '/chart/composeSecLimit', schema: 'DpTransitDateQry' },
  { value: 'marksTripleLimit_a', label: '马盘A三限', path: '/chart/marksTripleLimit', schema: 'DpTransitDateQry', userListOrder: 'AB' },
  { value: 'marksTripleLimit_b', label: '马盘B三限', path: '/chart/marksTripleLimit', schema: 'DpTransitDateQry', userListOrder: 'BA' },
  { value: 'marksSecLimit_a', label: '马盘A次限', path: '/chart/marksSecLimit', schema: 'DpTransitDateQry', userListOrder: 'AB' },
  { value: 'marksSecLimit_b', label: '马盘B次限', path: '/chart/marksSecLimit', schema: 'DpTransitDateQry', userListOrder: 'BA' },
  { value: 'tmpTripleLimit', label: '时空三限', path: '/chart/tmpTripleLimit', schema: 'DpTransitDateQry' },
  { value: 'tmpSecLimit', label: '时空次限', path: '/chart/tmpSecLimit', schema: 'DpTransitDateQry' }
]

// 单盘：天相盘、本命盘、行运盘、月返盘、日返盘、三限盘、次限盘、日弧盘、小限盘、法达盘（10 种）
export const SINGLE_CHART_TYPES = [
  'current', 'natal', 'transit', 'lunarReturn', 'solarReturn',
  'tripleLimit', 'secondaryLimit', 'solarArc', 'smallLimit', 'firdaria'
].map((value) => CHART_API_MAP.find((c) => c.value === value))

// 合盘：比较盘A、比较盘B、组合盘、时空中点盘、马克盘A、马克盘B、组合三限盘、组合次限盘、马盘A三限、马盘B三限、马盘A次限、马盘B次限、时空三限、时空次限（14 种）
export const COMPOSITE_CHART_TYPES = [
  'comparison_a', 'comparison_b', 'composite', 'timesMidPoint', 'mark_a', 'mark_b',
  'composeTripleLimit', 'composeSecLimit', 'marksTripleLimit_a', 'marksTripleLimit_b',
  'marksSecLimit_a', 'marksSecLimit_b', 'tmpTripleLimit', 'tmpSecLimit'
].map((value) => CHART_API_MAP.find((c) => c.value === value))

// 需要“推运日期”的盘（SpTransitDateQry 或 DpTransitDateQry）
export const TRANSIT_DATE_CHART_TYPES = [
  ...SINGLE_CHART_TYPES.filter((c) => c.schema === 'SpTransitDateQry').map((c) => c.value),
  ...COMPOSITE_CHART_TYPES.filter((c) => c.schema === 'DpTransitDateQry').map((c) => c.value)
]

export function getChartConfig(value) {
  return CHART_API_MAP.find((c) => c.value === value) || null
}

/** 格式：1999-10-17 21:00:00 */
function toBirthDt(dateStr, timeStr) {
  let t = (timeStr || '12:00:00').toString().trim()
  if (t.split(':').length === 2) t = t + ':00'
  return `${dateStr} ${t}`.trim() || `${dateStr} 12:00:00`
}

/** 单点查询体 SinglePointQry */
function buildSinglePointQry(params) {
  const { birthDate, birthTime, latitude, longitude, tz = 8 } = params
  return {
    birth_dt: toBirthDt(birthDate, birthTime),
    longitude: Number(longitude),
    latitude: Number(latitude),
    tz: Number(tz) || 8,
    dst_auto: true
  }
}

/** 双点查询体 DoublePointQry：user_list 为两人或 [出生, 推运]；userListOrder 'BA' 时顺序为 [B, A] */
function buildDoublePointQry(params, userListOrder = 'AB') {
  const tz = Number(params.tz) || 8
  // 单盘行运/月返/日返：只有 birthDate + transitDate（同一经纬度）
  if (params.birthDate != null && params.transitDate != null && params.birthDateA == null) {
    const lat = Number(params.latitude)
    const lng = Number(params.longitude)
    const userList = [
      { birth_dt: toBirthDt(params.birthDate, params.birthTime), latitude: lat, longitude: lng, tz },
      { birth_dt: toBirthDt(params.transitDate, params.transitTime), latitude: lat, longitude: lng, tz }
    ]
    return { user_list: userList }
  }
  const {
    birthDateA,
    birthTimeA,
    latitudeA,
    longitudeA,
    birthDateB,
    birthTimeB,
    latitudeB,
    longitudeB
  } = params
  const personA = {
    birth_dt: toBirthDt(birthDateA, birthTimeA),
    latitude: Number(latitudeA),
    longitude: Number(longitudeA),
    tz
  }
  const personB = {
    birth_dt: toBirthDt(birthDateB, birthTimeB),
    latitude: Number(latitudeB),
    longitude: Number(longitudeB),
    tz
  }
  const userList = userListOrder === 'BA' ? [personB, personA] : [personA, personB]
  return { user_list: userList }
}

/** 单点+推运日 SpTransitDateQry */
function buildSpTransitDateQry(params) {
  const { birthDate, birthTime, latitude, longitude, transitDate, transitTime, tz = 8 } = params
  return {
    birth_dt: toBirthDt(birthDate, birthTime),
    longitude: Number(longitude),
    latitude: Number(latitude),
    transit_dt: toBirthDt(transitDate || birthDate, transitTime),
    tz: Number(tz) || 8,
    dst_auto: true
  }
}

/** 双点+推运日 DpTransitDateQry；userListOrder 'BA' 时 user_list 为 [B, A] */
function buildDpTransitDateQry(params, userListOrder = 'AB') {
  const body = buildDoublePointQry(params, userListOrder)
  const { transitDate, transitTime } = params
  body.transit_dt = toBirthDt(transitDate || params.birthDateB, transitTime)
  return body
}



/**
 * 统一请求星盘接口
 * @param {string} chartType - 类型 value（如 natal, comparison）
 * @param {object} params - 表单参数（单盘/双盘/推运日等）
 * @returns {Promise<object>} 接口返回 data 或整体
 */
export async function fetchChart(chartType, params) {
  const config = getChartConfig(chartType)
  if (!config) throw new Error(`未知星盘类型: ${chartType}`)

  const userListOrder = config.userListOrder || 'AB'
  let body
  switch (config.schema) {
    case 'SinglePointQry':
      body = buildSinglePointQry(params)
      break
    case 'DoublePointQry':
      body = buildDoublePointQry(params, userListOrder)
      break
    case 'SpTransitDateQry':
      body = buildSpTransitDateQry(params)
      break
    case 'DpTransitDateQry':
      body = buildDpTransitDateQry(params, userListOrder)
      break
    default:
      throw new Error(`不支持的 schema: ${config.schema}`)
  }

  const res = await apiClient.post(config.path, body)
  return res?.data ?? res
}
