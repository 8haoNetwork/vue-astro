/** API 语言码，与后端 normalize_app_lang 对齐 */

export const APP_LANG_STORAGE_KEY = 'apiworks_app_lang'

/** 请求体 lang 字段可选值（与三式 / 星盘 / 运势等接口一致） */
export const APP_LANG_OPTIONS = [
  { value: 'zh-Hans', label: '简体中文' },
  { value: 'zh-Hant', label: '繁體中文' },
  { value: 'en', label: 'English' }
]

export function normalizeAppLang(lang) {
  if (lang == null || String(lang).trim() === '') {
    return 'zh-Hans'
  }
  const normalized = String(lang).trim().replace(/_/g, '-')
  const lower = normalized.toLowerCase()
  if (lower === 'en' || lower.startsWith('en-')) return 'en'
  if (lower === 'zh-hant' || lower === 'zh-tw' || lower === 'zh-hk') return 'zh-Hant'
  if (lower === 'zh-hans' || lower === 'zh-cn' || lower === 'zh') return 'zh-Hans'
  if (normalized === 'zh-Hant' || normalized === 'zh-Hans') return normalized
  return 'zh-Hans'
}

/** 浏览器偏好 → API lang */
export function detectAppLang() {
  if (typeof navigator === 'undefined') return 'zh-Hans'
  const nav = navigator.language || ''
  if (/zh-(TW|HK|Hant)/i.test(nav)) return 'zh-Hant'
  if (/^en/i.test(nav)) return 'en'
  return 'zh-Hans'
}

/** 读取本地持久化的 API 语言 */
export function getAppLang() {
  if (typeof localStorage === 'undefined') {
    return detectAppLang()
  }
  try {
    const stored = localStorage.getItem(APP_LANG_STORAGE_KEY)
    if (stored) return normalizeAppLang(stored)
  } catch {
    /* ignore */
  }
  return detectAppLang()
}

/** 写入本地 API 语言 */
export function setAppLang(lang) {
  const value = normalizeAppLang(lang)
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(APP_LANG_STORAGE_KEY, value)
    } catch {
      /* ignore */
    }
  }
  return value
}

/**
 * 构建请求体时使用的 lang：表单显式传入优先，否则用全局选择。
 * @param {string|undefined|null} explicit
 */
export function resolveRequestLang(explicit) {
  if (explicit != null && String(explicit).trim() !== '') {
    return normalizeAppLang(explicit)
  }
  return getAppLang()
}

/** 为请求体附加 lang 字段 */
export function withRequestLang(body, explicitLang) {
  return {
    ...body,
    lang: resolveRequestLang(explicitLang ?? body?.lang)
  }
}
