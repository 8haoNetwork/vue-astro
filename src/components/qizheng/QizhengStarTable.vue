<template>
  <section class="star-table-wrap">
    <h4 v-if="title" class="table-title">{{ title }}</h4>
    <div class="table-scroll">
      <table class="star-table">
        <thead>
          <tr>
            <th>{{ $t('qizheng.colStar') }}</th>
            <th>{{ $t('qizheng.colXiuDeg') }}</th>
            <th>{{ $t('qizheng.colPalaceDeg') }}</th>
            <th>{{ $t('qizheng.colDignity') }}</th>
            <th>{{ $t('qizheng.colStatus') }}</th>
            <th>{{ $t('qizheng.colHuaYao') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="s in stars"
            :key="s.key"
            :class="{ 'is-active': selectedKey === s.key }"
            @click="$emit('select-star', s.key)"
          >
            <td>
              <span class="star-dot" :style="{ background: starColor(s.key) }" />
              {{ s.label }}
            </td>
            <td>{{ xiuText(s) }}</td>
            <td>{{ palaceText(s) }}</td>
            <td>{{ dignityText(s) }}</td>
            <td>{{ statusText(s) }}</td>
            <td>{{ huaYaoText(s) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import {
  formatDegDecimal,
  formatPalaceDegreeDecimal,
  palaceByIndex,
  starColor,
  xiuDisplayByKey
} from '../../utils/qizhengChart'

const props = defineProps({
  stars: { type: Array, default: () => [] },
  palaces: { type: Array, default: () => [] },
  xiuSpans: { type: Array, default: () => [] },
  title: { type: String, default: '' },
  selectedKey: { type: String, default: '' },
  /** natal：只标逆；flow：标除顺以外的状态 */
  variant: { type: String, default: 'natal' }
})

defineEmits(['select-star'])

function xiuText(s) {
  const x = s.xiu_degree
  if (!x) return ''
  const name = xiuDisplayByKey(props.xiuSpans, x.xiu)
  const deg = formatDegDecimal(x.degree)
  return `${name} ${deg}`.trim()
}

function palaceText(s) {
  const branch = palaceByIndex(props.palaces, s.palace_index)?.earthly_branch_label
  return formatPalaceDegreeDecimal(branch, s.palace_degree) || ''
}

function dignityText(s) {
  return String(s.dignity_label || '').trim()
}

function statusText(s) {
  const keys = Array.isArray(s.statuses) ? s.statuses : []
  const labels = Array.isArray(s.status_labels) ? s.status_labels : []
  if (props.variant === 'flow') {
    /** 行运：顺不标，其余（逆/速/迟/伏/留）照常 */
    const shown = []
    for (let i = 0; i < Math.max(keys.length, labels.length); i++) {
      const key = keys[i]
      const lab = String(labels[i] || '').trim()
      if (key === 'direct' || lab === '顺' || lab === '順') continue
      if (lab) shown.push(lab)
    }
    return shown.join('')
  }
  /** 本命：只标逆 */
  for (let i = 0; i < Math.max(keys.length, labels.length); i++) {
    const key = keys[i]
    const lab = String(labels[i] || '').trim()
    if (key === 'retro' || lab === '逆') return lab || '逆'
  }
  return ''
}

/** 化曜：主名 + 十神别名，如 天刑煞 */
function huaYaoText(s) {
  const hua = String(s.hua_yao_label || '').trim()
  const god = String(s.ten_god_label || '').trim()
  if (hua && god) return `${hua}${god}`
  return hua || god
}
</script>

<style scoped>
.star-table-wrap {
  margin-top: 16px;
}

.table-title {
  margin: 0 0 8px;
  font-size: 14px;
  color: #5c4a32;
}

.table-scroll {
  overflow-x: auto;
}

.star-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  min-width: 480px;
}

.star-table th,
.star-table td {
  padding: 8px 6px;
  text-align: left;
  border-bottom: 1px solid #f0ebe7;
  white-space: nowrap;
}

.star-table th {
  color: #8a7a62;
  font-weight: 500;
}

.star-table tbody tr {
  cursor: pointer;
}

.star-table tbody tr:hover,
.star-table tbody tr.is-active {
  background: #faf6ef;
}

.star-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 4px;
  vertical-align: middle;
}
</style>
