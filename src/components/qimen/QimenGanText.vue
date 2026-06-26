<template>
  <span class="qm-gan-text">
    <span
      v-for="(item, i) in chars"
      :key="i"
      :class="item.class"
    >{{ item.ch }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { splitGanColoredChars } from '../../composables/useQimenColors'

const props = defineProps({
  value: { type: [String, Array], default: '' }
})

const chars = computed(() => {
  const raw = Array.isArray(props.value)
    ? props.value.map(s => String(s ?? '').trim()).filter(Boolean).join('')
    : props.value
  return splitGanColoredChars(raw)
})
</script>
