<template>
  <section class="base-panel">
    <div class="base-card">
      <!-- 四柱 + 乾坤 -->
      <div class="section pillars">
        <div class="pillar-grid">
          <div v-for="(p, i) in pillarCols" :key="'p-' + i" class="pillar-col">
            <span class="stem">{{ p.stem }}</span>
            <span class="branch">{{ p.branch }}</span>
          </div>
          <div class="pillar-col gender-col">
            <span class="stem">{{ genderChar }}</span>
            <span class="branch" />
          </div>
        </div>
      </div>

      <div class="divider" />

      <!-- 难仇恩用：度 / 宫 -->
      <div class="section grace">
        <div class="grace-grid">
          <span class="grace-corner" />
          <span v-for="col in graceCols" :key="'h-' + col.key" class="grace-head">{{ col.title }}</span>

          <span class="grace-row-label">{{ $t('qizheng.graceByDegree') }}</span>
          <div v-for="col in graceCols" :key="'d-' + col.key" class="grace-cell">
            <span class="wx">{{ col.degree.wx }}</span>
            <span v-if="col.degree.extra" class="extra">{{ col.degree.extra }}</span>
          </div>

          <span class="grace-row-label">{{ $t('qizheng.graceByPalace') }}</span>
          <div v-for="col in graceCols" :key="'g-' + col.key" class="grace-cell">
            <span class="wx">{{ col.palace.wx }}</span>
            <span v-if="col.palace.extra" class="extra">{{ col.palace.extra }}</span>
          </div>
        </div>
      </div>

      <div class="divider" />

      <!-- 农历 / 生日 / 真太阳时 -->
      <div class="section meta">
        <div class="meta-row">
          <span class="meta-label">{{ $t('qizheng.lunarDate') }}</span>
          <span class="meta-value">{{ lunarText }}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">{{ $t('qizheng.birthday') }}</span>
          <span class="meta-value">{{ natal.birth_dt || '' }}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">{{ $t('qizheng.trueSolarTime') }}</span>
          <span class="meta-value">{{ natal.solar_dt || '' }}</span>
        </div>
      </div>

      <div class="divider" />

      <!-- 节气 -->
      <div class="section jieqi">
        <div class="jieqi-row">
          <span class="meta-label">{{ $t('qizheng.jieQi') }}</span>
          <div class="jieqi-list">
            <span v-for="(j, i) in jieQiItems" :key="'j-' + i" class="jieqi-item">
              {{ j }}
            </span>
            <span v-if="!jieQiItems.length" class="meta-empty" />
          </div>
        </div>
      </div>

      <div class="divider" />

      <!-- 童限 / 出限 -->
      <div class="section tong">
        <div class="meta-row">
          <span class="meta-label">{{ $t('qizheng.tongXian') }}</span>
          <span class="meta-value">{{ tongDuration }}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">{{ $t('qizheng.tongXianEnd') }}</span>
          <span class="meta-value">{{ tongEnd }}</span>
        </div>
      </div>

      <div class="divider" />

      <!-- 立命 / 安身 -->
      <div class="section ming-shen">
        <div class="ms-row">
          <span class="meta-label">{{ $t('qizheng.liMing') }}</span>
          <span class="ms-val">{{ mingPalaceText }}</span>
          <span class="ms-val">{{ mingXiuText }}</span>
        </div>
        <div class="ms-row">
          <span class="meta-label">{{ $t('qizheng.anShen') }}</span>
          <span class="ms-val">{{ shenPalaceText }}</span>
          <span class="ms-val">{{ shenXiuText }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatDegDecimal, xiuDisplayByKey } from '../../utils/qizhengChart'

const props = defineProps({
  /**
   * ChartVo：
   * - basic：四柱/农历/节气/恩用/安身/童限
   * - ming + palaces[0]：立命展示（命度 + 命宫地支）
   */
  natal: { type: Object, default: () => ({}) }
})

const { t } = useI18n()

/** 五行 → 余星短名（金无余） */
const WX_EXTRA = {
  土: '计',
  火: '罗',
  木: '炁',
  水: '孛'
}

const basic = computed(() => props.natal?.basic || null)

function cellOf(wxLabel) {
  const label = String(wxLabel || '').trim()
  return { wx: label, extra: WX_EXTRA[label] || '' }
}

function rowMap(row) {
  if (!row) return { hardship: '', foe: '', grace: '', useful: '' }
  return {
    hardship: row.hardship_label || '',
    foe: row.foe_label || '',
    grace: row.grace_label || '',
    useful: row.useful_label || ''
  }
}

function formatJieQiAt(at) {
  const s = String(at || '').trim()
  const m = s.match(/(\d{2}-\d{2})[ T](\d{2}:\d{2})/)
  return m ? `${m[1]} ${m[2]}` : s
}

function formatExitDate(dateStr) {
  const s = String(dateStr || '').trim()
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return s
  return `${m[1]}年${m[2]}月${m[3]}日`
}

const pillarCols = computed(() => {
  const p = basic.value?.pillars || {}
  return ['year', 'month', 'day', 'hour'].map((k) => {
    const col = p[k] || {}
    return {
      stem: String(col.stem_label || '').trim(),
      branch: String(col.branch_label || '').trim()
    }
  })
})

const genderChar = computed(() => {
  const g = String(props.natal?.gender || '').toLowerCase()
  if (g === 'male' || g === 'm') return t('qizheng.genderQian')
  if (g === 'female' || g === 'f') return t('qizheng.genderKun')
  return ''
})

