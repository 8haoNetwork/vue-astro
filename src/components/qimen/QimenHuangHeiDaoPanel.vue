<template>
  <div v-if="items.length" class="qimen-huang-hei-panel">
    <div class="huang-hei-header">
      <span class="huang-hei-title">黄黑道</span>
      <span class="huang-hei-legend">
        <span class="legend-dot legend-dot--huang" />黄道
        <span class="legend-dot legend-dot--hei" />黑道
      </span>
    </div>

    <div class="huang-hei-grid">
      <button
        v-for="item in items"
        :key="item.god_code || item.hour_branch"
        type="button"
        class="huang-hei-cell"
        :class="{
          'is-huang': item.isHuang,
          'is-hei': !item.isHuang,
          'is-current': item.hour_branch === currentBranch,
          'is-active': activeCode === item.god_code
        }"
        :title="cellTitle(item)"
        @click="toggleActive(item)"
      >
        <span class="huang-hei-hour">{{ item.hour_label }}</span>
        <span class="huang-hei-god">{{ item.god_name }}</span>
        <span v-if="item.dao_label" class="huang-hei-dao-tag">{{ item.dao_label }}</span>
      </button>
    </div>

    <p v-if="activeBrief" class="huang-hei-brief">{{ activeBrief }}</p>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import {
  getQueryHourBranch,
  normalizeHuangHeiDao
} from '../../composables/useQimen'

const props = defineProps({
  data: { type: Object, default: null }
})

const activeCode = ref(null)

const items = computed(() => normalizeHuangHeiDao(props.data))
const currentBranch = computed(() => getQueryHourBranch(props.data))

const activeItem = computed(() => {
  if (!activeCode.value) return null
  return items.value.find(item => item.god_code === activeCode.value) || null
})

const activeBrief = computed(() => {
  const item = activeItem.value
  if (!item?.brief) return ''
  const head = [item.hour_label, item.god_name, item.dao_label].filter(Boolean).join(' · ')
  return head ? `${head}\n${item.brief}` : item.brief
})

watch(
  () => [props.data, items.value, currentBranch.value],
  () => {
    activeCode.value = null
    if (!items.value.length) return
    const current = items.value.find(item => item.hour_branch === currentBranch.value)
    if (current?.brief) activeCode.value = current.god_code
  },
  { immediate: true }
)

function cellTitle(item) {
  if (!item.brief) {
    return [item.hour_label, item.god_name, item.dao_label].filter(Boolean).join(' · ')
  }
  return [item.hour_label, item.god_name, item.dao_label, item.brief].filter(Boolean).join(' · ')
}

function toggleActive(item) {
  if (!item.brief) return
  activeCode.value = activeCode.value === item.god_code ? null : item.god_code
}
</script>
