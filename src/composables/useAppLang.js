import { ref, readonly } from 'vue'
import {
  APP_LANG_OPTIONS,
  getAppLang,
  normalizeAppLang,
  setAppLang as persistAppLang
} from '../utils/lang'

const APP_LANG_OPTIONS_UI = APP_LANG_OPTIONS.map((opt) => ({
  ...opt,
  shortLabel:
    opt.value === 'zh-Hans' ? '简体' : opt.value === 'zh-Hant' ? '繁體' : 'EN'
}))

const appLang = ref(getAppLang())

export function useAppLang() {
  function setLang(lang) {
    const value = persistAppLang(normalizeAppLang(lang))
    appLang.value = value
  }

  return {
    appLang: readonly(appLang),
    appLangOptions: APP_LANG_OPTIONS_UI,
    setLang
  }
}
