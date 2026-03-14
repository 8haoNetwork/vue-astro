<!-- 星盘结果展示：SVG 图、点击弹窗、详细参数（组件/独立页）、星座/落宫/相位解读 -->
<template>
  <div class="chart-result">
    <template v-if="!chartData">
      <div class="chart-display chart-display-empty">
        <div class="empty-state"><div class="empty-state-icon">📋</div><div>暂无星盘数据</div></div>
      </div>
    </template>
    <template v-else>
      <!-- 星盘图 -->
      <div v-if="chartData.svg" ref="chartDisplayRef" class="chart-display" v-html="chartData.svg" @click="onChartDisplayClick"></div>
      <div v-else class="chart-display chart-display-empty">
        <div class="empty-state"><div class="empty-state-icon">📊</div><div>暂无星盘图</div></div>
      </div>

      <!-- 详细参数：展开用 ChartDetail 组件 -->
      <div class="detail-section-wrap">
        <div class="detail-actions">
          <button type="button" class="btn-detail" @click="showDetail = !showDetail">
            {{ showDetail ? '收起详细参数' : '详细参数' }}
          </button>
        </div>
        <div v-show="showDetail" class="detail-content">
          <ChartDetail :chart-data="chartData" />
        </div>
      </div>

      <!-- 星座 / 落宫 / 相位 -->
      <div class="content-tabs">
        <div class="content-tabs-nav">
          <button type="button" class="content-tab" :class="{ active: activeCorpusTab === 'sign' }" @click="activeCorpusTab = 'sign'">星座</button>
          <button type="button" class="content-tab" :class="{ active: activeCorpusTab === 'house' }" @click="activeCorpusTab = 'house'">落宫</button>
          <button type="button" class="content-tab" :class="{ active: activeCorpusTab === 'aspect' }" @click="activeCorpusTab = 'aspect'">相位</button>
        </div>
      </div>
      <div class="content-area">
        <div class="content-panel" :class="{ active: activeCorpusTab === 'sign' }">
          <div v-if="signCorpus.length" class="corpus-list">
            <div v-for="(c, i) in signCorpus" :key="'sign-' + i" class="corpus-item">
              <div class="corpus-header">
                <span v-if="getJxClass(c.jx_type)" class="corpus-jx" :class="getJxClass(c.jx_type)">{{ getJxLabel(c.jx_type) }}</span>
                <span class="corpus-title">{{ c.title }}</span>
              </div>
              <div v-if="c.tip || c.start_days_desc || c.remain_days_desc" class="corpus-meta">
                <span v-if="c.tip" class="corpus-meta-item">{{ c.tip }}</span>
                <span v-if="c.start_days_desc" class="corpus-meta-item">{{ c.start_days_desc }}</span>
                <span v-if="c.remain_days_desc" class="corpus-meta-item">{{ c.remain_days_desc }}</span>
              </div>
              <div class="corpus-content" v-html="c.content || ''"></div>
            </div>
          </div>
          <div v-else class="empty-state"><div class="empty-state-icon">📝</div><div>暂无星座解读</div></div>
        </div>
        <div class="content-panel" :class="{ active: activeCorpusTab === 'house' }">
          <div v-if="houseCorpus.length" class="corpus-list">
            <div v-for="(c, i) in houseCorpus" :key="'house-' + i" class="corpus-item">
              <div class="corpus-header">
                <span v-if="getJxClass(c.jx_type)" class="corpus-jx" :class="getJxClass(c.jx_type)">{{ getJxLabel(c.jx_type) }}</span>
                <span class="corpus-title">{{ c.title }}</span>
              </div>
              <div v-if="c.tip" class="corpus-meta"><span class="corpus-meta-item">{{ c.tip }}</span></div>
              <div class="corpus-content" v-html="c.content || ''"></div>
            </div>
          </div>
          <div v-else class="empty-state"><div class="empty-state-icon">🏠</div><div>暂无落宫解读</div></div>
        </div>
        <div class="content-panel" :class="{ active: activeCorpusTab === 'aspect' }">
          <div v-if="aspectCorpus.length" class="corpus-list">
            <div v-for="(c, i) in aspectCorpus" :key="'aspect-' + i" class="corpus-item">
              <div class="corpus-header">
                <span v-if="getJxClass(c.jx_type)" class="corpus-jx" :class="getJxClass(c.jx_type)">{{ getJxLabel(c.jx_type) }}</span>
                <span class="corpus-title">{{ c.title }}</span>
              </div>
              <div v-if="c.tip" class="corpus-meta"><span class="corpus-meta-item">{{ c.tip }}</span></div>
              <div class="corpus-content" v-html="c.content || ''"></div>
            </div>
          </div>
          <div v-else class="empty-state"><div class="empty-state-icon">⚡</div><div>暂无相位解读</div></div>
        </div>
      </div>

      <!-- 星盘图点击弹出的详情弹窗 -->
      <div v-if="chartModalVisible" class="chart-modal" @click.self="chartModalVisible = false">
        <div class="chart-modal-content">
          <div class="chart-modal-body">
            <span class="chart-modal-close" @click="chartModalVisible = false">&times;</span>
            <div v-if="chartModalTitle" class="chart-modal-title" v-html="chartModalTitle"></div>
            <div class="chart-modal-inner" v-html="chartModalHtml"></div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import ChartDetail from './ChartDetail.vue'

