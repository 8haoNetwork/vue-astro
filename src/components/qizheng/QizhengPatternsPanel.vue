<template>
  <section class="patterns-panel">
    <div class="patterns-card">
      <div class="patterns-block">
        <h4 class="patterns-title">{{ $t('qizheng.patternLucky') }}</h4>
        <div v-if="lucky.length" class="patterns-tags">
          <span v-for="p in lucky" :key="p.key" class="pattern-tag">{{ p.name || p.key }}</span>
        </div>
        <p v-else class="patterns-empty">{{ $t('qizheng.patternEmpty') }}</p>
      </div>

      <div class="patterns-divider" />

      <div class="patterns-block">
        <h4 class="patterns-title">{{ $t('qizheng.patternWarning') }}</h4>
        <div v-if="warning.length" class="patterns-tags">
          <span v-for="p in warning" :key="p.key" class="pattern-tag">{{ p.name || p.key }}</span>
        </div>
        <p v-else class="patterns-empty">{{ $t('qizheng.patternEmpty') }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /** QizhengPatternVo[]：key / type(lucky|warning) / name */
  patterns: { type: Array, default: () => [] }
})

const lucky = computed(() =>
  (props.patterns || []).filter((p) => p?.type === 'lucky')
)

const warning = computed(() =>
  (props.patterns || []).filter((p) => p?.type === 'warning')
)
</script>

<style scoped>
.patterns-panel {
  margin-top: 12px;
}

.patterns-card {
  border: 1px solid #f0ebe7;
  border-radius: 12px;
  background: #fff;
  padding: 16px 14px 18px;
}

.patterns-block {
  text-align: center;
}

.patterns-title {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: #c4788a;
}

.patterns-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px 16px;
}

.pattern-tag {
  font-size: 13px;
  color: #5c4a32;
  line-height: 1.4;
}

.patterns-empty {
  margin: 0;
  font-size: 12px;
  color: #b0a090;
}

.patterns-divider {
  height: 1px;
  margin: 16px 8px;
  background: #f0ebe7;
}
</style>
