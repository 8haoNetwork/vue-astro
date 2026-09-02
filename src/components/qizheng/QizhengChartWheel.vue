<template>
  <div class="qizheng-wheel">
    <svg :viewBox="`0 0 ${size} ${size}`" role="img" :aria-label="ariaLabel">
      <g :transform="`translate(${origin}, ${origin})`">
        <!-- 洞微年份：标在盘外大限交界处（每段起始公历年） -->
        <text
          v-for="mark in dongweiYearMarks"
          :key="'dw-y-' + mark.sequence"
          :x="mark.x"
          :y="mark.y"
          text-anchor="middle"
          dominant-baseline="middle"
          class="ring-label dongwei-year"
          :transform="`rotate(${mark.rotate}, ${mark.x}, ${mark.y})`"
        >{{ mark.year }}</text>

        <!-- 洞微年龄圈：分割线围出每岁一格，数字在格心 -->
        <circle :r="rAgeOuter" fill="#f7f3ec" stroke="#c9b99a" :stroke-width="SW_FRAME" />
        <path
          v-for="(cell, ci) in dongweiAgeCells"
          :key="'dw-cell-' + ci"
          :d="cell.path"
          :fill="cell.fill"
          stroke="none"
        />
        <line
          v-for="(div, di) in dongweiAgeDividers"
          :key="'dw-div-' + di"
          :x1="div.x1"
          :y1="div.y1"
          :x2="div.x2"
          :y2="div.y2"
          stroke="#c9b99a"
          :stroke-width="SW_GRID"
        />
        <text
          v-for="lab in dongweiAgeLabels"
          :key="'dw-a-' + lab.age"
          :x="lab.x"
          :y="lab.y"
          text-anchor="middle"
          dominant-baseline="middle"
          class="ring-label dongwei-age"
        >{{ lab.age }}</text>
        <circle :r="rAgeInner" fill="none" stroke="#e0d4c0" :stroke-width="SW_RING" />

        <!-- 流年神煞：本命/行运同半径占位，本命无字 -->
        <path
          v-for="sec in flowSpiritSectors"
          :key="'sp-fl-' + sec.branch"
          :d="sec.path"
          fill="#f3ebe0"
          stroke="#e0d4c0"
          :stroke-width="SW_GRID"
        />
        <text
          v-for="(line, li) in flowSpiritLabelLines"
          :key="'sp-fl-t-' + line.branch + '-' + li"
          :x="line.x"
          :y="line.y"
          text-anchor="middle"
          dominant-baseline="middle"
          class="ring-label spirit flow"
        >{{ line.text }}</text>
        <circle :r="rFlowSpiritOuter" fill="none" stroke="#e0d4c0" :stroke-width="SW_RING" />

        <!-- 本命神煞（含长生） -->
        <path
          v-for="sec in natalSpiritSectors"
          :key="'sp-n-' + sec.branch"
          :d="sec.path"
          fill="#faf6ef"
          stroke="#e0d4c0"
          :stroke-width="SW_GRID"
        />
        <text
          v-for="(line, li) in natalSpiritLabelLines"
          :key="'sp-n-t-' + line.branch + '-' + li"
          :x="line.x"
          :y="line.y"
          text-anchor="middle"
          dominant-baseline="middle"
          class="ring-label spirit"
          :class="{ changsheng: line.kind === 'changsheng' }"
        >{{ line.text }}</text>
        <circle :r="rSpiritBandOuter" fill="none" stroke="#e0d4c0" :stroke-width="SW_RING" />

        <!-- 十一曜（本命）：二十八宿外侧 -->
        <path :d="natalStarBandPath" fill="#f3ebe0" stroke="#e0d4c0" :stroke-width="SW_GRID" />

        <!-- 二十八宿 -->
        <path
          v-for="(seg, i) in xiuSectors"
          :key="'xiu-' + i"
          :d="seg.path"
          :fill="seg.fill"
          stroke="#e8dfd2"
          :stroke-width="SW_GRID"
        />
        <text
          v-for="(seg, i) in xiuSectors"
          :key="'xiu-t-' + i"
          :x="seg.label.x"
          :y="seg.label.y"
          text-anchor="middle"
          dominant-baseline="middle"
          class="ring-label xiu"
        >{{ seg.labelText }}</text>

        <!-- 中间两圈：本命=十二宫(外)+星座(内)；行运=流曜(外)+十二宫(内) -->
        <template v-if="isTransit">
          <path :d="flowStarBandPath" fill="#efe8dc" stroke="#e0d4c0" :stroke-width="SW_GRID" />
        </template>
        <template v-else>
          <path
            v-for="sec in signSectors"
            :key="'sign-' + sec.branch"
            :d="sec.path"
            fill="#f7f1e6"
            stroke="#eadfce"
            :stroke-width="SW_GRID"
          />
          <text
            v-for="sec in signLabels"
            :key="'sign-t-' + sec.branch"
            :x="sec.label.x"
            :y="sec.label.y"
            text-anchor="middle"
            dominant-baseline="middle"
            class="ring-label sign"
          >{{ sec.text }}</text>
        </template>

        <path
          v-for="sec in palaceSectors"
          :key="'pal-' + sec.branch"
          :d="sec.path"
          :fill="sec.isMing ? '#fff7ea' : '#fbf8f2'"
          :stroke="sec.isMing ? '#c4a35a' : '#eadfce'"
          :stroke-width="sec.isMing ? SW_MING : SW_RING"
        />
        <text
          v-for="sec in palaceSectors"
          :key="'pal-t-' + sec.branch"
          :x="sec.label.x"
          :y="sec.label.y"
          text-anchor="middle"
          dominant-baseline="middle"
          class="ring-label palace"
          :class="{ 'is-ming': sec.isMing }"
        >{{ sec.name }}</text>
        <circle :r="rMidOuter" fill="none" stroke="#e0d4c0" :stroke-width="SW_RING" />
        <circle :r="rMidSplit" fill="none" stroke="#e0d4c0" :stroke-width="SW_GRID" />
        <circle :r="rMidInner" fill="none" stroke="#e0d4c0" :stroke-width="SW_RING" />

        <!-- 内三圈：宫主 / 八卦 / 地支（两盘相同） -->
        <path
          v-for="sec in ciBandSectors"
          :key="'ci-' + sec.branch"
          :d="sec.path"
          :fill="sec.fill"
          stroke="none"
        />
        <g class="ci-dividers" opacity="0.35">
          <circle :r="rBranchOuter" fill="none" stroke="#c9b99a" :stroke-width="SW_GRID" />
          <circle :r="rBaguaOuter" fill="none" stroke="#c9b99a" :stroke-width="SW_GRID" />
          <circle :r="rLordOuter" fill="none" stroke="#c9b99a" :stroke-width="SW_GRID" />
        </g>
        <g class="ci-radials">
          <line
            v-for="(ln, i) in ciRadialLines"
            :key="'ci-r-' + i"
            :x1="ln.x1"
            :y1="ln.y1"
            :x2="ln.x2"
            :y2="ln.y2"
            stroke="#d4c4a8"
            :stroke-width="SW_RING"
          />
        </g>
        <circle :r="rCiOuter" fill="none" stroke="#e0d4c0" :stroke-width="SW_FRAME" />
        <circle :r="rCiInner" fill="none" stroke="#e0d4c0" :stroke-width="SW_FRAME" />

        <text
          v-for="sec in lordLabels"
          :key="'lord-t-' + sec.branch"
          :x="sec.label.x"
          :y="sec.label.y"
          text-anchor="middle"
          dominant-baseline="middle"
          class="ring-label"
        >{{ sec.text }}</text>
        <text
          v-for="sec in baguaLabels"
          :key="'gua-t-' + sec.branch"
          :x="sec.label.x"
          :y="sec.label.y"
          text-anchor="middle"
          dominant-baseline="middle"
          class="ring-label"
        >{{ sec.text }}</text>
        <text
          v-for="sec in branchLabels"
          :key="'br-t-' + sec.branch"
          :x="sec.label.x"
          :y="sec.label.y"
          text-anchor="middle"
          dominant-baseline="middle"
          class="ring-label"
          :fill="sec.stroke"
        >{{ sec.labelText }}</text>

        <!-- 会合连线 -->
        <line
          v-for="(line, i) in aspectLines"
          :key="'asp-' + i"
          :x1="line.x1"
          :y1="line.y1"
          :x2="line.x2"
          :y2="line.y2"
          :stroke="line.color"
          :stroke-width="line.width"
          :stroke-dasharray="line.dash"
          stroke-linecap="round"
          opacity="0.75"
        />

        <!-- 盘心：宿+度主、宿内度（命度类型见解读/基础，此处不重复「月度命」等） -->
        <circle :r="rCenter" fill="#fffdf8" stroke="#e0d4c0" :stroke-width="SW_FRAME" />
        <text y="-4" text-anchor="middle" class="ming-xiu">{{ mingXiu }}</text>
        <text y="10" text-anchor="middle" class="ming-deg">{{ mingDeg }}</text>

        <!-- 十一曜：单字 + 虚线接到本圈内沿的度数点（不进入内盘） -->
        <g
          v-for="pt in natalPoints"
          :key="'n-' + pt.key"
          class="star-pointer"
          :class="{ 'is-active': selectedKey === pt.key }"
          @click="selectStar(pt.key)"
        >
          <path
            :d="pt.lead"
            fill="none"
            :stroke="pt.color"
            :stroke-width="SW_RING"
            stroke-dasharray="1.6 1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
            opacity="0.72"
          />
          <circle class="star-hit" :cx="pt.tx" :cy="pt.ty" r="7" fill="transparent" />
          <text
            :x="pt.tx"
            :y="pt.ty"
            text-anchor="middle"
            dominant-baseline="middle"
            class="ring-label star"
            :fill="pt.color"
          >{{ pt.label }}</text>
        </g>

        <g v-for="pt in flowPoints" :key="'f-' + pt.key" class="star-pointer is-flow">
          <path
            :d="pt.lead"
            fill="none"
            :stroke="pt.color"
            :stroke-width="SW_RING"
            stroke-dasharray="1.6 1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
            opacity="0.55"
          />
          <text
            :x="pt.tx"
            :y="pt.ty"
            text-anchor="middle"
            dominant-baseline="middle"
            class="ring-label star flow"
            :fill="pt.color"
          >{{ pt.label }}</text>
        </g>

        <!-- 当前虚岁：只在年龄圈上短标，不拉通盘心 -->
        <g v-if="agePointer" class="age-now-pointer">
          <line
            :x1="agePointer.x1"
            :y1="agePointer.y1"
            :x2="agePointer.x2"
            :y2="agePointer.y2"
            stroke="#c0453a"
            stroke-width="2"
            stroke-linecap="round"
          />
          <circle
            :cx="agePointer.cx"
            :cy="agePointer.cy"
            r="2"
            fill="#c0453a"
          />
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  ASPECT_COLORS,
  BRANCH_ORDER,
  annularSectorPath,
  branchFill,
  branchStroke,
  ciSectorByBranch,
  formatDegDecimal,
  polar,
  spreadWheelDegs,
  starColor,
  starNameShort,
  starWheelDeg,
  tropicalSpanToWheelArc,
  palaceNameShort,
  xiuSpansForWheel,
  WHEEL_ZI_MID
} from '../../utils/qizhengChart'

