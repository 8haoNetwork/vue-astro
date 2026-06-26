<template>
  <div v-if="data" class="qimen-meta-panel">
    <div class="meta-digest">
      {{ data.pai_fa?.digest || data.type }}
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
      <span>{{ formatJieQi(data.jie_qi_prev) }} · {{ formatJieQi(data.jie_qi_next) }}</span>
    </div>

    <div v-if="pillarList.length" class="qimen-pillars">
      <div
        v-for="p in pillarList"
        :key="p.key"
        class="qimen-pillar"
      >
        <div class="pillar-gz">
          <QimenGanText :value="pillarStemBranch(p.label)" />
          <span v-if="pillarSuffix(p.label)">{{ pillarSuffix(p.label) }}</span>
        </div>
        <div v-if="p.kong_wang" class="pillar-kw">{{ p.kong_wang }}</div>
      </div>
    </div>

    <div class="qimen-summary-line">
      <span v-if="data.xun_shou">旬首: {{ data.xun_shou }}</span>
      <span v-if="data.zhi_fu">符: {{ data.zhi_fu }}</span>
      <span v-if="data.zhi_shi">使: {{ data.zhi_shi }}</span>
      <span v-if="data.tian_yi">天乙: {{ data.tian_yi }}</span>
      <span v-if="data.ju_display" :class="juDisplayClass">{{ data.ju_display }}</span>
      <span
        v-for="p in specialPatterns"
        :key="p.code"
        class="meta-special-pattern"
        :class="{ 'has-brief': p.brief, 'is-tip-open': openTip === p.code }"
        :title="patternTitle(p)"
        :tabindex="p.brief ? 0 : undefined"
        @click.stop="p.brief && toggleTip(p.code)"
        @keydown.enter.prevent="p.brief && toggleTip(p.code)"
        @blur="onBlur(p.code)"
      >{{ p.name }}
        <span v-if="openTip === p.code && p.brief" class="meta-pattern-tip">{{ p.brief }}</span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import {
  formatJieQi,
  normalizeQimenPillars,
  getQimenSpecialPatterns
} from '../../composables/useQimen'
import { getJuDisplayClass } from '../../composables/useQimenColors'
import QimenGanText from './QimenGanText.vue'

const props = defineProps({
  data: { type: Object, default: null }
})

const openTip = ref(null)

const pillarList = computed(() => normalizeQimenPillars(props.data))
const specialPatterns = computed(() => getQimenSpecialPatterns(props.data))
const juDisplayClass = computed(() => getJuDisplayClass(props.data))

function pillarStemBranch(label) {
  if (!label) return ''
  return String(label).replace(/[年月日时]$/, '')
}

function pillarSuffix(label) {
  if (!label) return ''
  const m = String(label).match(/[年月日时]$/)
  return m ? m[0] : ''
}

function patternTitle(p) {
  if (p.brief && p.name) return `${p.name}：${p.brief}`
  if (p.brief) return p.brief
  return p.name || undefined
}

function toggleTip(code) {
  openTip.value = openTip.value === code ? null : code
}

function onBlur(code) {
  if (openTip.value === code) openTip.value = null
}
</script>
