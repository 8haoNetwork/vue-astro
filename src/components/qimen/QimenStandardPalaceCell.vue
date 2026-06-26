<template>
  <div
    class="qimen-palace-cell qimen-standard-cell"
    :class="{ 'is-feipan': isFeipan, 'is-selected': isSelected }"
    role="button"
    tabindex="0"
    @click="$emit('select')"
    @keydown.enter.prevent="$emit('select')"
  >
    <div v-if="markerItems.length" class="cell-markers">
      <PalaceMarkerBadges :items="markerItems" />
    </div>

    <div class="cell-gong">{{ cell.bagua }}</div>
    <div class="cell-an-gan-col">
      <div v-if="cell.an_gan" class="cell-an-gan">
        <QimenGanText :value="cell.an_gan" />
      </div>
    </div>
    <div class="cell-pos cell-shen" :class="shenClass">{{ cell.ba_shen || '' }}</div>
    <div class="cell-pos cell-jiu-xing" :class="starClass">{{ cell.jiu_xing || '' }}</div>
    <div v-if="shenTrailLabel" class="cell-shen-trail">{{ shenTrailLabel }}</div>
    <div class="cell-pos cell-men-row">
      <span class="cell-men" :class="menClass">{{ cell.ba_men || '' }}</span>
    </div>
    <div class="cell-pos cell-tian-wrap">
      <div class="cell-tian-pan-gan">
        <QimenGanText :value="cell.tian_pan_gan" />
      </div>
      <div v-if="hasTianGanAux" class="cell-gan-aux">
        <span v-if="tianGanAux.changsheng">{{ tianGanAux.changsheng }}</span>
        <span v-if="tianGanAux.wangShuai">{{ tianGanAux.wangShuai }}</span>
      </div>
    </div>
    <div class="cell-pos cell-di-wrap">
      <div class="cell-di-gan">
        <QimenGanText :value="cell.di_pan_gan" />
      </div>
      <div v-if="hasDiGanAux" class="cell-gan-aux">
        <span v-if="diGanAux.changsheng">{{ diGanAux.changsheng }}</span>
        <span v-if="diGanAux.wangShuai">{{ diGanAux.wangShuai }}</span>
      </div>
    </div>

    <div v-if="yingQiLabel" class="cell-ying-qi">{{ yingQiLabel }}</div>
  </div>
</template>

<script setup>
import { toRef } from 'vue'
import { usePalaceCell } from '../../composables/usePalaceCell'
import PalaceMarkerBadges from './PalaceMarkerBadges.vue'
import QimenGanText from './QimenGanText.vue'

defineEmits(['select'])

const props = defineProps({
  cell: { type: Object, required: true },
  luoshu: { type: Number, default: null },
  isFeipan: { type: Boolean, default: false },
  isSelected: { type: Boolean, default: false }
})

const {
  markerItems,
  menClass,
  starClass,
  shenClass,
  yingQiLabel,
  shenTrailLabel,
  tianGanAux,
  diGanAux,
  hasTianGanAux,
  hasDiGanAux
} = usePalaceCell(toRef(props, 'cell'))
</script>
