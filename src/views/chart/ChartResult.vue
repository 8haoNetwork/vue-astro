<!-- 星盘结果展示：SVG 图、点击弹窗、详细参数（组件/独立页）、星座/落宫/相位解读 -->
<template>
  <div class="chart-result">
    <template v-if="!chartData">
      <div class="chart-display chart-display-empty">
        <div class="empty-state"><div class="empty-state-icon">📋</div><div>暂无星盘数据</div></div>
      </div>
    </template>
    <template v-else>
      <!-- 星盘图：标签由 JS 映射为中文或 Unicode 符号，不依赖专用字体 -->
      <div v-if="chartData.svg" class="chart-svg-wrap">
        <div class="chart-label-toolbar" role="group" :aria-label="$t('chart.labelModeGroup')">
          <span class="chart-label-toolbar-title">{{ $t('chart.labelModeTitle') }}</span>
          <button
            type="button"
            class="chart-label-btn"
            :class="{ active: chartLabelMode === 'zh' }"
            @click="setChartLabelMode('zh')"
          >{{ $t('chart.labelModeZh') }}</button>
          <button
            type="button"
            class="chart-label-btn"
            :class="{ active: chartLabelMode === 'symbol' }"
            @click="setChartLabelMode('symbol')"
          >{{ $t('chart.labelModeSymbol') }}</button>
        </div>
        <div ref="chartDisplayRef" class="chart-display" v-html="chartData.svg" @click="onChartDisplayClick"></div>
      </div>
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
import {
  applyAstroChartSvgLabels,
  formatPlanetLabel,
  formatSignLabel,
  planetEnFromSerialAncestors,
  readStoredChartLabelMode,
  writeStoredChartLabelMode
} from '../../utils/astroChartDisplay.js'

const props = defineProps({
  result: { type: Object, default: null }
})

const chartData = computed(() => {
  const r = props.result
  if (!r) return null
  return r?.data ?? r
})

const activeCorpusTab = ref('sign')
const showDetail = ref(false)
const chartDisplayRef = ref(null)
/** 默认中文；与 applyAstroChartSvgLabels 一致 */
const chartLabelMode = ref(readStoredChartLabelMode())
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

/**
 * 星盘点击弹窗内展示：优先接口 planet_cn 全称，否则 planet_en；再无则退回简称映射。
 * @param {{ planet_cn?: string, planet_en?: string } | null} row
 * @param {object | null} data chartData
 * @param {string | null} planetEnFallback
 * @param {import('../../utils/astroChartDisplay.js').ChartLabelMode} mode
 */