const props = defineProps({
  result: { type: Object, default: null }
})

const chartData = computed(() => {
  const r = props.result
  if (!r) return null
  return r?.data ?? r
})

/* 星盘字体与 #chartbody/.planet_font/.sign_font 等样式由 main.js 引入的 astro-style.css 提供，与 astro_apiworks_web 一致 */

const activeCorpusTab = ref('sign')
const showDetail = ref(false)
const chartDisplayRef = ref(null)
const chartModalVisible = ref(false)
const chartModalTitle = ref('')
const chartModalHtml = ref('')

const signCorpus = computed(() => {
  const corpus = chartData.value?.corpus
  if (!Array.isArray(corpus)) return []
  return corpus.filter((c) => c.type === 'PlanetToSign')
})
const houseCorpus = computed(() => {
  const corpus = chartData.value?.corpus
  if (!Array.isArray(corpus)) return []
  return corpus.filter((c) => c.type === 'PlanetToHouse')
})
const aspectCorpus = computed(() => {
  const corpus = chartData.value?.corpus
  if (!Array.isArray(corpus)) return []
  return corpus.filter((c) => c.type && String(c.type).startsWith('PlanetAspect'))
})

function getJxClass(jxType) {
  if (!jxType) return null
  const t = String(jxType).toUpperCase()
  if (t === 'JI') return 'jx-ji'
  if (t === 'XIONG') return 'jx-xiong'
  if (t === 'PING') return 'jx-ping'
  return null
}
function getJxLabel(jxType) {
  if (!jxType) return ''
  const t = String(jxType).toUpperCase()
  if (t === 'JI') return '吉'
  if (t === 'XIONG') return '凶'
  if (t === 'PING') return '平'
  return ''
}
function escapeHtml(val) {
  if (val == null) return ''
  return String(val).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}
function isRetrograde(planet) {
  const speed = parseFloat(planet.speed)
  return !Number.isNaN(speed) && speed < 0
}
function getAspectSymbol(angle) {
  const map = { 0: '☌', 60: '⚹', 90: '□', 120: '△', 150: '⚻', 180: '☍' }
  return map[angle] ?? ''
}
function getInOutText(inOut) {
  if (inOut === 1) return '[入相]'
  if (inOut === -1) return '[出相]'
  return ''
}

