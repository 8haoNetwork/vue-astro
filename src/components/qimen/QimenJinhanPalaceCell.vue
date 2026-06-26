<template>
  <div
    class="qimen-palace-cell qimen-jinhan-cell"
    :class="{ 'is-selected': isSelected }"
    role="button"
    tabindex="0"
    @click="$emit('select')"
    @keydown.enter.prevent="$emit('select')"
  >
    <div v-if="markerItems.length" class="cell-markers">
      <PalaceMarkerBadges :items="markerItems" />
    </div>

    <div class="cell-gong">{{ cell.gong }}</div>
    <div class="qimen-jinhan-shen" :class="jinhanShenClass">{{ cell.shen_xing || '--' }}</div>
    <div class="qimen-jinhan-men" :class="menClass">{{ cell.ba_men || '--' }}</div>
    <div v-if="shenTrailLabel" class="cell-shen-trail cell-shen-trail--jinhan">
      {{ shenTrailLabel }}
    </div>
    <div v-if="jinhanAuxLines.length" class="cell-jinhan-aux">
      <div v-for="(line, i) in jinhanAuxLines" :key="i" class="cell-aux-line">{{ line }}</div>
    </div>

    <div v-if="yingQiLabel" class="cell-ying-qi">{{ yingQiLabel }}</div>
  </div>
</template>

<script setup>
import { toRef } from 'vue'
import { usePalaceCell } from '../../composables/usePalaceCell'
import PalaceMarkerBadges from './PalaceMarkerBadges.vue'

defineEmits(['select'])

const props = defineProps({
  cell: { type: Object, required: true },
  luoshu: { type: Number, default: null },
  isSelected: { type: Boolean, default: false }
})

const {
  markerItems,
  menClass,
  jinhanShenClass,
  yingQiLabel,
  shenTrailLabel,
  jinhanAuxLines
} = usePalaceCell(toRef(props, 'cell'))
</script>
