import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { i18n } from './i18n'
import '@fontsource/noto-sans-symbols-2' /* 星盘符号字体，配合 chart-style「星盘符号」段 */
import './assets/main.css'
import './assets/chart-style.css'

const app = createApp(App)
app.use(router)
app.use(i18n)
app.mount('#app')
