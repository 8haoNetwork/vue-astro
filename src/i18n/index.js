import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN'
import zhTW from './locales/zh-TW'
import enUS from './locales/en-US'

// 创建i18n实例
const i18n = createI18n({
  locale: 'zh-CN', // 默认语言
  fallbackLocale: 'zh-CN', // 回退语言
  messages: {
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'en-US': enUS
  },
  legacy: false, // 使用Composition API模式
  globalInjection: true // 全局注入$t
})

export { i18n, zhCN, zhTW, enUS }
