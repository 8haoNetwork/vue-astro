/**
 * 星盘 SVG 标签：依赖 SVG 节点 `serial="p_<planet_en>"` / `serial="s_<sign_en>"`，映射为中文简称或 Unicode 符号。
 */

export const CHART_LABEL_MODES = /** @type {const} */ (['zh', 'symbol'])

/** @typedef {'zh' | 'symbol'} ChartLabelMode */

const SIGN_ORDER = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces'
]

/** Unicode 黄道十二宫 U+2648–U+2653 */
export const SIGN_EN_TO_SYMBOL = Object.fromEntries(
  SIGN_ORDER.map((en, i) => [en, String.fromCodePoint(0x2648 + i)])
)

/** 黄道十二宫：单字简称（羊牛双蟹狮女秤蝎射羯瓶鱼） */
export const SIGN_EN_TO_ZH = {
  Aries: '羊',
  Taurus: '牛',
  Gemini: '双',
  Cancer: '蟹',
  Leo: '狮',
  Virgo: '女',
  Libra: '秤',
  Scorpio: '蝎',
  Sagittarius: '射',
  Capricorn: '羯',
  Aquarius: '瓶',
  Pisces: '鱼'
}

/** 主要行星与虚点：Unicode 占星符号；未列出的天体在符号模式下回退为 planet_en */
export const PLANET_EN_TO_SYMBOL = {
  Sun: '\u2609',
  Moon: '\u263d',
  Mercury: '\u263f',
  Venus: '\u2640',
  Mars: '\u2642',
  Jupiter: '\u2643',
  Saturn: '\u2644',
  Uranus: '\u2645',
  Neptune: '\u2646',
  Pluto: '\u2647',
  Chiron: '\u26b7',
  Ascendant: '\u2191',
  MC: 'MC',
  IC: 'IC',
  Des: 'DS',
  Descendant: 'DS',
  trueNode: '\u260a',
  meanNode: '\u260a',
  TrueSouthNode: '\u260b',
  MeanSouthNode: '\u260b',
  PartOfFortune: '\u2295',
  Vertex: 'Vx',
  oscApogee: '\u26b8',
  meanApogee: '\u26b8',
  Ceres: '\u26b3',
  Pallas: '\u26b4',
  Juno: '\u26b5',
  Vesta: '\u26b6',
  Eros: 'Er',
  Pholus: '\u2bdb',
  Cupido: '\u2be0',
  Hades: '\u2be1',
  Zeus: '\u2be2',
  Kronos: '\u2be3',
  Apollon: '\u2be4',
  Admetos: '\u2be5',
  Vulcanus: '\u2be6',
  Poseidon: '\u2be7',
  equatAsc: '\u2191',
  'Sun-Moon': '\u2296'
}

/**
 * 符号模式里用拉丁缩写的（MC、IC、DS、Vx）：与 ☉♃ 等相比略缩小字号。
 */
const COMPACT_ASCII_SYMBOLS = new Set(
  Object.values(PLANET_EN_TO_SYMBOL).filter(
    (v) => typeof v === 'string' && /^[A-Za-z]{2,3}$/.test(v)
  )
)

const COMPACT_SYMBOL_SCALE = 0.68

/**
 * @param {Element} el SVG text/tspan
 * @param {string} text 已写入的展示文本
 * @param {ChartLabelMode} mode
 */
function applyCompactAsciiSymbolFontSize(el, text, mode) {
  el.style.removeProperty('font-size')
  if (mode !== 'symbol' || !text || !COMPACT_ASCII_SYMBOLS.has(text)) return
  const view = el.ownerDocument?.defaultView
  if (!view?.getComputedStyle) return
  const basePx = parseFloat(view.getComputedStyle(el).fontSize)
  if (!basePx || Number.isNaN(basePx)) return
  el.style.fontSize = `${Math.max(8, Math.round(basePx * COMPACT_SYMBOL_SCALE))}px`
}

