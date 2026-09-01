<template>
  <section class="huayao-panel">
    <div class="sub-tabs" role="tablist">
      <button
        type="button"
        role="tab"
        class="sub-tab"
        :class="{ active: view === 'byStar' }"
        :aria-selected="view === 'byStar'"
        @click="view = 'byStar'"
      >
        {{ $t('qizheng.huaYaoByStar') }}
      </button>
      <button
        type="button"
        role="tab"
        class="sub-tab"
        :class="{ active: view === 'byHua' }"
        :aria-selected="view === 'byHua'"
        @click="view = 'byHua'"
      >
        {{ $t('qizheng.huaYaoByHua') }}
      </button>
    </div>

    <!-- 按星体：十一列，上本命 / 下流年 -->
    <div v-if="view === 'byStar'" class="by-star">
      <div class="star-grid natal">
        <div v-for="col in byStarCols" :key="'n-' + col.starKey" class="star-col">
          <div class="star-head">{{ col.starLabel }}</div>
          <div v-for="(lab, i) in col.natalLabels" :key="'nl-' + i" class="star-lab">{{ lab }}</div>
        </div>
      </div>
      <div v-if="hasFlow" class="star-grid flow">
        <div v-for="col in byStarCols" :key="'f-' + col.starKey" class="star-col">
          <div class="star-head flow-head">{{ $t('qizheng.huaYaoFlowPrefix') }}{{ col.starLabel }}</div>
          <div v-for="(lab, i) in col.flowLabels" :key="'fl-' + i" class="star-lab">{{ lab }}</div>
        </div>
      </div>
    </div>

    <!-- 按星曜：列从右往左；行统一为 primary / ten_god / tags（空位占格对齐） -->
    <div
      v-else
      class="by-hua"
      :style="huaGridStyle"
    >
      <div
        v-for="cell in huaCells"
        :key="cell.key"
        class="hua-cell"
        :class="{ band: cell.row % 2 === 0, empty: !cell.it }"
        :style="{ gridColumn: cell.col, gridRow: cell.row }"
      >
        <template v-if="cell.it">
          <span class="hua-label">
            <i v-for="(ch, i) in [...String(cell.it.label || cell.it.key)]" :key="'l' + i">{{ ch }}</i>
          </span>
          <span v-if="pairText(cell.it)" class="hua-pair">
            <i v-for="(ch, i) in [...pairText(cell.it)]" :key="'p' + i">{{ ch }}</i>
          </span>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  /** QizhengHuaYaoGroupVo[] */
  groups: { type: Array, default: () => [] },
  stars: { type: Array, default: () => [] }
})

const view = ref('byHua')

/** 竞品列序：日 月 水 金 火 木 土 计 罗 孛 炁 */
const STAR_ORDER = [
  'sun',
  'moon',
  'mercury',
  'venus',
  'mars',
  'jupiter',
  'saturn',
  'ketu',
  'rahu',
  'yuebei',
  'ziqi'
]

function pairText(it) {
  if (!it) return ''
  const n = String(it.natal_star_label || '').trim()
  const f = String(it.flow_star_label || '').trim()
  if (n && f) return `︵${n}︱${f}︶`
  if (n) return `︵${n}︶`
  return ''
}

/** 按星体：主名+十神+附属；同星同名只留一格（先主名/十神，后附属） */
function groupItemsForStar(g) {
  const list = []
  if (g?.primary) list.push(g.primary)
  if (g?.ten_god) list.push(g.ten_god)
  if (Array.isArray(g?.tags)) list.push(...g.tags)
  return list
}

function pushUniqueLabel(bag, starKey, lab) {
  if (!starKey || !lab) return
  if (!bag[starKey]) bag[starKey] = []
  if (bag[starKey].includes(lab)) return
  bag[starKey].push(lab)
}

/** 行数：主名 + 十神 + 附属（按各组 tags 最长对齐） */
const huaRowCount = computed(() => {
  const groups = props.groups || []
  const maxTags = groups.reduce((m, g) => Math.max(m, (g.tags || []).length), 0)
  return groups.length ? 2 + maxTags : 0
})