const props = defineProps({
  natal: { type: Object, default: null },
  showFlow: { type: Boolean, default: false },
  selectedKey: { type: String, default: '' }
})

const emit = defineEmits(['select-star'])

const size = 620
const origin = 310
const cx = 0
const cy = 0
const rCenter = 38
const rAspect = 18

/**
 * 由内到外（本命/行运同半径）：
 * 地支 → 八卦 → 宫主 → 〔本命：星座+十二宫 | 行运：十二宫+流曜〕
 * → 二十八宿 → 本命十一曜 → 流年神煞（本命留空）→ 本命神煞 → 年龄
 *
 * 环宽三档：窄圈（内三圈+年龄）/ 中圈（宫·座·宿·曜）/ 神煞
 */
const T_NARROW = 15
const T_MID = 17
const T_SPIRIT = 26

/** 描边三档 + 命宫强调 */
const SW_GRID = 0.4
const SW_RING = 0.55
const SW_FRAME = 0.9
const SW_MING = 1.2

const rCiInner = 42
const rBranchInner = rCiInner
const rBranchOuter = rBranchInner + T_NARROW
const rBaguaInner = rBranchOuter
const rBaguaOuter = rBaguaInner + T_NARROW
const rLordInner = rBaguaOuter
const rLordOuter = rLordInner + T_NARROW
const rCoreOuter = rLordOuter
const rCiOuter = rCoreOuter

