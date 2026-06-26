<template>
  <div class="palace-marker-badges">
    <div v-if="symbolItems.length" class="marker-row marker-row--symbols">
      <span
        v-for="(m, i) in symbolItems"
        :key="m.code || `sym-${i}`"
        class="marker-badge"
        :class="[
          'marker-' + m.kind,
          { 'is-tip-open': openTip === m.code, 'has-brief': m.brief }
        ]"
        :title="markerTitle(m)"
        :tabindex="m.brief ? 0 : undefined"
        @click.stop="m.brief && toggleTip(m.code)"
        @keydown.enter.prevent="m.brief && toggleTip(m.code)"
        @blur="onBlur(m.code)"
      >
        {{ markerText(m) }}
        <span v-if="openTip === m.code && m.brief" class="marker-tip">{{ m.brief }}</span>
      </span>
    </div>
    <div v-if="harmItems.length" class="marker-row marker-row--harms">
      <span
        v-for="(m, i) in harmItems"
        :key="m.code || `harm-${i}`"
        class="marker-badge"
        :class="[
          'marker-harm',
          { 'is-tip-open': openTip === m.code, 'has-brief': m.brief }
        ]"
        :title="markerTitle(m)"
        :tabindex="m.brief ? 0 : undefined"
        @click.stop="m.brief && toggleTip(m.code)"
        @keydown.enter.prevent="m.brief && toggleTip(m.code)"
        @blur="onBlur(m.code)"
      >
        {{ markerText(m) }}
        <span v-if="openTip === m.code && m.brief" class="marker-tip">{{ m.brief }}</span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] }
})

const openTip = ref(null)

const symbolItems = computed(() =>
  props.items.filter(m => m.kind === 'kong' || m.kind === 'ma')
)
const harmItems = computed(() =>
  props.items.filter(m => m.kind === 'harm')
)

function markerText(m) {
  if (m.kind === 'kong' || m.kind === 'ma') return m.symbol
  return m.label
}

function markerTitle(m) {
  if (m.brief && m.name) return `${m.name}：${m.brief}`
  if (m.brief) return m.brief
  if (m.name) return m.name
  return undefined
}

function toggleTip(code) {
  openTip.value = openTip.value === code ? null : code
}

function onBlur(code) {
  if (openTip.value === code) openTip.value = null
}
</script>