const huaGridStyle = computed(() => {
  const n = (props.groups || []).length
  if (!n) return {}
  return {
    gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${huaRowCount.value}, minmax(100px, auto))`
  }
})

/**
 * 按星曜单元格：列自右向左（天禄在右），行=primary→ten_god→tags。
 * 无十神/附属时仍占空格，保证横行对齐。
 */
const huaCells = computed(() => {
  const groups = props.groups || []
  const n = groups.length
  const maxTags = groups.reduce((m, g) => Math.max(m, (g.tags || []).length), 0)
  const cells = []
  groups.forEach((g, gi) => {
    const col = n - gi
    const slots = [g.primary || null, g.ten_god || null]
    for (let i = 0; i < maxTags; i++) slots.push((g.tags || [])[i] || null)
    slots.forEach((it, ri) => {
      cells.push({
        key: `${g.primary?.key || gi}-r${ri}-${it?.key || 'empty'}`,
        it,
        col,
        row: ri + 1
      })
    })
  })
  return cells
})

/** 按星体聚合：含附属；展示时按名去重 */
const flatItemsForStar = computed(() => {
  const out = []
  for (const g of props.groups || []) out.push(...groupItemsForStar(g))
  return out
})

const starMeta = computed(() => {
  const map = {}
  for (const s of props.stars || []) {
    if (s?.key) map[s.key] = s.label || s.key
  }
  for (const it of flatItemsForStar.value) {
    if (it.natal_star && !map[it.natal_star]) {
      map[it.natal_star] = it.natal_star_label || it.natal_star
    }
    if (it.flow_star && !map[it.flow_star]) {
      map[it.flow_star] = it.flow_star_label || it.flow_star
    }
  }
  const fallback = {
    sun: '日',
    moon: '月',
    mercury: '水',
    venus: '金',
    mars: '火',
    jupiter: '木',
    saturn: '土',
    ketu: '计',
    rahu: '罗',
    yuebei: '孛',
    ziqi: '炁'
  }
  for (const k of STAR_ORDER) {
    if (!map[k]) map[k] = fallback[k]
  }
  return map
})

const hasFlow = computed(() =>
  flatItemsForStar.value.some((it) => it.flow_star || it.flow_star_label)
)

const byStarCols = computed(() => {
  const natalBag = {}
  const flowBag = {}
  for (const it of flatItemsForStar.value) {
    const lab = String(it.label || it.key || '').trim()
    if (!lab) continue
    pushUniqueLabel(natalBag, it.natal_star, lab)
    pushUniqueLabel(flowBag, it.flow_star, lab)
  }
  return STAR_ORDER.map((starKey) => ({
    starKey,
    starLabel: starMeta.value[starKey] || starKey,
    natalLabels: natalBag[starKey] || [],
    flowLabels: flowBag[starKey] || []
  }))
})
</script>

<style scoped>
.huayao-panel {
  margin-top: 12px;
}

.sub-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 12px;
  padding: 3px;
  background: #faf8f6;
  border-radius: 10px;
}

.sub-tab {
  flex: 1;
  border: none;
  background: transparent;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 13px;
  font-weight: 500;
  color: #8a7a62;
  cursor: pointer;
}

.sub-tab.active {
  background: #fff;
  color: #8b5a2b;
  box-shadow: 0 1px 3px rgba(139, 115, 85, 0.12);
}

/* —— 按星体 —— */
.by-star {
  overflow-x: auto;
  border: 1px solid #f0ebe7;
  border-radius: 12px;
  background: #fff;
  padding: 10px 6px 14px;
}

.star-grid {
  display: grid;
  grid-template-columns: repeat(11, minmax(2.4em, 1fr));
  gap: 0;
  min-width: 320px;
}

.star-grid.flow {
  margin-top: 14px;
  padding-top: 10px;
  border-top: 1px dashed #eadfce;
}

.star-col {
  text-align: center;
  font-size: 12px;
  line-height: 1.55;
  color: #5c4a32;
}

.star-head {
  font-weight: 600;
  color: #8b5a2b;
  margin-bottom: 6px;
  padding-bottom: 4px;
  border-bottom: 1px solid #f0ebe7;
}

.star-head.flow-head {
  color: #6a7a5a;
  font-size: 11px;
  font-weight: 500;
}

.star-lab {
  padding: 1px 0;
}

/* —— 按星曜：统一行高网格，列自右向左由 gridColumn 指定 —— */
.by-hua {
  display: grid;
  border: 1px solid #f0ebe7;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}

.hua-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  padding: 8px 1px 10px;
  min-height: 100px;
  box-sizing: border-box;
}

.hua-cell.band {
  background: #fdf2f4;
}

.hua-cell.empty {
  pointer-events: none;
}

.hua-label,
.hua-pair {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.15;
}

.hua-label {
  font-size: 13px;
  font-weight: 600;
  color: #3d3228;
}

.hua-pair {
  font-size: 11px;
  font-weight: 400;
  color: #9a8a78;
}

.hua-label i,
.hua-pair i {
  font-style: normal;
  font-weight: inherit;
}
</style>