/** 中间两圈等宽：本命=星座+十二宫，行运=十二宫+流曜 */
const rMidInner = rCoreOuter
const rMidOuter = rMidInner + T_MID * 2

const rXiuInner = rMidOuter
const rXiuOuter = rXiuInner + T_MID
const rNatalStarInner = rXiuOuter
const rNatalStarOuter = rNatalStarInner + T_MID
const rNatalStarMid = (rNatalStarInner + rNatalStarOuter) / 2
const rFlowSpiritInner = rNatalStarOuter
const rFlowSpiritOuter = rFlowSpiritInner + T_SPIRIT
const rFlowSpiritMid = (rFlowSpiritInner + rFlowSpiritOuter) / 2
const rNatalSpiritInner = rFlowSpiritOuter
const rNatalSpiritOuter = rNatalSpiritInner + T_SPIRIT
const rNatalSpiritMid = (rNatalSpiritInner + rNatalSpiritOuter) / 2
const rSpiritBandOuter = rNatalSpiritOuter
const rAgeInner = rNatalSpiritOuter
const rAgeOuter = rAgeInner + T_NARROW
const rAgeMid = (rAgeInner + rAgeOuter) / 2
const rYearLabel = rAgeOuter + T_NARROW

/** 行运盘 */
const isTransit = computed(() => !!props.showFlow)

