
/** 本命四柱顺序，与后端 type 一致 */
export const natalPillarOrder = ['natal_year', 'natal_month', 'natal_day', 'natal_hour']

export const emptyPillar = type => ({
  type,
  tg: '--',
  dz: '--',
  gan_shen: '--',
  zhi_shen: [],
  cang_gan: [],
  na_yin: '--',
  kong_wang: '--',
  di_shi: '--',
  zi_zuo: '--',
  shen_sha: []
})

export const emptyFlow = type => ({
  type,
  key: '--',
  sub_key: '',
  tg: '--',
  tg_shen_sha: '',
  dz: '--',
  dz_shen_sha: '',
  na_yin_wx: '',
  is_current: false
})

/**
 * 按给定顺序返回 pillars，与 natal/flow 返回数量一致。
 * @param pillars 接口返回的 pillars 数组
 * @param order 可选，type 顺序；不传则用本命四柱顺序（4 列）
 */
export function pillarList(pillars = [], order = null) {
  const list = Array.isArray(pillars) ? pillars : []
  const map = new Map(list.map(item => [item.type, item]))
  const orderToUse = order && order.length ? order : natalPillarOrder
  return orderToUse.map(type => map.get(type) || emptyPillar(type))
}

/** 流盘表格中不展示的 type（如流时 hourly） */
const flowPillarHiddenTypes = ['hourly', 'flow_hour']

/**
 * 流盘：按 flow.pillars 的顺序与数量返回，与 natal 同结构（数量可不同）。
 * 不包含 flowPillarHiddenTypes 中的列（如流时）。
 */
export function flowPillarList(flow) {
  const list = (flow?.pillars || []).filter(
    p => !flowPillarHiddenTypes.includes(p.type)
  )
  const order = list.map(p => p.type)
  return pillarList(list, order.length ? order : natalPillarOrder)
}

/** 表头列名：type -> 显示文案 */
const pillarLabelMap = {
  natal_year: '年柱',
  natal_month: '月柱',
  natal_day: '日柱',
  natal_hour: '时柱',
  decadal: '大运',
  annual: '流年',
  monthly: '流月',
  daily: '流日'
}
export function pillarColumnLabel(type) {
  return pillarLabelMap[type] || type || '--'
}

/**
 * 大运起运文案：1982年02月03日(9.3岁) 起运
 * @param flowStartDt 起运日期时间字符串，如 "1982-02-03 11:04" 或 "1982-02-03"
 * @param age 起运年龄，如 9.3（可选）
 */
export function formatFlowStart(flowStartDt, age) {
  if (!flowStartDt) return '-- 起运'
  const s = String(flowStartDt).trim()
  const match = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
  const part1 = match
    ? `${match[1]}年${match[2].padStart(2, '0')}月${match[3].padStart(2, '0')}日`
    : s
  const part2 = age != null && age !== '' ? `(${Number(age)}岁)` : ''
  return `${part1}${part2} 起运`
}

export const joinList = value => Array.isArray(value) ? (value.length ? value.join(' ') : '--') : (value || '--')

/** 数组每项占一行，用于藏干、支神、神煞等 */
export const joinListLines = value => Array.isArray(value) ? (value.length ? value.join('\n') : '--') : (value || '--')

/** 数组合并为一行，顿号分隔，用于天干冲克、地支冲克等 */
export const joinListComma = value => Array.isArray(value) ? (value.length ? value.join('、') : '--') : (value || '--')

/** 旺相囚死一行五格，不足补 -- */
export function wangXiangRow(arr) {
  const list = Array.isArray(arr) ? [...arr] : []
  while (list.length < 5) list.push('--')
  return list.slice(0, 5)
}

const stemColorMap = {
  甲: 'wood', 乙: 'wood',
  丙: 'fire', 丁: 'fire',
  戊: 'earth', 己: 'earth',
  庚: 'metal', 辛: 'metal',
  壬: 'water', 癸: 'water'
}

const branchColorMap = {
  寅: 'wood', 卯: 'wood',
  巳: 'fire', 午: 'fire',
  申: 'metal', 酉: 'metal',
  亥: 'water', 子: 'water',
  辰: 'earth', 戌: 'earth', 丑: 'earth', 未: 'earth'
}

/** 天干地支五行 class */
export function wuXingClass(value) {
  const first = (value || '').slice(0, 1)
  return stemColorMap[first] || branchColorMap[first] || ''
}

/** 旺相囚死按五行上色，如 "土旺" -> earth */
const wangXiangWxMap = { 木: 'wood', 火: 'fire', 土: 'earth', 金: 'metal', 水: 'water' }
export function wangXiangClass(value) {
  const first = (value || '').slice(0, 1)
  return wangXiangWxMap[first] || ''
}

/** 请求参数，birthDate/birthTime 为字符串 */
export function buildBaziQry(birthDate, birthTime) {
  return {
    birth_dt: `${birthDate} ${birthTime}`,
    tz: 8,
    gender: 'male',
    is_solar_time: false,
    is_late_zi: false
  }
}

/**
 * 合盘请求参数
 * @param yourBirthDate 自己的出生日期 'YYYY-MM-DD'
 * @param yourBirthTime 自己的出生时间 'HH:mm' 或 'HH:mm:ss'
 * @param otherBirthDate 对方的出生日期 'YYYY-MM-DD'
 * @param otherBirthTime 对方的出生时间 'HH:mm' 或 'HH:mm:ss'
 */
export function buildBaziMatchQry(
  yourBirthDate,
  yourBirthTime,
  otherBirthDate,
  otherBirthTime
) {
  const your = buildBaziQry(yourBirthDate, yourBirthTime)
  return {
    ...your,
    other_birth_dt: `${otherBirthDate} ${otherBirthTime}`,
    other_gender: 'female',
  }
}
