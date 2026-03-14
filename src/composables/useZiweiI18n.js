import { useI18n } from 'vue-i18n'
import zhCN from '../i18n/locales/zh-CN'
import enUS from '../i18n/locales/en-US'

/**
 * 从 locale 对象中构建 值 -> key 的反向映射（用于后端返回中文时的翻译）
 */
function buildReverseMap(obj) {
  if (!obj || typeof obj !== 'object') return {}
  const map = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value != null && value !== '') map[String(value)] = key
  }
  return map
}

const zhPalace = zhCN.ziwei?.palace || {}
const zhStar = zhCN.ziwei?.star || {}
const zhFive = zhCN.ziwei?.fiveElements || {}
const zhBrightness = zhCN.ziwei?.brightness || {}
const zhMutagen = zhCN.ziwei?.mutagen || {}
const zhStem = zhCN.ziwei?.stem || {}
const zhBranch = zhCN.ziwei?.branch || {}
const reversePalace = buildReverseMap(zhPalace)
const reverseStar = buildReverseMap(zhStar)
const reverseFive = buildReverseMap(zhFive)
const reverseBrightness = buildReverseMap(zhBrightness)
const reverseMutagen = buildReverseMap(zhMutagen)
const reverseStem = buildReverseMap(zhStem)
const reverseBranch = buildReverseMap(zhBranch)

/**
 * 紫微斗数页中英文翻译
 * - t: 直接使用 ziwei.xxx 文案
 * - translatePalaceName / translateStarName 等：宫位、星曜等取值的翻译（支持后端返回 key 或中文）
 */
export function useZiweiI18n() {
  const { t, locale } = useI18n()

  const tz = (key) => {
    const fullKey = key.startsWith('ziwei.') ? key : `ziwei.${key}`
    return t(fullKey) || key
  }

  const translatePalaceName = (name) => {
    if (!name) return ''
    const key = reversePalace[name] || (zhPalace[name] !== undefined ? name : null)
    if (key) return t(`ziwei.palace.${key}`) || name
    return name
  }

  const translateStarName = (name) => {
    if (!name) return ''
    const key = reverseStar[name] || (zhStar[name] !== undefined ? name : null)
    if (key) return t(`ziwei.star.${key}`) || name
    return name
  }

  const translateFiveElementsClass = (value) => {
    if (!value) return ''
    const key = reverseFive[value] || (zhFive[value] !== undefined ? value : null)
    if (key) return t(`ziwei.fiveElements.${key}`) || value
    return value
  }

  const translateGender = (value) => {
    if (!value) return ''
    if (value === 'male' || value === '男') return tz('male')
    if (value === 'female' || value === '女') return tz('female')
    return value
  }

  const translateBrightness = (value) => {
    if (!value) return ''
    const key = reverseBrightness[value] || (zhBrightness[value] !== undefined ? value : null)
    if (key) return t(`ziwei.brightness.${key}`) || value
    return value
  }

  /** 四化类型 -> 禄/权/科/忌 文案 */
  const getMutagenText = (value) => {
    if (!value) return ''
    const norm = normalizeMutagenType(value)
    if (!norm) return value
    const key = reverseMutagen[norm] || norm
    return t(`ziwei.mutagen.${key}`) || norm
  }

  /** 四化类型 -> 颜色（与 vue_ziwei 一致：禄绿 权橙 科蓝 忌红） */
  const getMutagenColor = (value) => {
    const norm = normalizeMutagenType(value)
    const map = { lu: '#4caf50', quan: '#ff9800', ke: '#2196f3', ji: '#f44336' }
    return norm ? map[norm] || '' : ''
  }

  const translateStem = (value) => {
    if (!value) return ''
    const key = reverseStem[value] || (zhStem[value] !== undefined ? value : null)
    if (key) return t(`ziwei.stem.${key}`) || value
    return value
  }

  const translateBranch = (value) => {
    if (!value) return ''
    const key = reverseBranch[value] || (zhBranch[value] !== undefined ? value : null)
    if (key) return t(`ziwei.branch.${key}`) || value
    return value
  }

  return {
    t: tz,
    locale,
    translatePalaceName,
    translateStarName,
    translateFiveElementsClass,
    translateGender,
    translateBrightness,
    getMutagenText,
    getMutagenColor,
    translateStem,
    translateBranch
  }
}

function normalizeMutagenType(name) {
  if (!name) return null
  const s = String(name).toLowerCase()
  if (s.includes('禄') || s.includes('lu')) return 'lu'
  if (s.includes('权') || s.includes('quan')) return 'quan'
  if (s.includes('科') || s.includes('ke')) return 'ke'
  if (s.includes('忌') || s.includes('ji')) return 'ji'
  return null
}
