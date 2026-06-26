<template>
  <div class="qimen-palace-detail" :class="levelClass">
    <template v-if="luoshu != null">
      <div class="palace-detail-header">
        <span class="palace-detail-label">{{ palaceLabel }}</span>
        <span v-if="geJu?.level_cn" class="palace-detail-level">{{ geJu.level_cn }}</span>
      </div>

      <template v-if="hasContent">
        <h3 v-if="displayTitle" class="palace-detail-title">{{ displayTitle }}</h3>
        <p v-if="geJu.summary" class="palace-detail-summary">{{ geJu.summary }}</p>

        <div v-if="geJu.tags.length" class="palace-detail-tags">
          <span
            v-for="tag in geJu.tags"
            :key="tag"
            class="palace-detail-tag"
          >{{ tag }}</span>
        </div>

        <div v-if="geJu.scenarios.length" class="palace-detail-scenarios">
          <div class="palace-detail-section-label">典型情境</div>
          <p class="palace-detail-scenario-text">
            <template v-for="(s, i) in geJu.scenarios" :key="s">
              <span v-if="i > 0" class="scenario-sep">·</span>{{ s }}
            </template>
          </p>
        </div>

        <div v-if="hasGanRow || geJu.door_hint" class="palace-detail-meta">
          <p v-if="hasGanRow" class="palace-detail-gan">
            <template v-if="geJu.tian_gan">
              <span class="gan-label">天盘</span>
              <QimenGanText :value="geJu.tian_gan" />
            </template>
            <span v-if="geJu.tian_gan && geJu.di_gan" class="gan-sep">·</span>
            <template v-if="geJu.di_gan">
              <span class="gan-label">地盘</span>
              <QimenGanText :value="geJu.di_gan" />
            </template>
          </p>
          <p v-if="geJu.door_hint" class="palace-detail-door-hint">{{ geJu.door_hint }}</p>
        </div>

        <p v-if="geJu.desc" class="palace-detail-desc">{{ geJu.desc }}</p>
      </template>
      <p v-else class="palace-detail-empty">此宫暂无格局解读</p>
    </template>
    <p v-else class="palace-detail-hint">点击上方宫位查看格局解读</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  formatPalaceLabel,
  getPalaceGeJu,
  hasPalaceGeJu
} from '../../composables/useQimen'
import { getGeJuLevelClassFromGeJu } from '../../composables/useQimenColors'
import QimenGanText from './QimenGanText.vue'

const props = defineProps({
  luoshu: { type: Number, default: null },
  cell: { type: Object, default: null }
})

const geJu = computed(() => getPalaceGeJu(props.cell))
const hasContent = computed(() => hasPalaceGeJu(props.cell))
const palaceLabel = computed(() => formatPalaceLabel(props.luoshu, props.cell))
const displayTitle = computed(() => geJu.value?.name || geJu.value?.title || '')
const levelClass = computed(() => getGeJuLevelClassFromGeJu(geJu.value))
const hasGanRow = computed(() => !!(geJu.value?.tian_gan || geJu.value?.di_gan))
</script>
