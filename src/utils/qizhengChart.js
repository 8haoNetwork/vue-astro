/** 政余圆盘几何与量天尺。
 * 南上北下：午中在 12 点，子中在 6 点。子宫 5:30–6:30（子初 5:30，子末 6:30）。
 * 顺时针子丑寅卯。春分=戌 0°=白羊；黄经增加为逆时针（戌→酉→申…）。
 */

export const BRANCH_ORDER = [
  'zi', 'chou', 'yin', 'mao', 'chen', 'si',
  'wu', 'wei', 'shen', 'you', 'xu', 'hai'
]

/** 圆盘角：12 点为 0、顺时针。南上北下，子中=6 点。 */
export const WHEEL_ZI_MID = 180

export const BRANCH_WUXING = {
  zi: 'water',
  chou: 'earth',
  yin: 'wood',
  mao: 'wood',
  chen: 'earth',
  si: 'fire',
  wu: 'fire',
  wei: 'earth',
  shen: 'metal',
  you: 'metal',
  xu: 'earth',
  hai: 'water'
}

/**
 * 地支 / 八卦 / 宫主 / 星座：同一套十二格，每格 30°，与十二次对齐。
 * 与本命无关、永不转动。南上北下，子中在 6 点，顺时针子丑寅卯。
 * 春分 = 戌宫 0° = 白羊；黄经增加时地支逆行（戌→酉→申…）。
 * 降娄起戌；后天配支；宫主是格子主人（非七政）。
 */
export const CI_SECTORS = [
  { branch: 'zi', branchLabel: '子', bagua: '坎', palaceLord: '土', sign: '宝瓶', signShort: '瓶', lon0: 300, lon1: 330 },
  { branch: 'chou', branchLabel: '丑', bagua: '艮', palaceLord: '土', sign: '摩羯', signShort: '羯', lon0: 270, lon1: 300 },
  { branch: 'yin', branchLabel: '寅', bagua: '艮', palaceLord: '木', sign: '人马', signShort: '射', lon0: 240, lon1: 270 },
  { branch: 'mao', branchLabel: '卯', bagua: '震', palaceLord: '火', sign: '天蝎', signShort: '蝎', lon0: 210, lon1: 240 },
  { branch: 'chen', branchLabel: '辰', bagua: '巽', palaceLord: '金', sign: '天秤', signShort: '秤', lon0: 180, lon1: 210 },
  { branch: 'si', branchLabel: '巳', bagua: '巽', palaceLord: '水', sign: '处女', signShort: '女', lon0: 150, lon1: 180 },
  { branch: 'wu', branchLabel: '午', bagua: '离', palaceLord: '日', sign: '狮子', signShort: '狮', lon0: 120, lon1: 150 },
  { branch: 'wei', branchLabel: '未', bagua: '坤', palaceLord: '月', sign: '巨蟹', signShort: '蟹', lon0: 90, lon1: 120 },
  { branch: 'shen', branchLabel: '申', bagua: '坤', palaceLord: '水', sign: '双子', signShort: '双', lon0: 60, lon1: 90 },
  { branch: 'you', branchLabel: '酉', bagua: '兑', palaceLord: '金', sign: '金牛', signShort: '牛', lon0: 30, lon1: 60 },
  { branch: 'xu', branchLabel: '戌', bagua: '乾', palaceLord: '火', sign: '白羊', signShort: '羊', lon0: 0, lon1: 30 },
  { branch: 'hai', branchLabel: '亥', bagua: '乾', palaceLord: '木', sign: '双鱼', signShort: '鱼', lon0: 330, lon1: 360 }
]

const CI_BY_BRANCH = Object.fromEntries(CI_SECTORS.map((s) => [s.branch, s]))

export function ciSectorByBranch(branch) {
  return CI_BY_BRANCH[branch] || null
}