/**
 * 中间层半径：
 * 本命 内星座 / 外十二宫；行运 内十二宫 / 外流曜
 */
const midGeom = computed(() => {
  const a0 = rMidInner
  const a1 = rMidInner + T_MID
  const a2 = rMidOuter
  if (isTransit.value) {
    return {
      palaceInner: a0,
      palaceOuter: a1,
      palaceMid: (a0 + a1) / 2,
      flowStarInner: a1,
      flowStarOuter: a2,
      flowStarMid: (a1 + a2) / 2,
      signInner: a0,
      signOuter: a0,
      signMid: a0
    }
  }
  return {
    signInner: a0,
    signOuter: a1,
    signMid: (a0 + a1) / 2,
    palaceInner: a1,
    palaceOuter: a2,
    palaceMid: (a1 + a2) / 2,
    flowStarInner: a2,
    flowStarOuter: a2,
    flowStarMid: a2
  }
})

const rPalaceInner = computed(() => midGeom.value.palaceInner)
const rPalaceOuter = computed(() => midGeom.value.palaceOuter)
const rPalaceMid = computed(() => midGeom.value.palaceMid)
const rSignInner = computed(() => midGeom.value.signInner)
const rSignOuter = computed(() => midGeom.value.signOuter)
const rSignMid = computed(() => midGeom.value.signMid)
const rFlowStarInner = computed(() => midGeom.value.flowStarInner)
const rFlowStarOuter = computed(() => midGeom.value.flowStarOuter)
const rFlowStarMid = computed(() => midGeom.value.flowStarMid)

const natalStarBandPath = annularSectorPath(cx, cy, rNatalStarInner, rNatalStarOuter, 0, 360)
const flowStarBandPath = computed(() => {
  if (!isTransit.value) return ''
  return annularSectorPath(
    cx,
    cy,
    rFlowStarInner.value,
    rFlowStarOuter.value,
    0,
    360
  )
})

const ming = computed(() => props.natal?.ming || null)
const mingXiu = computed(() => {
  const m = ming.value
  if (!m) return ''
  return `${m.xiu_label || ''}${m.lord_label || ''}`
})
const mingDeg = computed(() => formatDegDecimal(ming.value?.xiu_degree))
const mingBranch = computed(() => props.natal?.palaces?.[0]?.earthly_branch || '')

const ariaLabel = computed(() => {
  if (!ming.value) return '七政四余圆盘'
  return `七政四余圆盘，${mingXiu.value || ''} ${mingDeg.value || ''}`
})

function sector(i, r0, r1) {
  const start = i * 30 - 15 + WHEEL_ZI_MID
  return annularSectorPath(cx, cy, r0, r1, start, 30)
}

function midLabel(i, r) {
  return polar(cx, cy, r, i * 30 + WHEEL_ZI_MID)
}

function ringMid(r0, r1) {
  return (r0 + r1) / 2
}

/** 内三圈（地支/八卦/宫主）共用背景 */
const ciBandSectors = computed(() =>
  BRANCH_ORDER.map((branch, i) => ({
    branch,
    path: sector(i, rCiInner, rCoreOuter),
    fill: branchFill(branch)
  }))
)

const ciRadialLines = computed(() =>
  BRANCH_ORDER.map((_, i) => {
    const deg = i * 30 - 15 + WHEEL_ZI_MID
    const p0 = polar(cx, cy, rCiInner, deg)
    const p1 = polar(cx, cy, rCoreOuter, deg)
    return { x1: p0.x, y1: p0.y, x2: p1.x, y2: p1.y }
  })
)

const branchLabels = computed(() =>
  BRANCH_ORDER.map((branch, i) => {
    const ci = ciSectorByBranch(branch)
    return {
      branch,
      label: midLabel(i, ringMid(rBranchInner, rBranchOuter)),
      labelText: ci?.branchLabel || '',
      stroke: branchStroke(branch)
    }
  })
)

const baguaLabels = computed(() =>
  BRANCH_ORDER.map((branch, i) => ({
    branch,
    label: midLabel(i, ringMid(rBaguaInner, rBaguaOuter)),
    text: ciSectorByBranch(branch)?.bagua || ''
  }))
)