function showPlanetInfo(planetEn) {
  const data = chartData.value
  if (!data?.planet) return
  const planet = data.planet.find((p) => p.planet_en === planetEn)
  if (!planet) return
  const name = planet.planet_cn || planet.planet_en
  const font = planet.planet_font || ''
  const retro = isRetrograde(planet) ? '[逆行]' : ''
  let title = ''
  if (font) title += `<span style="font-family: 'ixingpan_cn', 'ixingpan', sans-serif;">${escapeHtml(font)}</span> `
  title += escapeHtml(name) + retro
  let html = ''
  if (planet.sign) {
    const signName = planet.sign.sign_cn || planet.sign.sign_en || '-'
    const signFont = planet.sign.sign_font || ''
    const lon = planet.longitude != null ? planet.longitude % 30 : 0
    const deg = Math.floor(lon)
    const min = Math.floor((lon - deg) * 60)
    const sec = Math.round(((lon - deg) * 60 - min) * 60)
    let line = '星座: 落于' + escapeHtml(signName)
    if (signFont) line += `<span style="font-family: 'ixingpan_cn', 'ixingpan', sans-serif; margin-left: 5px;">${escapeHtml(signFont)}</span>`
    line += `${deg}°${min}'${sec}"`
    html += `<div class="info-row"><span class="info-value">${line}</span></div>`
  }
  html += `<div class="info-row"><span class="info-value">宫位: 位于${planet.house_id}宫</span></div>`
  if (data.house) {
    const ruled = []
    data.house.forEach((h) => {
      if (h.main_planet?.some((mp) => mp.planet_code === planet.planet_code || (mp.planet_cn === name || mp.planet_en === planet.planet_en))) ruled.push(h.house_id)
    })
    if (ruled.length) html += `<div class="info-row"><span class="info-value">是第${ruled.join('宫、第')}宫主星</span></div>`
  }
  if (planet.planet_allow_degree?.length) {
    html += '<div class="detail-section"><div class="detail-section-title">相位</div>'
    planet.planet_allow_degree.forEach((a) => {
      const pName = a.planet_cn || a.planet_en || '-'
      const pFont = a.planet_font || ''
      const sym = getAspectSymbol(a.asp_angle)
      const inOut = getInOutText(a.in_out)
      const d = a.deg ?? 0
      const m = a.min ?? 0
      const s = a.sec ?? 0
      let line = '和' + escapeHtml(pName)
      if (pFont) line += `<span style="font-family: 'ixingpan_cn', 'ixingpan', sans-serif; margin-left: 5px;">${escapeHtml(pFont)}</span>`
      line += '成' + escapeHtml(String(a.asp_angle))
      if (sym) line += `<span style="font-family: 'ixingpan_cn', 'ixingpan', sans-serif; margin-left: 3px;">${escapeHtml(sym)}</span>`
      line += inOut + `${d}°${m}'${s}"`
      html += `<div class="info-row"><span class="info-value">${line}</span></div>`
    })
    html += '</div>'
  }
  chartModalTitle.value = title
  chartModalHtml.value = html
  chartModalVisible.value = true
}

function showHouseInfo(houseId) {
  const data = chartData.value
  if (!data?.house) return
  const house = data.house.find((h) => h.house_id === houseId)
  if (!house) return
  const title = `${houseId}宫 [${house.house_life || ''}]`
  let html = ''
  if (house.sign) {
    const signName = house.sign.sign_cn || house.sign.sign_en || '-'
    const signFont = house.sign.sign_font || ''
    const lon = house.longitude != null ? house.longitude % 30 : 0
    const deg = Math.floor(lon)
    const min = Math.floor((lon - deg) * 60)
    const sec = Math.round(((lon - deg) * 60 - min) * 60)
    let line = '宫头 ' + escapeHtml(signName)
    if (signFont) line += `<span style="font-family: 'ixingpan_cn', 'ixingpan', sans-serif; margin-left: 5px;">${escapeHtml(signFont)}</span>`
    line += ` ${deg}°${min}'${sec}"`
    html += `<div class="info-row"><span class="info-value">${line}</span></div>`
  }
  if (house.main_planet?.length) {
    const mp = house.main_planet[0]
    const pName = mp.planet_cn || mp.planet_en || '-'
    const pFont = mp.planet_font || ''
    let rulerHouseId = '-'
    const rp = data.planet?.find((p) => p.planet_cn === pName || p.planet_en === pName || p.planet_code === mp.planet_code)
    if (rp) rulerHouseId = rp.house_id
    let line = '宫主星 ' + escapeHtml(pName)
    if (pFont) line += `<span style="font-family: 'ixingpan_cn', 'ixingpan', sans-serif; margin-left: 5px;">${escapeHtml(pFont)}</span>`
    line += ' 落入 ' + rulerHouseId + '宫'
    html += `<div class="info-row"><span class="info-value">${line}</span></div>`
  }
  chartModalTitle.value = title
  chartModalHtml.value = html
  chartModalVisible.value = true
}

