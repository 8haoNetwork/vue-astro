<template>
  <div class="summary-page">
    <div class="summary-card">
      <!-- 总体描述段落 -->
      <div v-if="data.general_desc" class="summary-desc-block">
        {{ data.general_desc }}
      </div>

      <!-- 五行圆环图 -->
      <div v-if="wxChartData.length" class="summary-wx-section summary-wx-section--center">
        <div class="wx-chart-wrap">
          <svg class="wx-donut" viewBox="-35 -35 270 270" aria-label="五行分布">
            <defs>
              <filter id="wx-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="1" flood-opacity="0.08" />
              </filter>
              <marker id="wx-arrow-sheng" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <path d="M0,0 L8,3 L0,6 Z" fill="#999" />
              </marker>
              <radialGradient
                v-for="g in wxSegmentGradients"
                :id="g.id"
                :key="g.id"
                cx="100"
                cy="100"
                :r="g.radius"
                fx="100"
                fy="100"
                fr="18"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" :stop-color="g.color" />
                <stop offset="1" :stop-color="g.color" stop-opacity="0" />
              </radialGradient>
            </defs>
            <!-- 圆心空白 -->
            <circle cx="100" cy="100" :r="wxChartInnerR" class="wx-inner-blank" />
            <!-- 圆形饼图分段 -->
            <g v-for="(seg, i) in wxChartSegments" :key="seg.name">
              <path
                :d="seg.path"
                :fill="'url(#' + seg.gradId + ')'"
                filter="url(#wx-shadow)"
              />
              <text
                v-if="seg.percent >= 5"
                :x="seg.textX"
                :y="seg.textY - 8"
                class="wx-seg-name"
                text-anchor="middle"
                dominant-baseline="middle"
              >{{ seg.name }}</text>
              <text
                v-if="seg.percent >= 5"
                :x="seg.textX"
                :y="seg.textY + 4"
                class="wx-seg-pct"
                text-anchor="middle"
                dominant-baseline="middle"
              >{{ seg.percent }}%</text>
              <text
                v-if="seg.percent >= 5 && seg.name === dayMaster"
                :x="seg.textX"
                :y="seg.textY + 18"
                class="wx-seg-daymaster"
                text-anchor="middle"
                dominant-baseline="middle"
              >日主</text>
            </g>
            <!-- 外圈圆环 + 生克箭头与标注 -->
            <circle
              class="wx-outer-circle"
              cx="100"
              cy="100"
              :r="wxRing.outerR"
            />
            <g v-for="(s, i) in wxRing.shengList" :key="'sheng-' + i">
              <path
                :d="s.arrowPath"
                class="wx-sheng-arrow"
                fill="none"
                stroke="currentColor"
                marker-end="url(#wx-arrow-sheng)"
              />
              <text
                :x="s.x"
                :y="s.y"
                class="wx-ring-label wx-ring-label--sheng"
                text-anchor="middle"
                dominant-baseline="middle"
              >生</text>
            </g>
            <g v-for="(d, i) in wxRing.dotList" :key="'dot-' + i">
              <circle
                :cx="d.x"
                :cy="d.y"
                r="2"
                class="wx-outer-dot"
              />
              <text
                v-if="d.shiShen && d.shiShen.length"
                :x="d.labelX"
                :y="d.labelY"
                class="wx-shi-shen-label"
                text-anchor="middle"
                dominant-baseline="middle"
              >
                <tspan
                  v-for="(line, j) in d.shiShen"
                  :key="j"
                  :x="d.labelX"
                  :dy="j === 0 ? (d.shiShen.length > 1 ? -(d.shiShen.length - 1) * 0.55 + 'em' : 0) : '1.1em'"
                >{{ line }}</tspan>
              </text>
            </g>
          </svg>
        </div>
        <p class="wx-info-line">
          五行相克关系
        </p>
      </div>
      <div v-if="yongShenText" class="yongshen-center">
        <div class="summary-row summary-row--center">
          <span class="summary-row-value">【{{ yongShenText }}】</span>
        </div>
      </div>
      <!-- 幸运信息：两行三列 -->
      <div v-if="hasLuckyInfo" class="lucky-grid">
        <div class="lucky-grid-row lucky-grid-row--labels">
          <div class="lucky-grid-cell">幸运颜色</div>
          <div class="lucky-grid-cell">幸运方位</div>
          <div class="lucky-grid-cell">幸运数字</div>
        </div>
        <div class="lucky-grid-row lucky-grid-row--values">
          <div class="lucky-grid-cell">
            <span v-if="luckyColorList.length" class="lucky-colors">
              <span
                v-for="(c, i) in luckyColorList"
                :key="i"
                class="color-dot"
                :style="{ background: c }"
              />
            </span>
            <span v-else class="lucky-text">{{ luckyColorText }}</span>
          </div>
          <div class="lucky-grid-cell lucky-text">{{ luckyDirection }}</div>
          <div class="lucky-grid-cell lucky-text">{{ luckyNumber }}</div>
        </div>
      </div>

      <!-- 关键信息行 -->
      <div class="summary-rows">
        <div v-if="data.yin_yang" class="summary-row-wrap">
          <div
            class="summary-row"
            :class="{ clickable: data.yin_yang_desc }"
            @click="data.yin_yang_desc && toggleExpand('yinyang')"
          >
            <span class="summary-row-label">阴阳</span>
            <span class="summary-row-value">{{ data.yin_yang }}</span>
            <span
              class="summary-row-arrow"
              :class="{ expanded: expandedKeys.yinyang }"
              aria-hidden="true"
            >▼</span>
          </div>
          <div v-if="data.yin_yang_desc && expandedKeys.yinyang" class="summary-row-desc">
            {{ data.yin_yang_desc }}
          </div>
        </div>
        <div v-if="data.qiang_ruo" class="summary-row-wrap">
          <div
            class="summary-row"
            :class="{ clickable: data.qiang_ruo_desc }"
            @click="data.qiang_ruo_desc && toggleExpand('qiangruo')"
          >
            <span class="summary-row-label">强弱</span>
            <span class="summary-row-value">{{ data.qiang_ruo }}</span>
            <span
              class="summary-row-arrow"
              :class="{ expanded: expandedKeys.qiangruo }"
              aria-hidden="true"
            >▼</span>
          </div>
          <div v-if="data.qiang_ruo_desc && expandedKeys.qiangruo" class="summary-row-desc">
            {{ data.qiang_ruo_desc }}
          </div>
        </div>
        <div v-if="data.ge_ju" class="summary-row-wrap">
          <div
            class="summary-row"
            :class="{ clickable: data.ge_ju_desc }"
            @click="data.ge_ju_desc && toggleExpand('geju')"
          >
            <span class="summary-row-label">格局</span>
            <span class="summary-row-value">{{ data.ge_ju }}</span>
            <span
              class="summary-row-arrow"
              :class="{ expanded: expandedKeys.geju }"
              aria-hidden="true"
            >▼</span>
          </div>
          <div v-if="data.ge_ju_desc && expandedKeys.geju" class="summary-row-desc">
            {{ data.ge_ju_desc }}
          </div>
        </div>
        <div v-if="data.qi_he_partner" class="summary-row-wrap">
          <div
            class="summary-row"
            :class="{ clickable: data.qi_he_partner_desc }"
            @click="data.qi_he_partner_desc && toggleExpand('partner')"
          >
            <span class="summary-row-label">契合伴侣</span>
            <span class="summary-row-value">{{ data.qi_he_partner }}</span>
            <span
              class="summary-row-arrow"
              :class="{ expanded: expandedKeys.partner }"
              aria-hidden="true"
            >▼</span>
          </div>
          <div v-if="data.qi_he_partner_desc && expandedKeys.partner" class="summary-row-desc">
            {{ data.qi_he_partner_desc }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'

const WX_ORDER = ['水', '木', '火', '土', '金']
const WX_COLORS = {
  金: '#C9A227',
  木: '#4CAF50',
  水: '#2196F3',
  火: '#F44336',
  土: '#795548'
}

function lightenHex(hex, mix = 0.5) {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.round(((n >> 16) & 0xff) * (1 - mix) + 0xff * mix)
  const g = Math.round(((n >> 8) & 0xff) * (1 - mix) + 0xff * mix)
  const b = Math.round((n & 0xff) * (1 - mix) + 0xff * mix)
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
}

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

defineEmits(['viewCalendar'])

const expandedKeys = reactive({
  yinyang: false,
  qiangruo: false,
  geju: false,
  yongshen: false,
  luckycolor: false,
  luckypos: false,
  partner: false
})

function toggleExpand(key) {
  expandedKeys[key] = !expandedKeys[key]
}

const wxChartInnerR = 18

const dayMaster = computed(() => {
  const list = props.data.wx_info
  if (Array.isArray(list)) {
    const master = list.find((item) => item && item.is_day_master === true)
    if (master && (master.wx || master.五行)) return master.wx || master.五行
  }
  return props.data.ri_zhu || props.data.day_master || ''
})

const wxChartData = computed(() => {
  const raw = props.data.wx_chart || props.data.wx_percent || props.data.wx_distribution
  if (raw && typeof raw === 'object') {
    return WX_ORDER.filter((name) => raw[name] != null && raw[name] > 0).map((name) => ({
      name,
      value: Number(raw[name]) || 0,
      color: WX_COLORS[name] || '#ccc'
    }))
  }
  if (Array.isArray(props.data.wx_info) && props.data.wx_info.length) {
    const raw = props.data.wx_info.map((item) => {
      if (typeof item !== 'object' || item == null) return null
      const name = item.wx || item.五行 || item.name || item.element || ''
      const val = item.ratio != null ? item.ratio : (item.占比 ?? item.percent ?? item.value ?? 0)
      const num = Number(val)
      if (!name || (num !== 0 && !Number.isFinite(num))) return null
      const shiShen = Array.isArray(item.shi_shen) ? item.shi_shen : []
      return { name, value: num, color: WX_COLORS[name] || '#ccc', shi_shen: shiShen }
    }).filter(Boolean)
    if (raw.length !== 5) return raw
    const orderWithJinAt6 = ['金', '水', '木', '火', '土']
    const byName = {}
    raw.forEach((d) => { byName[d.name] = d })
    return orderWithJinAt6.map((name) => byName[name]).filter(Boolean)
  }
  return []
})

const wxChartSegments = computed(() => {
  const list = wxChartData.value
  if (!list.length) return []
  const total = list.reduce((s, d) => s + d.value, 0) || 1
  const maxRatio = Math.max(...list.map((d) => d.value), 0.001)
  const maxRadius = 90
  const minRadiusFactor = 0.2
  const cx = 100
  const cy = 100
  const anglePerSeg = 72
  const innerRadius = wxChartInnerR
  const gapAngle = 2
  let startAngle = 18
  return list.map((d) => {
    const percent = total > 0 ? Math.round((d.value / total) * 100) : 0
    const radius = maxRadius * (minRadiusFactor + (1 - minRadiusFactor) * (d.value / maxRatio))
    const endAngle = startAngle + anglePerSeg
    const effStart = startAngle + gapAngle / 2
    const effEnd = endAngle - gapAngle / 2
    const effStartRad = (effStart * Math.PI) / 180
    const effEndRad = (effEnd * Math.PI) / 180
    const x1i = cx + innerRadius * Math.cos(effStartRad)
    const y1i = cy + innerRadius * Math.sin(effStartRad)
    const x1o = cx + radius * Math.cos(effStartRad)
    const y1o = cy + radius * Math.sin(effStartRad)
    const x2o = cx + radius * Math.cos(effEndRad)
    const y2o = cy + radius * Math.sin(effEndRad)
    const x2i = cx + innerRadius * Math.cos(effEndRad)
    const y2i = cy + innerRadius * Math.sin(effEndRad)
    const angleSpan = effEnd - effStart
    const large = angleSpan > 180 ? 1 : 0
    const path = `M ${x1i} ${y1i} L ${x1o} ${y1o} A ${radius} ${radius} 0 ${large} 1 ${x2o} ${y2o} L ${x2i} ${y2i} A ${innerRadius} ${innerRadius} 0 ${large} 0 ${x1i} ${y1i} Z`
    const midRad = ((effStart + angleSpan / 2) * Math.PI) / 180
    const textR = innerRadius + (radius - innerRadius) * 0.5
    const tx = cx + textR * Math.cos(midRad)
    const ty = cy + textR * Math.sin(midRad)
    startAngle = endAngle
    return {
      name: d.name,
      path,
      color: d.color,
      radius,
      gradId: 'wx-grad-' + d.name,
      percent,
      textX: tx,
      textY: ty
    }
  })
})

const wxSegmentGradients = computed(() =>
  wxChartSegments.value.map((seg) => ({ id: seg.gradId, color: seg.color, radius: seg.radius }))
)

const wxRing = computed(() => {
  const list = wxChartData.value
  const cx = 100
  const cy = 100
  const outerR = 92
  const defaultRing = { cx, cy, outerR, shengList: [], dotList: [] }
  if (!list.length || list.length !== 5) return defaultRing
  const deg2rad = (deg) => (deg * Math.PI) / 180
  const shengList = []
  const sectorStart = 18
  const shengOffset = 32
  const arrowHalfLen = 6
  const shengTextR = outerR + 8
  for (let i = 0; i < 5; i++) {
    const angleDeg = sectorStart + 36 + 72 * i + shengOffset
    const rad = deg2rad(angleDeg)
    const ax = cx + outerR * Math.cos(rad)
    const ay = cy + outerR * Math.sin(rad)
    const tx = arrowHalfLen * Math.sin(rad)
    const ty = -arrowHalfLen * Math.cos(rad)
    shengList.push({
      x: cx + shengTextR * Math.cos(rad),
      y: cy + shengTextR * Math.sin(rad),
      arrowPath: `M ${ax + tx} ${ay + ty} L ${ax - tx} ${ay - ty}`
    })
  }
  const dotList = []
  const labelR = outerR + 16
  for (let i = 0; i < 5; i++) {
    const angleDeg = sectorStart + 36 + 72 * i
    const rad = deg2rad(angleDeg)
    const x = cx + outerR * Math.cos(rad)
    const y = cy + outerR * Math.sin(rad)
    const shiShen = list[i].shi_shen || []
    dotList.push({
      x,
      y,
      labelX: cx + labelR * Math.cos(rad),
      labelY: cy + labelR * Math.sin(rad),
      shiShen
    })
  }
  return { cx, cy, outerR, shengList, dotList }
})

const yongShenText = computed(() => {
  const xi = props.data.xi_yong_shen
  const ji = props.data.ji_yong_shen
  const x = Array.isArray(xi) && xi.length ? `喜用${xi.join('、')}` : ''
  const j = Array.isArray(ji) && ji.length ? `忌用${ji.join('、')}` : ''
  if (!x && !j) return ''
  return [x, j].filter(Boolean).join('，  ')
})

const luckyInfo = computed(() => props.data.lucky_info || {})

const hasLuckyInfo = computed(() => {
  const li = luckyInfo.value
  return (li.color ?? li.幸运颜色 ?? li.幸运色彩 ?? '') !== '' ||
    (li.direction ?? li.幸运方位 ?? '') !== '' ||
    (li.number ?? li.幸运数字 ?? '') !== ''
})

const luckyColorRaw = computed(() => {
  const li = luckyInfo.value
  const v = li.color ?? li.幸运颜色 ?? li.幸运色彩 ?? ''
  return v != null && v !== '' ? String(v) : ''
})

const luckyColorList = computed(() => {
  const raw = luckyColorRaw.value
  if (!raw) return []
  const hex = /^#([0-9A-Fa-f]{6})$/
  const names = {
    绿: '#4caf50',   /* 绿色 */
    青: '#00acc1',   /* 青色/青绿 */
    蓝: '#2196f3',   /* 蓝色 */
    红: '#e53935',   /* 红色 */
    黄: '#fdd835',   /* 黄色 */
    橙: '#ff9800',   /* 橙色 */
    棕: '#6d4c41',   /* 棕色 */
    紫: '#8e24aa',   /* 紫色 */
    白: '#fafafa',   /* 白 */
    黑: '#263238'    /* 黑 */
  }
  return raw.split(/[,，、\s]+/).map((s) => s.trim()).filter(Boolean).map((s) => {
    if (hex.test(s)) return s
    return names[s] || (s.startsWith('#') ? s : '#ccc')
  })
})

const luckyColorText = computed(() => luckyColorRaw.value || '—')

const luckyDirection = computed(() => {
  const v = luckyInfo.value.direction ?? luckyInfo.value.幸运方位 ?? ''
  return v != null && v !== '' ? String(v) : '—'
})

const luckyNumber = computed(() => {
  const v = luckyInfo.value.number ?? luckyInfo.value.幸运数字 ?? ''
  return v != null && v !== '' ? String(v) : '—'
})
</script>

<style scoped>
.summary-page {
  background: linear-gradient(180deg, #f8f2ec 0%, #f5ede5 50%, #f8f2ec 100%);
  margin: -12px;
  padding: 16px 12px 24px;
  min-height: 60vh;
}

.summary-card {
  background: #fff;
  border-radius: 16px;
  padding: 16px 14px 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  max-width: 100%;
}

.summary-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 14px;
}

.summary-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  flex: 1;
  min-width: 0;
}