const lordLabels = computed(() =>
  BRANCH_ORDER.map((branch, i) => ({
    branch,
    label: midLabel(i, ringMid(rLordInner, rLordOuter)),
    text: ciSectorByBranch(branch)?.palaceLord || ''
  }))
)

/** 十二星座：仅本命盘（行运同位置改放流曜） */
const signLabels = computed(() => {
  if (isTransit.value) return []
  return BRANCH_ORDER.map((branch, i) => {
    const ci = ciSectorByBranch(branch)
    return {
      branch,
      label: midLabel(i, rSignMid.value),
      text: ci?.signShort || (ci?.sign ? ci.sign.slice(-1) : '')
    }
  })
})

const signSectors = computed(() => {
  if (isTransit.value) return []
  const r0 = rSignInner.value
  const r1 = rSignOuter.value
  return BRANCH_ORDER.map((branch, i) => ({
    branch,
    path: sector(i, r0, r1)
  }))
})

/** 十二宫圈标注：单字简称，完整名仍在 palaces[].name */
function palaceRingLabel(pal) {
  return palaceNameShort(pal)
}

function findPalaceByBranch(branch) {
  const palaces = props.natal?.palaces || []
  return palaces.find((p) => p.earthly_branch === branch || p.branch === branch) || null
}

const palaceSectors = computed(() => {
  const r0 = rPalaceInner.value
  const r1 = rPalaceOuter.value
  const mid = rPalaceMid.value
  return BRANCH_ORDER.map((branch, i) => {
    const pal = findPalaceByBranch(branch)
    return {
      branch,
      path: sector(i, r0, r1),
      isMing: branch === mingBranch.value || pal?.key === 'ming',
      name: palaceRingLabel(pal),
      label: midLabel(i, mid)
    }
  })
})

/** 神煞圈文案：优先 labels，否则 keys（key 可能是字符串或 { key, label }） */
function spiritItemText(item) {
  if (item == null) return ''
  if (typeof item === 'string' || typeof item === 'number') return String(item).trim()
  return String(item.label || item.name || item.key || '').trim()
}

function spiritListTexts(pal, labelKey, keyKey) {
  if (!pal) return []
  const labels = Array.isArray(pal[labelKey])
    ? pal[labelKey].map(spiritItemText).filter(Boolean)
    : []
  if (labels.length) return labels
  const keys = Array.isArray(pal[keyKey])
    ? pal[keyKey].map(spiritItemText).filter(Boolean)
    : []
  return keys
}

function spiritTexts(pal) {
  return spiritListTexts(pal, 'spirit_star_labels', 'spirit_stars')
}

function flowSpiritTexts(pal) {
  return spiritListTexts(pal, 'flow_spirit_star_labels', 'flow_spirit_stars')
}

/** 流年神煞扇区：本命/行运均占位，本命无字 */
const flowSpiritSectors = computed(() =>
  BRANCH_ORDER.map((branch, i) => ({
    branch,
    path: sector(i, rFlowSpiritInner, rFlowSpiritOuter)
  }))
)

const natalSpiritSectors = computed(() =>
  BRANCH_ORDER.map((branch, i) => ({
    branch,
    path: sector(i, rNatalSpiritInner, rNatalSpiritOuter)
  }))
)

/** 虚岁半开区间内的整数岁；落点按该宫 30° 格内均分（洞微顺行=顺时针） */
function agesInSegment(startAge, endAge) {
  const a0 = Number(startAge)
  const a1 = Number(endAge)
  if (Number.isNaN(a0) || Number.isNaN(a1) || !(a1 > a0)) return []
  const out = []
  const first = Math.ceil(a0 - 1e-9)
  for (let a = first; a < a1 - 1e-9; a += 1) out.push(a)
  return out
}

function branchSectorStart(branchIndex) {
  return branchIndex * 30 - 15 + WHEEL_ZI_MID
}

/**
 * 洞微年龄圈：每岁一格（分割线在格界，数字在格心），按宫管年均分 30°。
 */