export const WUXING_FILL = {
  wood: '#7d9a5a',
  fire: '#c45c4a',
  earth: '#c4a35a',
  metal: '#b8a478',
  water: '#5a7a9a'
}

export const WUXING_SOFT = {
  wood: '#e7eedd',
  fire: '#f6e4e0',
  earth: '#f4ead6',
  metal: '#f0ebe0',
  water: '#e2eaf2'
}

export const STAR_COLORS = {
  sun: '#d4a017',
  moon: '#8a9bb5',
  mercury: '#5b8a6a',
  venus: '#c48a9a',
  mars: '#c0453a',
  jupiter: '#4a8a4a',
  saturn: '#8a6a3a',
  rahu: '#5a3a6a',
  ketu: '#3a3a3a',
  yuebei: '#3a5a8a',
  ziqi: '#6a4a9a'
}

/** 十一曜圆盘单字 */
export const STAR_SHORT = {
  sun: '日',
  moon: '月',
  mercury: '水',
  venus: '金',
  mars: '火',
  jupiter: '木',
  saturn: '土',
  rahu: '罗',
  ketu: '计',
  yuebei: '孛',
  ziqi: '炁'
}

export function starNameShort(star) {
  if (star?.key && STAR_SHORT[star.key]) return STAR_SHORT[star.key]
  const s = String(star?.label || '').trim()
  return s.charAt(0) || ''
}

/**
 * 将挤在一起的标注角拉开，真实落点仍用原始度数。
 * @param {number[]} degs 圆盘角（顺时针，12 点为 0）
 * @param {number} minSep 最小间隔（度）
 */
export function spreadWheelDegs(degs, minSep) {
  const n = degs.length
  if (n === 0) return []
  if (n === 1) return [((Number(degs[0]) % 360) + 360) % 360]
  const sorted = degs.map((d, i) => ({
    i,
    a: ((Number(d) % 360) + 360) % 360
  })).sort((x, y) => x.a - y.a)
  const a = sorted.map((s) => s.a)
  for (let iter = 0; iter < 16; iter++) {
    let changed = false
    for (let k = 0; k < n; k++) {
      const a1 = k === n - 1 ? a[0] + 360 : a[k + 1]
      const gap = a1 - a[k]
      if (gap < minSep) {
        const push = (minSep - gap) / 2
        a[k] -= push
        if (k === n - 1) a[0] += push
        else a[k + 1] += push
        changed = true
      }
    }
    if (!changed) break
  }
  const out = new Array(n)
  sorted.forEach((s, k) => {
    out[s.i] = ((a[k] % 360) + 360) % 360
  })
  return out
}

export const ASPECT_COLORS = {
  conjunct: '#c4a35a',
  trine: '#5a8a5a',
  oppose: '#c45c4a'
}

/**
 * 今宿量天尺（历元约 2026），与后端 MODERN_XIU_SPANS 一致。
 * 圆盘优先用 natal.xiu_spans；缺省才用本表。室跨 0°：lon1 < lon0。
 */