const graceCols = computed(() => {
  const g = basic.value?.grace || {}
  const degree = rowMap(g.degree)
  const palace = rowMap(g.palace)
  const order = [
    { key: 'hardship', title: t('qizheng.hardship') },
    { key: 'foe', title: t('qizheng.foe') },
    { key: 'grace', title: t('qizheng.grace') },
    { key: 'useful', title: t('qizheng.useful') }
  ]
  return order.map((col) => ({
    ...col,
    degree: cellOf(degree[col.key]),
    palace: cellOf(palace[col.key])
  }))
})

const lunarText = computed(() => {
  const b = basic.value
  if (!b) return ''
  const date = String(b.lunar_date || '').trim()
  if (!date) return ''
  const tag = String(b.day_night_label || '').trim()
  if (tag && !date.includes(tag)) return `${date} (${tag})`
  return date
})

const jieQiItems = computed(() => {
  const list = basic.value?.jie_qi || []
  if (!Array.isArray(list) || !list.length) return []
  return list
    .map((j) => {
      const name = String(j?.name_label || j?.name || '').trim()
      const at = formatJieQiAt(j?.at)
      if (name && at) return `${name}${at}`
      return name || at
    })
    .filter(Boolean)
})

const tongDuration = computed(() => {
  const span = basic.value?.tong_xian_span
  if (!span) return ''
  if (span.label) return String(span.label).trim()
  const parts = []
  if (span.years != null) parts.push(`${span.years}${t('qizheng.unitYear')}`)
  if (span.months != null) parts.push(`${span.months}${t('qizheng.unitMonth')}`)
  if (span.days != null) parts.push(`${span.days}${t('qizheng.unitDay')}`)
  return parts.join(' ')
})

const tongEnd = computed(() => formatExitDate(basic.value?.tong_xian_span?.exit_date))

/** 立命：palaces[0] 地支 + 顶层 ming 宫内度 */
const mingPalaceText = computed(() => {
  const ming = props.natal?.ming
  if (!ming) return ''
  const branch = props.natal?.palaces?.[0]?.earthly_branch_label || ''
  return `${branch}${formatDegDecimal(ming.palace_degree)}`
})

/** 立命宿度：顶层 ming */
const mingXiuText = computed(() => {
  const ming = props.natal?.ming
  if (!ming) return ''
  const xiuLord =
    `${ming.xiu_label || ''}${ming.lord_label || ''}`.trim() ||
    xiuDisplayByKey(props.natal?.xiu_spans, ming.xiu)
  return `${xiuLord}${formatDegDecimal(ming.xiu_degree)}`.trim()
})

/** 安身：仅 basic.shen */
const shenPalaceText = computed(() => {
  const shen = basic.value?.shen
  if (!shen) return ''
  return `${shen.earthly_branch_label || ''}${formatDegDecimal(shen.palace_degree)}`
})

const shenXiuText = computed(() => {
  const shen = basic.value?.shen
  if (!shen) return ''
  // ShenDegreeVo 无 lord_label；用 xiu_spans 拼「鬼金」
  const xiuLord =
    xiuDisplayByKey(props.natal?.xiu_spans, shen.xiu) ||
    String(shen.xiu_label || '').trim()
  return `${xiuLord}${formatDegDecimal(shen.xiu_degree)}`.trim()
})
</script>

<style scoped>
.base-panel {
  margin-top: 12px;
}

.base-card {
  border: 1px solid #f0ebe7;
  border-radius: 12px;
  background: #fff;
  padding: 4px 0;
  color: #5c4a32;
  font-size: 13px;
}

.section {
  padding: 12px 14px;
}

.divider {
  height: 1px;
  margin: 0 12px;
  background: #f0ebe7;
}

.pillar-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 4px;
  text-align: center;
}

.pillar-col {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 2.6em;
}

.stem,
.branch {
  font-size: 15px;
  font-weight: 500;
  line-height: 1.3;
  min-height: 1.3em;
}

.gender-col .stem {
  color: #8b7355;
}

.grace-grid {
  display: grid;
  grid-template-columns: 2.2em repeat(4, minmax(0, 1fr));
  gap: 8px 6px;
  align-items: center;
  text-align: center;
}

.grace-corner {
  min-height: 1em;
}

.grace-head {
  font-size: 13px;
  font-weight: 600;
  color: #8b7355;
}

.grace-row-label {
  font-size: 12px;
  color: #a09080;
}

.grace-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-height: 2.4em;
  justify-content: center;
}

.grace-cell .wx {
  font-size: 14px;
  font-weight: 500;
}

.grace-cell .extra {
  font-size: 12px;
  color: #8a7a62;
}

.meta-row,
.ms-row,
.jieqi-row {
  display: grid;
  grid-template-columns: 4.5em 1fr;
  gap: 8px 12px;
  align-items: baseline;
  padding: 4px 0;
}

.ms-row {
  grid-template-columns: 4.5em 1fr 1fr;
}

.jieqi-row {
  align-items: start;
}

.meta-label {
  color: #a09080;
  font-size: 12px;
}

.meta-value,
.ms-val,
.jieqi-item {
  color: #5c4a32;
  word-break: break-all;
}

.meta-empty {
  min-height: 1.2em;
}

.jieqi-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
}

@media (max-width: 480px) {
  .section {
    padding: 10px 10px;
  }

  .stem,
  .branch {
    font-size: 14px;
  }

  .ms-row {
    grid-template-columns: 3.6em 1fr 1fr;
    gap: 6px 8px;
  }

  .meta-row,
  .jieqi-row {
    grid-template-columns: 3.6em 1fr;
  }
}
</style>
