<template>
  <div v-if="data" class="liuren-meta-panel">
    <div class="meta-digest">
      {{ data.type }} · {{ data.gui_method }}
    </div>

    <div class="meta-row">
      <span>公历：{{ data.input_time || '--' }}</span>
    </div>
    <div v-if="data.true_solar_time" class="meta-row">
      <span>真太阳：{{ data.true_solar_time }}</span>
    </div>
    <div class="meta-row">
      <span>农历：{{ data.lunar || '--' }}</span>
      <span v-if="data.weekday_cn"> · {{ data.weekday_cn }}</span>
    </div>
    <div class="meta-row">
      <span>节气：{{ data.solar_term || '--' }}</span>
    </div>
    <div class="meta-row">
      <span>{{ formatJieQi(data.jie_qi_prev) }} · {{ formatJieQi(data.jie_qi_next) }}</span>
    </div>

    <div class="meta-tags">
      <span class="meta-tag meta-tag--static">月将 {{ data.yue_jiang_name }}（{{ data.yue_jiang }}）</span>
      <span class="meta-tag meta-tag--static">占时 {{ data.shi }}</span>
      <span v-if="data.di_fen" class="meta-tag meta-tag--static">地分 {{ data.di_fen }}</span>
      <span v-if="data.ri_ma" class="meta-tag meta-tag--static">日马 {{ data.ri_ma }}</span>
      <button
        v-for="g in geJuItems"
        :key="g.name"
        type="button"
        class="meta-tag meta-tag--clickable"
        :class="{ 'is-selected': isSelected('geju', g.name) }"
        @click="emitSelect('geju', g.name)"
      >
        {{ g.name }}
      </button>
    </div>

    <LiurenDetailPanel
      v-if="selection?.kind === 'geju'"
      class="liuren-inline-detail"
      :data="data"
      :selection="selection"
    />

    <div v-if="pillarList.length" class="liuren-pillars">
      <div v-for="p in pillarList" :key="p.key" class="liuren-pillar">
        <div class="pillar-gz">
          <QimenGanText :value="pillarStemBranch(p.label)" />
          <span v-if="pillarSuffix(p.label)">{{ pillarSuffix(p.label) }}</span>
        </div>
        <div v-if="p.kong_wang" class="pillar-kw">{{ p.kong_wang }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  formatJieQi,
  getGeJuDetailList,
  isLiurenSelectionActive,
  normalizeLiurenPillars,
  pillarStemBranch,
  pillarSuffix
} from '../../composables/useLiuren'
import QimenGanText from '../qimen/QimenGanText.vue'
import LiurenDetailPanel from './LiurenDetailPanel.vue'

const props = defineProps({
  data: { type: Object, default: null },
  selection: { type: Object, default: null }
})

const emit = defineEmits(['select'])

const pillarList = computed(() => normalizeLiurenPillars(props.data))
const geJuItems = computed(() => getGeJuDetailList(props.data))

function isSelected(kind, key) {
  return isLiurenSelectionActive(props.selection, kind, key)
}

function emitSelect(kind, key) {
  emit('select', { kind, key })
}
</script>
