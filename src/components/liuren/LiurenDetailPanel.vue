<template>
  <div ref="rootEl" class="liuren-detail-panel" :class="levelClass">
    <div class="palace-detail-header">
      <span class="palace-detail-label">{{ selectionLabel }}</span>
      <span v-if="interpret?.level_cn" class="palace-detail-level">{{ interpret.level_cn }}</span>
    </div>

    <template v-if="hasContent">
      <h3 v-if="displayTitle" class="palace-detail-title">{{ displayTitle }}</h3>
      <p v-if="interpret.summary" class="palace-detail-summary">{{ interpret.summary }}</p>

      <div v-if="interpret.tags.length" class="palace-detail-tags">
        <span
          v-for="tag in interpret.tags"
          :key="tag"
          class="palace-detail-tag"
        >{{ tag }}</span>
      </div>

      <div v-if="interpret.scenarios.length" class="palace-detail-scenarios">
        <div class="palace-detail-section-label">典型情境</div>
        <p class="palace-detail-scenario-text">
          <template v-for="(s, i) in interpret.scenarios" :key="s">
            <span v-if="i > 0" class="scenario-sep">·</span>{{ s }}
          </template>
        </p>
      </div>

      <div v-if="interpret.meta_lines.length" class="palace-detail-meta">
        <p
          v-for="line in interpret.meta_lines"
          :key="line"
          class="palace-detail-meta-line"
        >{{ line }}</p>
      </div>

      <p v-if="interpret.desc" class="palace-detail-desc">{{ interpret.desc }}</p>
    </template>
    <p v-else class="palace-detail-empty">暂无解读文案</p>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import {
  hasLiurenInterpret,
  resolveLiurenInterpret,
  resolveLiurenSelectionLabel
} from '../../composables/useLiuren'
import { getGeJuLevelClassFromGeJu } from '../../composables/useQimenColors'

const props = defineProps({
  data: { type: Object, default: null },
  selection: { type: Object, required: true }
})

const rootEl = ref(null)

const interpret = computed(() => resolveLiurenInterpret(props.data, props.selection))
const hasContent = computed(() => hasLiurenInterpret(interpret.value))
const selectionLabel = computed(() => resolveLiurenSelectionLabel(props.data, props.selection))
const displayTitle = computed(() => interpret.value?.title || interpret.value?.name || '')
const levelClass = computed(() => getGeJuLevelClassFromGeJu(interpret.value))

watch(
  () => props.selection,
  async (sel) => {
    if (!sel) return
    await nextTick()
    rootEl.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  },
  { immediate: true }
)
</script>
