<template>
  <component
    :is="cellComponent"
    v-if="cell"
    :cell="cell"
    :luoshu="luoshu"
    :is-feipan="isFeipan"
    :is-selected="isSelected"
    :zhi-shi="zhiShi"
    @select="$emit('select')"
  />
</template>

<script setup>
import { computed } from 'vue'
import QimenJinhanPalaceCell from './QimenJinhanPalaceCell.vue'
import QimenKuonangPalaceCell from './QimenKuonangPalaceCell.vue'
import QimenStandardPalaceCell from './QimenStandardPalaceCell.vue'

defineEmits(['select'])

const props = defineProps({
  cell: { type: Object, default: null },
  luoshu: { type: Number, default: null },
  isJinhan: { type: Boolean, default: false },
  isFeipan: { type: Boolean, default: false },
  isKuonang: { type: Boolean, default: false },
  isSelected: { type: Boolean, default: false },
  zhiShi: { type: String, default: '' }
})

const cellComponent = computed(() => {
  if (props.isJinhan) return QimenJinhanPalaceCell
  if (props.isKuonang) return QimenKuonangPalaceCell
  return QimenStandardPalaceCell
})
</script>