/** 行星与虚点：单字简称 */
export const PLANET_EN_TO_ZH = {
  Sun: '日',
  Moon: '月',
  Mercury: '水',
  Venus: '金',
  Mars: '火',
  Jupiter: '木',
  Saturn: '土',
  Uranus: '天',
  Neptune: '海',
  Pluto: '冥',
  Chiron: '凯',
  Ascendant: '升',
  MC: '顶',
  IC: '底',
  Des: '降',
  Descendant: '降',
  meanNode: '北',
  'Mean Node': '北',
  MeanSouthNode: '南',
  PartOfFortune: '福',
  Vertex: '宿',
  oscApogee: '振',
  meanApogee: '莉',
  Ceres: '谷',
  Pallas: '智',
  Juno: '婚',
  Vesta: '灶',
  Psyche: '灵',
  Eros: '爱',
  Pholus: '人龙',
  Cupido: '丘',
  Hades: '哈',
  Zeus: '宙',
  Kronos: '克',
  Apollon: '阿',
  Admetos: '德',
  Vulcanus: '伏',
  Poseidon: '波',
  equatAsc: '东',
  'Sun-Moon': '中'
}

const PLANET_EN_TO_ZH_IC = new Map(
  Object.entries(PLANET_EN_TO_ZH).map(([k, v]) => [k.toLowerCase(), v])
)
const PLANET_EN_TO_SYMBOL_IC = new Map(
  Object.entries(PLANET_EN_TO_SYMBOL).map(([k, v]) => [k.toLowerCase(), v])
)
const SIGN_EN_TO_ZH_IC = new Map(
  Object.entries(SIGN_EN_TO_ZH).map(([k, v]) => [k.toLowerCase(), v])
)
const SIGN_EN_TO_SYMBOL_IC = new Map(
  Object.entries(SIGN_EN_TO_SYMBOL).map(([k, v]) => [k.toLowerCase(), v])
)

const DATA_PLANET = 'data-astro-planet-en'
const DATA_SIGN = 'data-astro-sign-en'

const SERIAL_PLANET_PREFIX = 'p_'
const SERIAL_SIGN_PREFIX = 's_'

/**
 * @param {string | null | undefined} serial
 * @returns {{ kind: 'planet', key: string } | { kind: 'sign', key: string } | null}
 */
export function parseChartSerial(serial) {
  if (serial == null || typeof serial !== 'string') return null
  const t = serial.trim()
  if (t.startsWith(SERIAL_PLANET_PREFIX)) {
    const key = t.slice(SERIAL_PLANET_PREFIX.length)
    if (key) return { kind: 'planet', key }
  }
  if (t.startsWith(SERIAL_SIGN_PREFIX)) {
    const raw = t.slice(SERIAL_SIGN_PREFIX.length)
    if (!raw) return null
    const canonical = SIGN_ORDER.find((s) => s.toLowerCase() === raw.toLowerCase())
    if (canonical) return { kind: 'sign', key: canonical }
  }
  return null
}

function getPlanetList(chartData) {
  const raw = chartData?.planet ?? chartData?.planets
  return Array.isArray(raw) ? raw : []
}

/**
 * 从当前节点向上查找第一个 `serial="p_*"`，得到 planet_en（用于顺逆列、点击等）。
 * @param {Element | null} el
 * @param {Element | null} svg
 * @returns {string | null}
 */
export function planetEnFromSerialAncestors(el, svg) {
  let n = el
  while (n && n !== svg) {
    const parsed = parseChartSerial(n.getAttribute?.('serial'))
    if (parsed?.kind === 'planet') return parsed.key
    n = n.parentElement
  }
  return null
}

/**
 * @param {string} planetEn
 * @param {ChartLabelMode} mode
 * @param {object | null} chartData
 */