export const XIU_SPANS = [
  { xiu: 'bi', lon0: 9.53, lon1: 20.95 },
  { xiu: 'kui', lon0: 20.95, lon1: 34.34 },
  { xiu: 'lou', lon0: 34.34, lon1: 47.31 },
  { xiu: 'weiTu', lon0: 47.31, lon1: 59.78 },
  { xiu: 'mao', lon0: 59.78, lon1: 68.84 },
  { xiu: 'biYue', lon0: 68.84, lon1: 84.08 },
  { xiu: 'zui', lon0: 84.08, lon1: 85.05 },
  { xiu: 'shenXiu', lon0: 85.05, lon1: 95.67 },
  { xiu: 'jing', lon0: 95.67, lon1: 126.1 },
  { xiu: 'gui', lon0: 126.1, lon1: 130.67 },
  { xiu: 'liu', lon0: 130.67, lon1: 147.65 },
  { xiu: 'xing', lon0: 147.65, lon1: 156.06 },
  { xiu: 'zhang', lon0: 156.06, lon1: 174.06 },
  { xiu: 'yi', lon0: 174.06, lon1: 191.1 },
  { xiu: 'zhen', lon0: 191.1, lon1: 204.21 },
  { xiu: 'jiao', lon0: 204.21, lon1: 214.86 },
  { xiu: 'kang', lon0: 214.86, lon1: 225.45 },
  { xiu: 'di', lon0: 225.45, lon1: 243.31 },
  { xiu: 'fang', lon0: 243.31, lon1: 248.17 },
  { xiu: 'xin', lon0: 248.17, lon1: 256.53 },
  { xiu: 'wei', lon0: 256.53, lon1: 271.63 },
  { xiu: 'ji', lon0: 271.63, lon1: 280.55 },
  { xiu: 'dou', lon0: 280.55, lon1: 304.42 },
  { xiu: 'niu', lon0: 304.42, lon1: 312.09 },
  { xiu: 'nu', lon0: 312.09, lon1: 323.77 },
  { xiu: 'xu', lon0: 323.77, lon1: 333.72 },
  { xiu: 'weiXiu', lon0: 333.72, lon1: 353.86 },
  { xiu: 'shi', lon0: 353.86, lon1: 9.53 }
]

export function xiuSpansForWheel(natal) {
  const list = natal?.xiu_spans
  if (Array.isArray(list) && list.length) {
    return list.map((s) => ({
      xiu: s.xiu,
      lon0: Number(s.longitude_start),
      lon1: Number(s.longitude_end),
      labelText: s.xiu_label || XIU_LABELS[s.xiu] || s.xiu
    }))
  }
  return XIU_SPANS.map((s) => ({
    ...s,
    labelText: XIU_LABELS[s.xiu] || s.xiu
  }))
}

export const XIU_LABELS = {
  jiao: '角',
  kang: '亢',
  di: '氐',
  fang: '房',
  xin: '心',
  wei: '尾',
  ji: '箕',
  dou: '斗',
  niu: '牛',
  nu: '女',
  xu: '虚',
  weiXiu: '危',
  shi: '室',
  bi: '壁',
  kui: '奎',
  lou: '娄',
  weiTu: '胃',
  mao: '昴',
  biYue: '毕',
  zui: '觜',
  shenXiu: '参',
  jing: '井',
  gui: '鬼',
  liu: '柳',
  xing: '星',
  zhang: '张',
  yi: '翼',
  zhen: '轸'
}

/** 二十八宿日度主 */
export const XIU_LORDS = {
  jiao: { lord: 'wood', lordLabel: '木' },
  kang: { lord: 'metal', lordLabel: '金' },
  di: { lord: 'earth', lordLabel: '土' },
  fang: { lord: 'sun', lordLabel: '日' },
  xin: { lord: 'moon', lordLabel: '月' },
  wei: { lord: 'fire', lordLabel: '火' },
  ji: { lord: 'water', lordLabel: '水' },
  dou: { lord: 'wood', lordLabel: '木' },
  niu: { lord: 'metal', lordLabel: '金' },
  nu: { lord: 'earth', lordLabel: '土' },
  xu: { lord: 'sun', lordLabel: '日' },
  weiXiu: { lord: 'moon', lordLabel: '月' },
  shi: { lord: 'fire', lordLabel: '火' },
  bi: { lord: 'water', lordLabel: '水' },
  kui: { lord: 'wood', lordLabel: '木' },
  lou: { lord: 'metal', lordLabel: '金' },
  weiTu: { lord: 'earth', lordLabel: '土' },
  mao: { lord: 'sun', lordLabel: '日' },
  biYue: { lord: 'moon', lordLabel: '月' },
  zui: { lord: 'fire', lordLabel: '火' },
  shenXiu: { lord: 'water', lordLabel: '水' },
  jing: { lord: 'wood', lordLabel: '木' },
  gui: { lord: 'metal', lordLabel: '金' },
  liu: { lord: 'earth', lordLabel: '土' },
  xing: { lord: 'sun', lordLabel: '日' },
  zhang: { lord: 'moon', lordLabel: '月' },
  yi: { lord: 'fire', lordLabel: '火' },
  zhen: { lord: 'water', lordLabel: '水' }
}

