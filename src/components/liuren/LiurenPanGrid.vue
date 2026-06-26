<template>
  <div class="liuren-pan-board">
    <div class="pan-board-head">
      <h3 class="liuren-section-title">天地盘</h3>
      <p v-if="headline" class="pan-board-headline">{{ headline }}</p>
    </div>

    <div class="pan-shell">
      <span class="pan-compass pan-compass--s">南</span>
      <div class="pan-shell-row">
        <span class="pan-compass pan-compass--e">东</span>
        <div class="liuren-pan-grid">
          <LiurenPanCell
            v-for="slot in BRANCH_SLOTS"
            :key="slot.area"
            :style="{ gridArea: slot.area }"
            :cell="cellMap[slot.branch]"
            :selected="isSelected(slot.branch)"
            @select="onCellSelect"
          />
          <div class="pan-center-void" aria-hidden="true" />
        </div>
        <span class="pan-compass pan-compass--w">西</span>
      </div>
      <span class="pan-compass pan-compass--n">北</span>
    </div>

    <LiurenDetailPanel
      v-if="selection?.kind === 'palace'"
      class="liuren-inline-detail"
      :data="data"
      :selection="selection"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getLiurenPanCell, isLiurenSelectionActive } from '../../composables/useLiuren'
import LiurenPanCell from './LiurenPanCell.vue'
import LiurenDetailPanel from './LiurenDetailPanel.vue'

const BRANCH_SLOTS = [
  { area: 'si', branch: '巳' },
  { area: 'wu', branch: '午' },
  { area: 'wei', branch: '未' },
  { area: 'shen', branch: '申' },
  { area: 'chen', branch: '辰' },
  { area: 'you', branch: '酉' },
  { area: 'mao', branch: '卯' },
  { area: 'xu', branch: '戌' },
  { area: 'yin', branch: '寅' },
  { area: 'chou', branch: '丑' },
  { area: 'zi', branch: '子' },
  { area: 'hai', branch: '亥' }
]

const props = defineProps({
  data: { type: Object, default: null },
  selection: { type: Object, default: null }
})

const emit = defineEmits(['select'])

const cellMap = computed(() => {
  const map = {}
  if (!props.data) return map
  for (const { branch } of BRANCH_SLOTS) {
    map[branch] = getLiurenPanCell(props.data, branch)
  }
  return map
})

const headline = computed(() => {
  if (!props.data) return ''
  const parts = []
  if (props.data.yue_jiang_name) {
    parts.push(`月将 ${props.data.yue_jiang_name}（${props.data.yue_jiang}）`)
  }
  if (props.data.shi) {
    parts.push(`占时 ${props.data.shi}`)
  }
  if (props.data.di_fen) {
    parts.push(`地分 ${props.data.di_fen}`)
  }
  return parts.join(' · ')
})

function isSelected(branch) {
  return isLiurenSelectionActive(props.selection, 'palace', branch)
}

function onCellSelect(branch) {
  emit('select', { kind: 'palace', key: branch })
}
</script>
