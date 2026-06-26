<template>
  <div
    class="qimen-palace-cell qimen-kuonang-cell"
    :class="{ 'is-selected': isSelected }"
    role="button"
    tabindex="0"
    @click="$emit('select')"
    @keydown.enter.prevent="$emit('select')"
  >
    <div v-if="markerItems.length" class="cell-markers kuonang-markers">
      <PalaceMarkerBadges :items="markerItems" />
    </div>

    <span v-if="cell.bagua" class="cell-gong">{{ cell.bagua }}</span>

    <div class="kuonang-left-top">
      <div
        v-for="(g, i) in anGanDisplayLayers"
        :key="'gan-' + i"
        class="kuonang-an-gan"
      >
        <QimenGanText :value="g" />
      </div>
    </div>

    <div class="kuonang-shen-block kuonang-col-center kuonang-r2">
      <div class="cell-shen" :class="shenClass">{{ cell.ba_shen || '' }}</div>
      <div v-if="shenTrailLabel" class="kuonang-shen-trail">{{ shenTrailLabel }}</div>
    </div>
    <div class="cell-jiu-xing kuonang-col-center kuonang-r3" :class="starClass">
      {{ cell.jiu_xing || '' }}
    </div>
    <div
      class="cell-men kuonang-col-center kuonang-r4"
      :class="[menClass, { 'men-zhishi': isZhishiMen }]"
    >{{ cell.ba_men || '' }}</div>

    <div class="cell-tian-wrap kuonang-col-right kuonang-r3">
      <div class="cell-tian-pan-gan">
        <QimenGanText :value="cell.tian_pan_gan" />
      </div>
      <div v-if="hasTianGanAux" class="cell-gan-aux">
        <span v-if="tianGanAux.changsheng">{{ tianGanAux.changsheng }}</span>
        <span v-if="tianGanAux.wangShuai">{{ tianGanAux.wangShuai }}</span>
      </div>
    </div>
    <div class="cell-di-wrap kuonang-col-right kuonang-r4">
      <div class="cell-di-gan">
        <QimenGanText :value="cell.di_pan_gan" />
      </div>
      <div v-if="hasDiGanAux" class="cell-gan-aux">
        <span v-if="diGanAux.changsheng">{{ diGanAux.changsheng }}</span>
        <span v-if="diGanAux.wangShuai">{{ diGanAux.wangShuai }}</span>
      </div>
    </div>

    <div v-if="menTrailLabel" class="kuonang-men-trail kuonang-r4">{{ menTrailLabel }}</div>

    <div v-if="yingQiLabel" class="cell-ying-qi">{{ yingQiLabel }}</div>
  </div>
</template>

<script setup>
import { toRef } from 'vue'
import { usePalaceCell } from '../../composables/usePalaceCell'
import PalaceMarkerBadges from './PalaceMarkerBadges.vue'
import QimenGanText from './QimenGanText.vue'
import '../../assets/styles/qimen-kuonang.css'

defineEmits(['select'])

const props = defineProps({
  cell: { type: Object, required: true },
  luoshu: { type: Number, default: null },
  isSelected: { type: Boolean, default: false },
  zhiShi: { type: String, default: '' }
})

const {
  markerItems,
  menClass,
  starClass,
  shenClass,
  yingQiLabel,
  shenTrailLabel,
  menTrailLabel,
  anGanDisplayLayers,
  isZhishiMen,
  tianGanAux,
  diGanAux,
  hasTianGanAux,
  hasDiGanAux
} = usePalaceCell(toRef(props, 'cell'), {
  zhiShi: toRef(props, 'zhiShi')
})
</script>