const dongweiAgeLayout = computed(() => {
  const segs = props.natal?.dongwei_segments
  if (!Array.isArray(segs) || !segs.length) {
    return { cells: [], dividers: [], labels: [], byAge: {} }
  }
  const cells = []
  const dividers = []
  const labels = []
  const byAge = {}
  let cellIndex = 0
  segs.forEach((seg) => {
    const i = BRANCH_ORDER.indexOf(seg.earthly_branch)
    if (i < 0) return
    const ages = agesInSegment(seg.start_age, seg.end_age)
    if (!ages.length) return
    const startDeg = branchSectorStart(i)
    const step = 30 / ages.length
    const a0 = rAgeInner
    const a1 = rAgeOuter
    const aMid = rAgeMid
    for (let k = 0; k <= ages.length; k++) {
      const deg = startDeg + k * step
      const p0 = polar(cx, cy, a0, deg)
      const p1 = polar(cx, cy, a1, deg)
      dividers.push({ x1: p0.x, y1: p0.y, x2: p1.x, y2: p1.y })
    }
    ages.forEach((age, idx) => {
      const cellStart = startDeg + idx * step
      const midDeg = cellStart + step / 2
      cells.push({
        path: annularSectorPath(cx, cy, a0, a1, cellStart, step),
        fill: cellIndex % 2 === 0 ? '#f3ebe0' : '#efe6d8'
      })
      const mid = polar(cx, cy, aMid, midDeg)
      labels.push({ age, x: mid.x, y: mid.y })
      byAge[age] = midDeg
      cellIndex += 1
    })
  })
  return { cells, dividers, labels, byAge }
})

const dongweiAgeCells = computed(() => dongweiAgeLayout.value.cells)
const dongweiAgeDividers = computed(() => dongweiAgeLayout.value.dividers)
const dongweiAgeLabels = computed(() => dongweiAgeLayout.value.labels)

/** 与后端一致：出生年虚岁=1，公历年 = birth_year + age - 1 */
function parseChartDate(s) {
  if (!s) return null
  const d = new Date(String(s).trim().replace(' ', 'T'))
  return Number.isNaN(d.getTime()) ? null : d
}

function xuSuiAt(birthDt, refDt) {
  const birth = parseChartDate(birthDt)
  if (!birth) return null
  const ref = parseChartDate(refDt) || new Date()
  return ref.getFullYear() - birth.getFullYear() + 1
}

/** 当前虚岁指针：本命用今天，行运用 target_dt */
const agePointer = computed(() => {
  const byAge = dongweiAgeLayout.value.byAge
  const ages = Object.keys(byAge).map(Number).sort((a, b) => a - b)
  if (!ages.length) return null
  const natal = props.natal
  const refDt = natal?.target_dt || null
  let age = xuSuiAt(natal?.birth_dt, refDt)
  if (age == null) return null
  if (age < ages[0]) age = ages[0]
  if (age > ages[ages.length - 1]) age = ages[ages.length - 1]
  const deg = byAge[age]
  if (deg == null) return null
  const inner = polar(cx, cy, rAgeInner + 0.5, deg)
  const tip = polar(cx, cy, rAgeOuter + 3, deg)
  const mid = polar(cx, cy, rAgeMid, deg)
  return { age, x1: inner.x, y1: inner.y, x2: tip.x, y2: tip.y, cx: mid.x, cy: mid.y }
})

/** 每段起始公历年，钉在该宫格顺行起点（大限交界）外侧 */
const dongweiYearMarks = computed(() => {
  const segs = props.natal?.dongwei_segments
  if (!Array.isArray(segs) || !segs.length) return []
  const yr = rYearLabel
  return segs
    .map((seg) => {
      const i = BRANCH_ORDER.indexOf(seg.earthly_branch)
      if (i < 0 || seg.start_year == null) return null
      const deg = branchSectorStart(i)
      const p = polar(cx, cy, yr, deg)
      return {
        sequence: seg.sequence,
        year: String(seg.start_year),
        x: p.x,
        y: p.y,
        rotate: deg > 90 && deg < 270 ? deg + 180 : deg
      }
    })
    .filter(Boolean)
})

/**
 * 一条神煞竖排：同一神煞两字沿半径拉开；同宫多列适度散开。
 */
const SPIRIT_CHAR_STEP = 12

function spiritColAngles(palaceIndex, count) {
  const mid = palaceIndex * 30 + WHEEL_ZI_MID
  if (count <= 1) return [mid]
  /** 列距适中：约 25° 内均分，避免贴满 30° 宫宽 */
  const span = Math.min(25, 5 * (count - 1) + 6)
  const start = mid - span / 2
  const step = span / (count - 1)
  return Array.from({ length: count }, (_, c) => start + c * step)
}

function stackSpiritChars(chars, angle, midR, ringHalf) {
  const n = chars.length
  if (!n) return []
  const usable = Math.max((ringHalf || SPIRIT_CHAR_STEP) * 2 - 2, SPIRIT_CHAR_STEP)
  /** 两字优先用满字距；仅多字且圈厚不够时才压缩 */
  const step = n <= 1
    ? SPIRIT_CHAR_STEP
    : Math.min(SPIRIT_CHAR_STEP, Math.max(10, usable / (n - 1)))
  const span = (n - 1) * step
  let r = midR + span / 2
  return chars.map((text) => {
    const p = polar(cx, cy, r, angle)
    const item = { text, x: p.x, y: p.y }
    r -= step
    return item
  })
}