function xiuSpanContains(n, span) {
  if (span.lon1 > span.lon0) return n >= span.lon0 && n < span.lon1
  return n >= span.lon0 || n < span.lon1
}

function xiuDegreeInSpan(n, span) {
  if (span.lon1 > span.lon0) return n - span.lon0
  return n >= span.lon0 ? n - span.lon0 : n + 360 - span.lon0
}

/** 回归黄经 → 所在宿及宿度（与圆盘量天尺同一套表） */
export function xiuDegreeAt(lon) {
  const n = ((Number(lon) % 360) + 360) % 360
  const span = XIU_SPANS.find((s) => xiuSpanContains(n, s)) || XIU_SPANS[XIU_SPANS.length - 1]
  const meta = XIU_LORDS[span.xiu] || {}
  const label = XIU_LABELS[span.xiu] || span.xiu
  return {
    xiu: span.xiu,
    xiuLabel: label,
    degree: xiuDegreeInSpan(n, span),
    lord: meta.lord || '',
    lordLabel: meta.lordLabel || '',
    display: `${label}${meta.lordLabel || ''}`
  }
}

/** 回归黄经 → 圆盘角（12 点为 0，顺时针）。子中(黄经 315°)=6 点。 */
export function lonToWheelDeg(lon) {
  const n = ((Number(lon) % 360) + 360) % 360
  return (315 - n + WHEEL_ZI_MID + 360) % 360
}

export function palaceDegreeToWheelDeg(branch, degree) {
  const i = BRANCH_ORDER.indexOf(branch)
  if (i < 0) return lonToWheelDeg(0)
  return ((i + 1) * 30 - 15 - Number(degree) + WHEEL_ZI_MID + 360) % 360
}

export function starWheelDeg(star) {
  return lonToWheelDeg(star?.longitude ?? 0)
}

export function polar(cx, cy, r, wheelDeg) {
  const rad = (wheelDeg * Math.PI) / 180
  return {
    x: cx + r * Math.sin(rad),
    y: cy - r * Math.cos(rad)
  }
}

export function tropicalSpanToWheelArc(lon0, lon1) {
  const start = lonToWheelDeg(lon1)
  const end = lonToWheelDeg(lon0)
  return { start, sweep: (end - start + 360) % 360 }
}