function modalPlanetName(row, data, planetEnFallback, mode) {
  if (row) {
    const n = row.planet_cn || row.planet_en
    if (n) return n
  }
  if (planetEnFallback) return formatPlanetLabel(planetEnFallback, mode, data)
  return '-'
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
  const mode = chartLabelMode.value
  const name = modalPlanetName(planet, data, planet.planet_en, mode)
  const retro = isRetrograde(planet) ? '[逆行]' : ''
  const title = escapeHtml(name) + retro
  let html = ''
  if (planet.sign) {
    const signLabel =
      mode === 'symbol' && planet.sign.sign_en
        ? formatSignLabel(planet.sign.sign_en, 'symbol')
        : planet.sign.sign_cn || planet.sign.sign_en || '-'
    const lon = planet.longitude != null ? planet.longitude % 30 : 0
    const deg = Math.floor(lon)
    const min = Math.floor((lon - deg) * 60)
    const sec = Math.round(((lon - deg) * 60 - min) * 60)
    const line = '星座: 落于' + escapeHtml(signLabel) + `${deg}°${min}'${sec}"`
    html += `<div class="info-row"><span class="info-value">${line}</span></div>`
  }
  html += `<div class="info-row"><span class="info-value">宫位: 位于${planet.house_id}宫</span></div>`
  if (data.house) {
    const ruled = []
    const nameKey = planet.planet_cn || planet.planet_en
    data.house.forEach((h) => {
      if (h.main_planet?.some((mp) => mp.planet_code === planet.planet_code || (mp.planet_cn === nameKey || mp.planet_en === planet.planet_en))) ruled.push(h.house_id)
    })
    if (ruled.length) html += `<div class="info-row"><span class="info-value">是第${ruled.join('宫、第')}宫主星</span></div>`
  }
  if (planet.planet_allow_degree?.length) {
    html += '<div class="detail-section"><div class="detail-section-title">相位</div>'
    planet.planet_allow_degree.forEach((a) => {
      const otherEn = a.planet_en
      const otherRow = otherEn
        ? data.planet.find((p) => p.planet_en === otherEn)
        : null
      const otherLabel = modalPlanetName(otherRow || (a.planet_cn || a.planet_en ? a : null), data, otherEn, mode)
      const sym = getAspectSymbol(a.asp_angle)
      const inOut = getInOutText(a.in_out)
      const d = a.deg ?? 0
      const m = a.min ?? 0
      const s = a.sec ?? 0
      let line = '和' + escapeHtml(otherLabel) + '成' + escapeHtml(String(a.asp_angle))
      if (sym) line += escapeHtml(sym)
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
  const mode = chartLabelMode.value
  const title = `${houseId}宫 [${house.house_life || ''}]`
  let html = ''
  if (house.sign) {
    const signLabel =
      mode === 'symbol' && house.sign.sign_en
        ? formatSignLabel(house.sign.sign_en, 'symbol')
        : house.sign.sign_cn || house.sign.sign_en || '-'
    const lon = house.longitude != null ? house.longitude % 30 : 0
    const deg = Math.floor(lon)
    const min = Math.floor((lon - deg) * 60)
    const sec = Math.round(((lon - deg) * 60 - min) * 60)
    const line = '宫头 ' + escapeHtml(signLabel) + ` ${deg}°${min}'${sec}"`
    html += `<div class="info-row"><span class="info-value">${line}</span></div>`
  }
  if (house.main_planet?.length) {
    const mp = house.main_planet[0]
    let rulerHouseId = '-'
    const rp = data.planet?.find((p) => p.planet_cn === (mp.planet_cn || mp.planet_en) || p.planet_en === mp.planet_en || p.planet_code === mp.planet_code)
    if (rp) rulerHouseId = rp.house_id
    const rulerLabel = modalPlanetName(rp || mp, data, mp.planet_en || null, mode)
    const line = '宫主星 ' + escapeHtml(rulerLabel) + ' 落入 ' + rulerHouseId + '宫'
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
  const target = e.target
  const container = chartDisplayRef.value
  const svg = container?.querySelector('svg')
  if (!svg || !svg.contains(target)) return
  e.preventDefault()
  e.stopPropagation()

  const serialPlanetEn = planetEnFromSerialAncestors(target, svg)
  if (serialPlanetEn) {
    const found = findPlanetEnById(data, serialPlanetEn)
    if (found) {
      showPlanetInfo(found)
      return
    }
  }

  for (let n = target; n && n !== svg; n = n.parentElement) {
    const houseEl = n.closest?.('.house_id, .house_grid, .house_dark_grid')
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

  container.style.cursor = 'default'
  container.style.pointerEvents = 'auto'
  svg.style.pointerEvents = 'auto'
  svg.querySelectorAll('[serial^="p_"]').forEach((el) => {
    el.style.cursor = 'pointer'
  })
  svg
    .querySelectorAll(
      '.planets_circle, .planet_font, .planet_big_font, .planet_small_font, .house_id, .house_grid, .house_dark_grid'
    )
    .forEach((el) => {
      el.style.cursor = 'pointer'
    })
}

function refreshChartSvgUi() {
  const data = chartData.value
  const container = chartDisplayRef.value
  if (!data || !container) return
  const svg = container.querySelector('svg')
  attachChartClickEvents()
  if (svg) applyAstroChartSvgLabels(svg, data, chartLabelMode.value)
}

function setChartLabelMode(mode) {
  chartLabelMode.value = mode
  writeStoredChartLabelMode(mode)
  scheduleChartSvgRefresh()
}

function scheduleChartSvgRefresh() {
  nextTick(() => {
    requestAnimationFrame(() => refreshChartSvgUi())
  })
}

// immediate：首次进入时 svg 已存在，普通 watch 不会触发，导致未翻译
// flush: 'post'：在 v-html 注入 DOM 之后再跑，避免 chartDisplayRef / svg 尚未就绪
watch(
  () => chartData.value?.svg,
  (svgHtml) => {
    if (!svgHtml) return
    scheduleChartSvgRefresh()
  },
  { immediate: true, flush: 'post' }
)
</script>

<style scoped>
.chart-result { background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #eee; margin-top: 16px; }
.chart-svg-wrap { border-bottom: 1px solid #eee; }
.chart-label-toolbar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px 12px;
  background: #fafafa;
  border-bottom: 1px solid #eee;
}
.chart-label-toolbar-title { font-size: 13px; color: #666; margin-right: 4px; }
.chart-label-btn {
  padding: 6px 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  font-size: 13px;
  cursor: pointer;
  color: #555;
}
.chart-label-btn:hover { border-color: #667eea; color: #667eea; }
.chart-label-btn.active {
  border-color: #667eea;
  background: #667eea;
  color: #fff;
}
.chart-display { background: #fff; padding: 15px; display: flex; justify-content: center; align-items: center; min-height: 280px; position: relative; }
.chart-display :deep(svg) { max-width: 100%; height: auto; display: block; }
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
.chart-modal-inner .detail-section { margin-top: 12px; padding-top: 12px; border-top: 1px solid #e0e0e0; }
.chart-modal-inner .detail-section-title { font-weight: 600; color: #667eea; margin-bottom: 8px; font-size: 12px; }
</style>