export function formatPlanetLabel(planetEn, mode, chartData) {
  if (!planetEn) return ''
  const en = String(planetEn)
  const enLc = en.toLowerCase()
  if (mode === 'symbol') {
    return (
      PLANET_EN_TO_SYMBOL[planetEn] ??
      PLANET_EN_TO_SYMBOL_IC.get(enLc) ??
      planetEn
    )
  }
  const zh = PLANET_EN_TO_ZH[planetEn] ?? PLANET_EN_TO_ZH_IC.get(enLc)
  if (zh != null) return zh
  const row = getPlanetList(chartData).find(
    (p) => p.planet_en != null && String(p.planet_en).toLowerCase() === enLc
  )
  if (row?.planet_cn) return row.planet_cn
  return planetEn
}

/**
 * @param {string} signEn
 * @param {ChartLabelMode} mode
 */
export function formatSignLabel(signEn, mode) {
  if (!signEn) return ''
  const s = String(signEn)
  const sLc = s.toLowerCase()
  if (mode === 'symbol') {
    return SIGN_EN_TO_SYMBOL[signEn] ?? SIGN_EN_TO_SYMBOL_IC.get(sLc) ?? signEn
  }
  return SIGN_EN_TO_ZH[signEn] ?? SIGN_EN_TO_ZH_IC.get(sLc) ?? signEn
}

/**
 * 遍历带 `serial="p_*"` / `serial="s_*"` 的节点，写入中文或符号。
 * @param {SVGSVGElement} svg
 * @param {object} chartData
 * @param {ChartLabelMode} mode
 */
export function applyAstroChartSvgLabels(svg, chartData, mode) {
  if (!svg || !chartData) return
  svg.querySelectorAll('[serial^="p_"],[serial^="s_"]').forEach((el) => {
    const cls = el.getAttribute?.('class') || ''
    if (cls.includes('house_id')) return
    if (el.closest?.('.house_id')) return
    if (cls.includes('senior_house_sign_r')) return
    const raw = (el.textContent || '').trim()
    if (/^\d+$/.test(raw)) return

    const fromSerial = parseChartSerial(el.getAttribute?.('serial'))
    if (!fromSerial) return
    if (fromSerial.kind === 'planet') {
      el.setAttribute(DATA_PLANET, fromSerial.key)
      const label = formatPlanetLabel(fromSerial.key, mode, chartData)
      el.textContent = label
      applyCompactAsciiSymbolFontSize(el, label, mode)
    } else {
      el.setAttribute(DATA_SIGN, fromSerial.key)
      const label = formatSignLabel(fromSerial.key, mode)
      el.textContent = label
      applyCompactAsciiSymbolFontSize(el, label, mode)
    }
  })
  applyRetrogradeMotionLabels(svg, chartData)
}

/**
 * `senior_house_sign_r`：按 `planet.speed`（&lt;0 逆行）显示 **Rx**，顺行留空。
 * 依赖祖先链上存在 `serial="p_*"`（可与星体信息行共用同一父级 `g`）。
 */
function applyRetrogradeMotionLabels(svg, chartData) {
  const list = getPlanetList(chartData)
  svg.querySelectorAll('[class*="senior_house_sign_r"]').forEach((el) => {
    const planetEn = planetEnFromSerialAncestors(el, svg)
    if (!planetEn) return
    const enLc = String(planetEn).toLowerCase()
    const row = list.find(
      (p) => p.planet_en != null && String(p.planet_en).toLowerCase() === enLc
    )
    if (!row) return
    const speed = parseFloat(row.speed)
    if (Number.isNaN(speed)) return
    const retro = speed < 0
    el.textContent = retro ? 'Rx' : ''
  })
}

/** localStorage key */
export const CHART_LABEL_MODE_STORAGE_KEY = 'astroChartLabelMode'

/** @returns {ChartLabelMode} */
export function readStoredChartLabelMode() {
  try {
    const v = localStorage.getItem(CHART_LABEL_MODE_STORAGE_KEY)
    if (v === 'zh' || v === 'symbol') return v
  } catch {
    /* ignore */
  }
  return 'zh'
}

/** @param {ChartLabelMode} mode */
export function writeStoredChartLabelMode(mode) {
  try {
    localStorage.setItem(CHART_LABEL_MODE_STORAGE_KEY, mode)
  } catch {
    /* ignore */
  }
}