export function annularSectorPath(cx, cy, rInner, rOuter, startDeg, sweepDeg) {
  if (!(sweepDeg > 0) || sweepDeg >= 359.99) {
    return [
      `M ${cx} ${cy - rOuter}`,
      `A ${rOuter} ${rOuter} 0 1 1 ${cx} ${cy + rOuter}`,
      `A ${rOuter} ${rOuter} 0 1 1 ${cx} ${cy - rOuter}`,
      `M ${cx} ${cy - rInner}`,
      `A ${rInner} ${rInner} 0 1 0 ${cx} ${cy + rInner}`,
      `A ${rInner} ${rInner} 0 1 0 ${cx} ${cy - rInner}`,
      'Z'
    ].join(' ')
  }
  const large = sweepDeg > 180 ? 1 : 0
  const p0 = polar(cx, cy, rOuter, startDeg)
  const p1 = polar(cx, cy, rOuter, startDeg + sweepDeg)
  const p2 = polar(cx, cy, rInner, startDeg + sweepDeg)
  const p3 = polar(cx, cy, rInner, startDeg)
  return [
    `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
    `L ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${p3.x.toFixed(2)} ${p3.y.toFixed(2)}`,
    'Z'
  ].join(' ')
}

export function formatDeg(deg) {
  if (deg == null || Number.isNaN(Number(deg))) return ''
  const n = Number(deg)
  const sign = n < 0 ? '-' : ''
  const abs = Math.abs(n)
  let d = Math.floor(abs)
  let m = Math.round((abs - d) * 60)
  if (m === 60) {
    d += 1
    m = 0
  }
  return `${sign}${d}°${String(m).padStart(2, '0')}′`
}

/** 度数两位小数，如 12.20° */
export function formatDegDecimal(deg, digits = 2) {
  if (deg == null || Number.isNaN(Number(deg))) return ''
  return `${Number(deg).toFixed(digits)}°`
}

export function formatPalaceDegree(branchLabel, degree) {
  if (!branchLabel && degree == null) return ''
  return `${branchLabel || ''} ${formatDeg(degree)}`.trim()
}

export function formatPalaceDegreeDecimal(branchLabel, degree, digits = 2) {
  if (!branchLabel && degree == null) return ''
  return `${branchLabel || ''} ${formatDegDecimal(degree, digits)}`.trim()
}

export function starColor(key) {
  return STAR_COLORS[key] || '#666'
}

export function branchFill(branch) {
  return WUXING_SOFT[BRANCH_WUXING[branch]] || '#f3eee6'
}

export function branchStroke(branch) {
  return WUXING_FILL[BRANCH_WUXING[branch]] || '#c4a35a'
}

/** 十二宫名 → 单字简写（圆盘标注用） */
const PALACE_NAME_SHORT = {
  ming: '命',
  wealth: '财',
  sibling: '兄',
  property: '田',
  children: '男',
  servant: '奴',
  spouse: '夫',
  health: '疾',
  travel: '迁',
  career: '官',
  fortune: '福',
  appearance: '相',
  parents: '父'
}

const PALACE_LABEL_SHORT = {
  命: '命',
  命宫: '命',
  财帛: '财',
  财帛宫: '财',
  兄弟: '兄',
  兄弟宫: '兄',
  田宅: '田',
  田宅宫: '田',
  男女: '男',
  子女: '子',
  奴仆: '奴',
  交友: '友',
  夫妻: '夫',
  疾厄: '疾',
  迁移: '迁',
  官禄: '官',
  福德: '福',
  相貌: '相',
  父母: '父'
}

/** 按 palace_index 取十二宫；宫名在 palaces[].name，不在 stars 上。 */
export function palaceByIndex(palaces, index) {
  if (!Array.isArray(palaces) || index == null) return null
  return palaces.find((p) => p.index === index) || palaces[index] || null
}

export function palaceNameByIndex(palaces, index) {
  return palaceByIndex(palaces, index)?.name || ''
}

export function xiuSpanByKey(spans, xiu) {
  if (!Array.isArray(spans) || !xiu) return null
  return spans.find((s) => s.xiu === xiu) || null
}

export function xiuDisplayByKey(spans, xiu) {
  const span = xiuSpanByKey(spans, xiu)
  if (!span) return ''
  return `${span.xiu_label || ''}${span.lord_label || ''}`
}

/**
 * 十二宫显示简写：优先 key，其次完整中文名，最后取首字。
 * @param {{ key?: string, name?: string }|string|null} palaceOrName
 */
export function palaceNameShort(palaceOrName) {
  if (palaceOrName == null) return ''
  if (typeof palaceOrName === 'string') {
    const s = palaceOrName.trim()
    return PALACE_LABEL_SHORT[s] || s.charAt(0) || ''
  }
  if (palaceOrName.key && PALACE_NAME_SHORT[palaceOrName.key]) {
    return PALACE_NAME_SHORT[palaceOrName.key]
  }
  const name = String(palaceOrName.name || palaceOrName.palace_name || '').trim()
  return PALACE_LABEL_SHORT[name] || name.charAt(0) || ''
}
