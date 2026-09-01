<template>
  <section class="interpret">
    <h4 class="section-title">{{ $t('qizheng.basicInterp') }}</h4>
    <div v-if="blocks.length" class="corpus-list">
      <article v-for="b in blocks" :key="b.key" class="corpus-item">
        <div class="corpus-header">
          <span class="corpus-title">{{ b.title }}</span>
        </div>
        <p class="corpus-content">{{ b.body }}</p>
      </article>
    </div>
    <p v-else class="empty">{{ $t('qizheng.noInterp') }}</p>

    <h4 class="section-title more">{{ $t('qizheng.moreInterp') }}</h4>
    <div v-if="patterns.length" class="corpus-list">
      <article v-for="p in patterns" :key="p.key" class="corpus-item">
        <div class="corpus-header">
          <span class="pattern-type" :class="p.type">{{ patternTypeLabel(p.type, t) }}</span>
          <span class="corpus-title">{{ p.name || p.key }}</span>
        </div>
        <p class="corpus-content">{{ p.description || $t('qizheng.noDescription') }}</p>
      </article>
    </div>
    <p v-else class="empty">{{ $t('qizheng.patternPending') }}</p>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { buildBasicInterpretation, patternTypeLabel } from '../../composables/useQizheng'

const props = defineProps({
  natal: { type: Object, default: null }
})

const { t } = useI18n()
const interpLabels = computed(() => ({
  grace: t('qizheng.grace'),
  useful: t('qizheng.useful'),
  foe: t('qizheng.foe'),
  hardship: t('qizheng.hardship'),
  patternLucky: t('qizheng.patternLucky'),
  patternWarning: t('qizheng.patternWarning')
}))
const blocks = computed(() => buildBasicInterpretation(props.natal, interpLabels.value))
const patterns = computed(() => props.natal?.patterns || [])
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

.corpus-item {
  background: #faf8f6;
  border-radius: 10px;
  padding: 10px 12px;
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
}

.pattern-type {
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 8px;
}

.pattern-type.lucky {
  background: #eef5e8;
  color: #5a8a4a;
}

.pattern-type.warning {
  background: #f8ecec;
  color: #c45c4a;
}

.empty {
  margin: 0;
  font-size: 13px;
  color: #999;
}
</style>
