<template>
  <section class="xiaoxian-panel">
    <div v-if="rows.length" class="year-list">
      <div
        v-for="(row, i) in rows"
        :key="row.age + '-' + row.year"
        class="year-row"
        :class="{ band: i % 2 === 1 }"
      >
        <span class="cell age">{{ row.age }}{{ $t('qizheng.ageUnit') }}</span>
        <span class="cell year">{{ row.year }}</span>
        <span class="cell ganzhi">{{ row.gan_zhi }}</span>
        <span class="cell lim">{{ $t('qizheng.xiaoXian') }}: {{ row.xiao_xian_label }}</span>
        <span class="cell lim">{{ $t('qizheng.feiXian') }}: {{ row.fei_xian_label }}</span>
        <span class="cell lim">
          <template v-if="row.tong_xian_label">{{ $t('qizheng.tongXian') }}: {{ row.tong_xian_label }}</template>
        </span>
      </div>
    </div>
    <p v-else class="empty">{{ $t('qizheng.xiaoXianEmpty') }}</p>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /** QizhengLimitYearVo[] */
  years: { type: Array, default: () => [] }
})

const rows = computed(() => {
  const list = Array.isArray(props.years) ? [...props.years] : []
  return list
    .filter((r) => r && r.age != null && r.year != null)
    .map((r) => ({
      age: r.age,
      year: r.year,
      gan_zhi: String(r.gan_zhi || '').trim(),
      xiao_xian_label: String(r.xiao_xian_label || '').trim(),
      fei_xian_label: String(r.fei_xian_label || '').trim(),
      tong_xian_label: String(r.tong_xian_label || '').trim()
    }))
    .sort((a, b) => a.age - b.age || a.year - b.year)
})
</script>

<style scoped>
.xiaoxian-panel {
  margin-top: 12px;
}

.year-list {
  border: 1px solid #f0ebe7;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}

.year-row {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 6px;
  align-items: center;
  padding: 10px 10px;
  font-size: 12px;
  color: #5c4a32;
}

.year-row.band {
  background: #fdf2f4;
}

.cell {
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cell.age,
.cell.year,
.cell.ganzhi {
  font-weight: 500;
}

.cell.lim {
  color: #6a5a48;
}

.empty {
  margin: 16px 0;
  text-align: center;
  font-size: 13px;
  color: #b0a090;
}

@media (max-width: 480px) {
  .year-row {
    gap: 4px;
    font-size: 11px;
    padding: 9px 6px;
  }
}
</style>
