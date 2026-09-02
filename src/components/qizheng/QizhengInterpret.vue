<template>
  <section class="interpret">
    <template v-if="hasReading">
      <h4 class="section-title">{{ $t('qizheng.readingSummary') }}</h4>
      <div v-if="summary" class="corpus-item summary">
        <p class="corpus-content">{{ summary }}</p>
      </div>
      <p v-else class="empty">{{ $t('qizheng.noInterp') }}</p>

      <h4 class="section-title more">{{ $t('qizheng.readingHighlights') }}</h4>
      <div v-if="highlights.length" class="corpus-list">
        <article
          v-for="item in highlights"
          :key="'h-' + item.kind + '-' + item.key"
          class="corpus-item"
        >
          <div class="corpus-header">
            <span
              v-if="item.tone === 'lucky' || item.tone === 'warning'"
              class="tone"
              :class="item.tone"
            >{{ toneLabel(item.tone) }}</span>
            <span class="corpus-title">{{ item.title || item.key }}</span>
          </div>
          <p class="corpus-content">{{ item.body }}</p>
        </article>
      </div>
      <p v-else class="empty">{{ $t('qizheng.noInterp') }}</p>

      <template v-if="timing">
        <h4 class="section-title more">{{ timing.title || $t('qizheng.readingTiming') }}</h4>
        <div v-if="timing.body" class="corpus-item summary">
          <p class="corpus-content">{{ timing.body }}</p>
        </div>
        <div v-if="timingItems.length" class="corpus-list sub-list">
          <article
            v-for="item in timingItems"
            :key="'t-' + item.kind + '-' + item.key"
            class="corpus-item"
          >
            <div class="corpus-header">
              <span class="corpus-title">{{ item.title || item.key }}</span>
            </div>
            <p class="corpus-content">{{ item.body }}</p>
          </article>
        </div>
      </template>

      <template v-if="relation">
        <h4 class="section-title more">{{ relation.title || $t('qizheng.readingRelation') }}</h4>
        <div v-if="relation.body" class="corpus-item summary">
          <p class="corpus-content">{{ relation.body }}</p>
        </div>
        <div v-if="relationItems.length" class="corpus-list sub-list">
          <article
            v-for="item in relationItems"
            :key="'r-' + item.kind + '-' + item.key"
            class="corpus-item"
          >
            <div class="corpus-header">
              <span
                v-if="item.tone === 'lucky' || item.tone === 'warning'"
                class="tone"
                :class="item.tone"
              >{{ toneLabel(item.tone) }}</span>
              <span class="corpus-title">{{ item.title || item.key }}</span>
            </div>
            <p class="corpus-content">{{ item.body }}</p>
          </article>
        </div>
      </template>
    </template>
    <p v-else class="empty">{{ $t('qizheng.noInterp') }}</p>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  /** NatalVo / ChartVo / ComparisonVo：读 natal.reading */
  natal: { type: Object, default: null }
})

const { t } = useI18n()

const reading = computed(() => props.natal?.reading || null)

const hasReading = computed(() => {
  const r = reading.value
  if (!r) return false
  return Boolean(
    r.summary ||
      (r.highlights || []).length ||
      r.timing ||
      r.relation
  )
})

const summary = computed(() => String(reading.value?.summary || '').trim())

const highlights = computed(() =>
  (reading.value?.highlights || []).filter((h) => h && String(h.body || '').trim())
)

const timing = computed(() => reading.value?.timing || null)

const timingItems = computed(() =>
  (timing.value?.items || []).filter((h) => h && String(h.body || '').trim())
)

const relation = computed(() => reading.value?.relation || null)

const relationItems = computed(() =>
  (relation.value?.items || []).filter((h) => h && String(h.body || '').trim())
)

function toneLabel(tone) {
  if (tone === 'warning') return t('qizheng.patternWarning')
  if (tone === 'lucky') return t('qizheng.patternLucky')
  return ''
}
</script>

<style scoped>
.interpret {
  margin-top: 18px;
}

.section-title {
  margin: 0 0 10px;
  font-size: 14px;
  color: #5c4a32;
}

.section-title.more {
  margin-top: 18px;
}

.corpus-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sub-list {
  margin-top: 8px;
}

.corpus-item {
  background: #faf8f6;
  border-radius: 10px;
  padding: 10px 12px;
}

.corpus-item.summary {
  margin-bottom: 0;
}

.corpus-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.corpus-title {
  font-size: 13px;
  font-weight: 600;
  color: #5c4a32;
}

.corpus-content {
  margin: 0;
  font-size: 13px;
  line-height: 1.65;
  color: #666;
  white-space: pre-wrap;
}

.tone {
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 8px;
  flex-shrink: 0;
}

.tone.lucky {
  background: #eef5e8;
  color: #5a8a4a;
}

.tone.warning {
  background: #f8ecec;
  color: #c45c4a;
}

.empty {
  margin: 0;
  font-size: 13px;
  color: #999;
}
</style>
