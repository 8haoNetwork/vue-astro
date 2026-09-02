<template>
  <aside v-if="limits" class="xingxian-panel">
    <h4 class="xingxian-title">{{ $t('qizheng.xingXian') }}</h4>
    <div class="xingxian-row">
      <span class="lab">{{ $t('qizheng.xiaoXian') }}</span>
      <span class="val">{{ limits.xiao_xian_label }}</span>
    </div>
    <div class="xingxian-row">
      <span class="lab">{{ $t('qizheng.yueXian') }}</span>
      <span class="val">{{ limits.yue_xian_label }}</span>
    </div>
    <div class="xingxian-row">
      <span class="lab">{{ $t('qizheng.feiXian') }}</span>
      <span class="val">{{ limits.fei_xian_label }}</span>
    </div>
    <div class="xingxian-row">
      <span class="lab">{{ $t('qizheng.chanRi') }}</span>
      <span class="val">{{ limits.chan_ri_label }}</span>
    </div>
    <div v-if="dingDuText" class="xingxian-row ding">
      <span class="lab">{{ $t('qizheng.dingDu') }}</span>
      <span class="val">{{ dingDuText }}</span>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { formatDegDecimal } from '../../utils/qizhengChart'

const props = defineProps({
  /** QizhengCurrentLimitsVo */
  limits: { type: Object, default: null }
})

/** 顶度：宿内度 + 宫度，如 星2.10° 午1.35° */
const dingDuText = computed(() => {
  const d = props.limits?.ding_du
  if (!d) return ''
  const xiu = `${d.xiu_label || ''}${formatDegDecimal(d.xiu_degree)}`.trim()
  const palace = `${d.earthly_branch_label || ''}${formatDegDecimal(d.palace_degree)}`.trim()
  return [xiu, palace].filter(Boolean).join(' ')
})
</script>

<style scoped>
.xingxian-panel {
  pointer-events: none;
  min-width: 7.5em;
  color: #5c4a32;
  font-size: 13px;
  line-height: 1.55;
}

.xingxian-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 700;
  color: #5c4a32;
}

.xingxian-row {
  display: flex;
  gap: 8px;
  align-items: baseline;
  padding: 1px 0;
}

.xingxian-row.ding {
  flex-wrap: wrap;
}

.lab {
  flex-shrink: 0;
  color: #8a7a62;
}

.val {
  color: #5c4a32;
  font-weight: 500;
}
</style>
