<template>
  <div class="qimen-board">
    <div class="qimen-grid">
      <QimenPalaceCell
        v-for="luoshu in flatLuoshu"
        :key="luoshu"
        :luoshu="luoshu"
        :cell="getPalaceCell(data, luoshu)"
        :is-jinhan="isJinhan"
        :is-feipan="isFeipan"
        :is-kuonang="isKuonang"
        :is-selected="selectedLuoshu === luoshu"
        :zhi-shi="data.zhi_shi || ''"
        @select="onPalaceSelect(luoshu)"
      />
    </div>

    <QimenHuangHeiDaoPanel v-if="showHuangHeiDao" :data="data" />

    <QimenPalaceDetail
      :luoshu="selectedLuoshu"
      :cell="selectedCell"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import {
  LUOSHU_GRID,
  getPalaceCell,
  isJinhanResult,
  isFeipanResult,
  isKuonangFeipan,
  normalizeHuangHeiDao
} from '../../composables/useQimen'
import QimenPalaceCell from './QimenPalaceCell.vue'
import QimenHuangHeiDaoPanel from './QimenHuangHeiDaoPanel.vue'
import QimenPalaceDetail from './QimenPalaceDetail.vue'

const props = defineProps({
  data: { type: Object, required: true }
})

const flatLuoshu = LUOSHU_GRID.flat()
const selectedLuoshu = ref(null)

const isJinhan = computed(() => isJinhanResult(props.data))
const isFeipan = computed(() => isFeipanResult(props.data))
const isKuonang = computed(() => isKuonangFeipan(props.data))
const showHuangHeiDao = computed(() => {
  if (!isJinhan.value) return false
  return normalizeHuangHeiDao(props.data).length > 0
})
const selectedCell = computed(() => {
  if (selectedLuoshu.value == null) return null
  return getPalaceCell(props.data, selectedLuoshu.value)
})

watch(() => props.data, () => {
  selectedLuoshu.value = null
})

function onPalaceSelect(luoshu) {
  selectedLuoshu.value = selectedLuoshu.value === luoshu ? null : luoshu
}
</script>

<style scoped>
.qimen-board {
  max-width: 400px;
  margin: 0 auto;
}
</style>