function changshengText(pal) {
  const label = String(pal?.changsheng_label || '').trim()
  if (label) return label
  return spiritItemText(pal?.changsheng)
}

function layoutSpiritCols(getCols, midR, ringHalf) {
  const lines = []
  BRANCH_ORDER.forEach((branch, i) => {
    const cols = getCols(findPalaceByBranch(branch))
    if (!cols.length) return
    const angles = spiritColAngles(i, cols.length)
    cols.forEach((col, ni) => {
      stackSpiritChars(col.chars, angles[ni], midR, ringHalf).forEach((item) => {
        lines.push({
          branch,
          kind: col.kind,
          text: item.text,
          x: item.x,
          y: item.y
        })
      })
    })
  })
  return lines
}

function nameCols(names, kind) {
  return names
    .map((name) => [...String(name)].filter((ch) => ch.trim()))
    .filter((chars) => chars.length)
    .map((chars) => ({ chars, kind }))
}

/** 本命神煞圈：长生 + spirit_stars */
const natalSpiritLabelLines = computed(() => {
  const half = (rNatalSpiritOuter - rNatalSpiritInner) / 2
  return layoutSpiritCols((pal) => {
    const cols = []
    const csChars = [...changshengText(pal)].filter((ch) => ch.trim())
    if (csChars.length) cols.push({ chars: csChars, kind: 'changsheng' })
    cols.push(...nameCols(spiritTexts(pal), 'spirit'))
    return cols
  }, rNatalSpiritMid, half)
})

/** 流年神煞：仅行运有字；本命同半径留空 */
const flowSpiritLabelLines = computed(() => {
  if (!isTransit.value) return []
  const half = (rFlowSpiritOuter - rFlowSpiritInner) / 2
  return layoutSpiritCols(
    (pal) => nameCols(flowSpiritTexts(pal), 'flow'),
    rFlowSpiritMid,
    half
  )
})

const xiuSectors = computed(() => {
  const r0 = rXiuInner
  const r1 = rXiuOuter
  const midR = (r0 + r1) / 2
  return xiuSpansForWheel(props.natal).map((span, i) => {
    const { start, sweep } = tropicalSpanToWheelArc(span.lon0, span.lon1)
    const mid = start + sweep / 2
    return {
      path: annularSectorPath(cx, cy, r0, r1, start, sweep),
      fill: i % 2 === 0 ? '#f4eee4' : '#efe6d8',
      label: polar(cx, cy, midR, mid),
      labelText: sweep < 4 ? '' : (span.labelText || '')
    }
  })
})

function layoutStarPointers(rows, rInner, rMid) {
  const list = rows.filter((row) => row?.star)
  if (!list.length) return []
  const trueDegs = list.map((row) => starWheelDeg(row.star))
  const labelDegs = spreadWheelDegs(trueDegs, 6)
  const glyphInset = 4.5
  return list.map((row, i) => {
    const trueDeg = trueDegs[i]
    const labelDeg = labelDegs[i]
    const tick = polar(cx, cy, rInner, trueDeg)
    const lp = polar(cx, cy, rMid, labelDeg)
    const dx = tick.x - lp.x
    const dy = tick.y - lp.y
    const dist = Math.hypot(dx, dy) || 1
    const inset = Math.min(glyphInset, dist * 0.45)
    const sx = lp.x + (dx / dist) * inset
    const sy = lp.y + (dy / dist) * inset
    return {
      key: row.star.key,
      isFlow: !!row.isFlow,
      label: starNameShort(row.star),
      color: starColor(row.star.key),
      x: tick.x,
      y: tick.y,
      tx: lp.x,
      ty: lp.y,
      lead: `M ${sx.toFixed(2)} ${sy.toFixed(2)} L ${tick.x.toFixed(2)} ${tick.y.toFixed(2)}`
    }
  })
}

const natalPoints = computed(() =>
  layoutStarPointers(
    (props.natal?.stars || []).map((star) => ({ star, isFlow: false })),
    rNatalStarInner,
    rNatalStarMid
  )
)

const flowPoints = computed(() => {
  if (!isTransit.value) return []
  /** 流曜在宿圈内侧，虚线指向外沿（二十八宿内缘） */
  return layoutStarPointers(
    (props.natal?.flow_stars || []).map((star) => ({ star, isFlow: true })),
    rFlowStarOuter.value,
    rFlowStarMid.value
  )
})

/** 中间层分界（星座/十二宫 或 十二宫/流曜） */
const rMidSplit = rMidInner + T_MID