.summary-action-btn {
  flex-shrink: 0;
  padding: 6px 12px;
  font-size: 12px;
  color: #333;
  background: #ebe5e0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.summary-desc-block {
  font-size: 14px;
  color: #333;
  line-height: 1.75;
  margin-bottom: 20px;
}

.summary-wx-section {
  margin-bottom: 20px;
}

.summary-wx-section--center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wx-chart-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.wx-donut {
  width: 350px;
  height: 350px;
  max-width: 100%;
}

.wx-seg-name {
  font-size: 14px;
  fill: #1a1a1a;
  font-weight: 700;
}

.wx-seg-pct {
  font-size: 11px;
  fill: #444;
}

.wx-seg-daymaster {
  font-size: 10px;
  fill: #666;
  font-weight: 500;
}

.wx-inner-blank {
  fill: #fff;
}

.wx-outer-circle {
  fill: none;
  stroke: #bbb;
  stroke-width: 0.6;
}

.wx-sheng-arrow {
  stroke: #bbb;
  stroke-width: 0.6;
}

.wx-ring-label {
  font-size: 6px;
  fill: #444;
}

.wx-ring-label--sheng {
  fill: #2e7d32;
}

.wx-outer-dot {
  fill: #999;
}

.wx-shi-shen-label {
  font-size: 10px;
  fill: #444;
  font-weight: 500;
}