function findPlanetEnById(data, id) {
  if (!id || !data?.planet) return null
  const s = String(id).toLowerCase()
  const p = data.planet.find((x) => x.planet_en && String(x.planet_en).toLowerCase() === s)
  return p ? p.planet_en : null
}

function onChartDisplayClick(e) {
  const data = chartData.value
  if (!data) return
  let target = e.target
  const container = chartDisplayRef.value
  const svg = container?.querySelector('svg')
  if (!svg || !svg.contains(target)) return
  e.preventDefault()
  e.stopPropagation()
  for (; target && target !== svg; target = target.parentElement) {
    const id = target.getAttribute?.('id')
    const planetEn = findPlanetEnById(data, id)
    if (planetEn) {
      showPlanetInfo(planetEn)
      return
    }
    const planetMatch = (target.classList?.value || '').match(/planets_(\w+)/)
    if (planetMatch) {
      const found = findPlanetEnById(data, planetMatch[1])
      if (found) {
        showPlanetInfo(found)
        return
      }
    }
    if (target.classList?.contains('planet_font') || target.classList?.contains('planets_circle')) {
      const g = target.closest?.('g[id]')
      const found = findPlanetEnById(data, g?.getAttribute('id'))
      if (found) {
        showPlanetInfo(found)
        return
      }
      const pm = (target.classList?.value || '').match(/planets_(\w+)/)
      if (pm) {
        const f = findPlanetEnById(data, pm[1])
        if (f) showPlanetInfo(f)
        return
      }
      return
    }
    const houseEl = target.closest?.('.house_id, .house_grid, .house_dark_grid')
    if (houseEl) {
      let hid = houseEl.getAttribute('shaft') ?? houseEl.getAttribute('serial')
      if (hid != null) {
        hid = parseInt(hid, 10)
        if (houseEl.getAttribute('serial') !== null) hid += 1
        showHouseInfo(hid)
      }
      return
    }
  }
}

function attachChartClickEvents() {
  const container = chartDisplayRef.value
  const data = chartData.value
  if (!container || !data) return
  const svg = container.querySelector('svg')
  if (!svg) return
  const fontStack = "'ixingpan_cn', 'ixingpan', sans-serif"
  svg.style.fontFamily = fontStack
  const textSelectors = 'text, tspan, .planet_font, .planet_font2, .text_font, .sign_font, .guardian_font, .must_symbo_font'
  const applyFont = () => {
    svg.querySelectorAll(textSelectors).forEach((el) => { el.style.fontFamily = fontStack })
    svg.querySelectorAll('text, tspan').forEach((el) => { el.style.fontFamily = fontStack })
  }
  applyFont()
  document.fonts.ready.then(applyFont)
  document.fonts.load('16px ixingpan_cn').then(applyFont).catch(() => {})
  document.fonts.load('16px ixingpan').then(applyFont).catch(() => {})

  container.style.cursor = 'default'
  container.style.pointerEvents = 'auto'
  svg.style.pointerEvents = 'auto'
  svg.querySelectorAll('g[id]').forEach((g) => {
    if (data.planet?.some((p) => p.planet_en === g.getAttribute('id'))) {
      g.style.cursor = 'pointer'
      g.querySelectorAll('*').forEach((el) => { el.style.cursor = 'pointer' })
    }
  })
  svg.querySelectorAll('.planets_circle, .planet_font, .house_id, .house_grid, .house_dark_grid').forEach((el) => { el.style.cursor = 'pointer' })
}