const aspectLines = computed(() => {
  /** 比较盘：from=A 本命星，to=B 叠星（key 可相同，不能共用一张 map） */
  const cross = props.natal?.cross_aspects
  if (Array.isArray(cross) && cross.length) {
    const aDeg = {}
    for (const s of props.natal?.stars || []) {
      aDeg[s.key] = starWheelDeg(s)
    }
    const bDeg = {}
    for (const s of props.natal?.flow_stars || []) {
      bDeg[s.key] = starWheelDeg(s)
    }
    return cross.map((a) => {
      const d1 = aDeg[a.from_star]
      const d2 = bDeg[a.to_star]
      if (d1 == null || d2 == null) return null
      const p1 = polar(cx, cy, rAspect, d1)
      const p2 = polar(cx, cy, rAspect, d2)
      return {
        x1: p1.x,
        y1: p1.y,
        x2: p2.x,
        y2: p2.y,
        color: ASPECT_COLORS[a.type] || '#999',
        width: a.type === 'conjunct' ? 2 : 1.2,
        dash: a.type === 'trine' ? '4 3' : a.type === 'oppose' ? '1 3' : ''
      }
    }).filter(Boolean)
  }

  const aspects = props.showFlow
    ? (props.natal?.flow_aspects || [])
    : (props.natal?.aspects || [])
  const degMap = {}
  if (props.showFlow) {
    for (const s of props.natal?.flow_stars || []) {
      degMap[s.key] = starWheelDeg(s)
    }
  } else {
    for (const s of props.natal?.stars || []) {
      degMap[s.key] = starWheelDeg(s)
    }
  }
  return aspects.map((a) => {
    const d1 = degMap[a.from_star]
    const d2 = degMap[a.to_star]
    if (d1 == null || d2 == null) return null
    const p1 = polar(cx, cy, rAspect, d1)
    const p2 = polar(cx, cy, rAspect, d2)
    return {
      x1: p1.x,
      y1: p1.y,
      x2: p2.x,
      y2: p2.y,
      color: ASPECT_COLORS[a.type] || '#999',
      width: a.type === 'conjunct' ? 2 : 1.2,
      dash: a.type === 'trine' ? '4 3' : a.type === 'oppose' ? '1 3' : ''
    }
  }).filter(Boolean)
})

function selectStar(key) {
  emit('select-star', key)
}
</script>

<style scoped>
.qizheng-wheel {
  --ink: #5c4a32;
  --ink-muted: #8a7a62;
  --ink-ming: #8b5a2b;
  --ink-flow: #4a7a5a;
  --ink-spirit: #7a6548;
  --fs-micro: 5.5px;
  --fs-dense: 8px;
  --fs-body: 10px;
  --fs-emph: 11px;
  --fs-aux: 9px;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
}

.qizheng-wheel svg {
  width: 100%;
  height: auto;
  display: block;
  overflow: visible;
}

.qizheng-wheel svg text {
  font-family: "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif;
  font-weight: 400;
}

.ring-label {
  font-size: var(--fs-body);
  font-weight: 400;
  fill: var(--ink);
  pointer-events: none;
}

.ring-label.sign,
.ring-label.palace,
.ring-label.xiu {
  font-size: var(--fs-body);
  fill: var(--ink);
}

.ring-label.xiu {
  fill: var(--ink-muted);
}

.ring-label.palace.is-ming {
  fill: var(--ink-ming);
  font-weight: 500;
}

.ring-label.spirit {
  font-size: var(--fs-dense);
  fill: var(--ink-spirit);
}

.ring-label.spirit.changsheng {
  fill: var(--ink);
}

.ring-label.spirit.flow {
  fill: var(--ink-flow);
}

.ring-label.dongwei-age {
  font-size: var(--fs-micro);
  fill: var(--ink);
}

.ring-label.dongwei-year {
  font-size: var(--fs-body);
  font-weight: 500;
  fill: var(--ink);
}

.ring-label.star {
  font-size: var(--fs-emph);
}

.ring-label.star.flow {
  font-size: var(--fs-body);
  opacity: 0.85;
}

.ming-xiu {
  font-size: var(--fs-emph);
  font-weight: 400;
  fill: var(--ink);
}

.ming-deg {
  font-size: var(--fs-aux);
  fill: var(--ink-muted);
}

.star-pointer {
  cursor: pointer;
}

.star-pointer.is-active .ring-label.star {
  font-weight: 600;
}

.star-pointer.is-active path {
  opacity: 1;
  stroke-width: 1;
}

.star-pointer.is-flow {
  pointer-events: none;
}

.age-now-pointer {
  pointer-events: none;
}
</style>