.wx-info-line {
  text-align: center;
  font-size: 12px;
  color: #666;
  margin: 0;
}

.yongshen-center {
  margin-bottom: 10px;
}

.summary-row--center {
  justify-content: center;
}

.summary-row--center .summary-row-value {
  flex: none;
  text-align: center;
}

.lucky-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
  padding: 12px 14px;
  background: #fdfcfa;
  border-radius: 12px;
  border: 1px solid #f5f0eb;
}

.lucky-grid-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0 12px;
}

.lucky-grid-row--labels .lucky-grid-cell {
  font-size: 12px;
  font-weight: 500;
  color: #999;
  padding: 2px 0 4px;
}

.lucky-grid-row--values .lucky-grid-cell {
  font-size: 16px;
  font-weight: 500;
  color: #666;
  padding: 10px 0 12px;
  min-height: 48px;
  line-height: 1.3;
}

.lucky-grid-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
}

.lucky-colors {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
}

.lucky-grid .color-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
}

.lucky-text {
  text-align: center;
  word-break: break-all;
}

.wx-info-icon {
  margin-right: 4px;
  opacity: 0.8;
}

.summary-rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.summary-row-wrap {
  background: #fdfcfa;
  border-radius: 12px;
  border: 1px solid #f5f0eb;
  overflow: hidden;
}

.summary-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  min-height: 44px;
}

.summary-row.clickable {
  cursor: pointer;
}

.summary-row-desc {
  padding: 8px 12px 12px;
  font-size: 12px;
  color: #666;
  line-height: 1.6;
  border-top: 1px solid #f5f0eb;
}

.summary-row-label {
  flex-shrink: 0;
  padding: 4px 10px;
  font-size: 13px;
  font-weight: 600;
  color: #333;
  background: #f0e6dc;
  border-radius: 20px;
}

.summary-row-value {
  flex: 1;
  font-size: 13px;
  color: #333;
  min-width: 0;
}

.summary-row-value.summary-row-colors {
  display: flex;
  align-items: center;
  gap: 6px;
}

.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;
}

.summary-row-arrow {
  flex-shrink: 0;
  font-size: 10px;
  color: #999;
  transform: scale(0.9);
  transition: transform 0.2s ease;
}

.summary-row-arrow.expanded {
  transform: scale(0.9) rotate(180deg);
}
</style>