watch(
  () => chartData.value?.svg,
  (svg) => {
    if (!svg) return
    nextTick(() => {
      requestAnimationFrame(() => {
        attachChartClickEvents()
      })
    })
  }
)
</script>

<style scoped>
.chart-result { background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #eee; margin-top: 16px; }
.chart-display { background: #fff; padding: 15px; display: flex; justify-content: center; align-items: center; min-height: 280px; position: relative; }
.chart-display :deep(svg) { max-width: 100%; height: auto; display: block; }
.chart-display :deep(svg text), .chart-display :deep(svg tspan) { font-family: 'ixingpan_cn', 'ixingpan', sans-serif !important; }
.chart-display-empty { min-height: 200px; }
.detail-section-wrap { padding: 12px 15px 20px; border-top: 1px solid #e0e0e0; background: #fff; }
.detail-actions { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.btn-detail { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; background: #667eea; color: white; }
.btn-detail:hover { background: #5568d3; }
.content-tabs { background: #fff; border-bottom: 1px solid #e0e0e0; }
.content-tabs-nav { display: flex; padding: 0 15px; }
.content-tab { padding: 12px 20px; border: none; background: transparent; color: #666; font-size: 14px; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.3s; flex: 1; text-align: center; }
.content-tab.active { color: #667eea; border-bottom-color: #667eea; font-weight: 600; }
.content-tab:hover { color: #667eea; }
.content-area { background: #fff; padding: 15px; min-height: 160px; }
.content-panel { display: none; }
.content-panel.active { display: block; }
.corpus-item { background: #f8f9fa; border-radius: 8px; padding: 12px; margin-bottom: 12px; border-left: 4px solid #667eea; }
.corpus-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.corpus-jx { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; font-size: 11px; font-weight: 600; }
.corpus-jx.jx-ji { background: #e6f4ea; color: #238636; border: 1px solid #c5e6cf; }
.corpus-jx.jx-xiong { background: #fdecec; color: #d93025; border: 1px solid #f7c3c3; }
.corpus-jx.jx-ping { background: #eef2ff; color: #4455aa; border: 1px solid #d1d9ff; }
.corpus-title { font-weight: 600; color: #333; font-size: 14px; }
.corpus-meta { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 6px; color: #888; font-size: 11px; }
.corpus-content { color: #555; font-size: 13px; line-height: 1.6; }
.empty-state { text-align: center; padding: 40px 20px; color: #999; }
.empty-state-icon { font-size: 36px; margin-bottom: 10px; opacity: 0.5; }
.chart-modal { position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; }
.chart-modal-content { background: #fff; border-radius: 8px; max-width: 90%; max-height: 80vh; min-width: 260px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.3); }
.chart-modal-body { padding: 16px 20px 20px; padding-top: 40px; overflow-y: auto; position: relative; font-size: 13px; }
.chart-modal-close { position: absolute; top: 10px; right: 12px; font-size: 22px; font-weight: bold; color: #666; cursor: pointer; z-index: 10; }
.chart-modal-title { font-size: 1em; font-weight: 600; color: #667eea; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #e0e0e0; }
.chart-modal-inner .info-row { margin-bottom: 8px; }
.chart-modal-inner .info-value { color: #333; font-size: 12px; line-height: 1.5; }
.chart-modal-inner .info-value :deep(span[style*="font-family"]) { font-family: 'ixingpan_cn', 'ixingpan', sans-serif !important; }
.chart-modal-inner .detail-section { margin-top: 12px; padding-top: 12px; border-top: 1px solid #e0e0e0; }
.chart-modal-inner .detail-section-title { font-weight: 600; color: #667eea; margin-bottom: 8px; font-size: 12px; }
</style>
