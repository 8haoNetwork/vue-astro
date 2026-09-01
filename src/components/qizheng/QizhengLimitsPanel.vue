<template>
  <section v-if="limits || years.length" class="limits">
    <h4 class="section-title">{{ $t('qizheng.currentLimits') }}</h4>
    <div v-if="limits" class="limit-chips">
      <span class="chip">小限 {{ limits.xiao_xian_label }}</span>
      <span class="chip">月限 {{ limits.yue_xian_label }}</span>
      <span class="chip">飞限 {{ limits.fei_xian_label }}</span>
      <span v-if="limits.tong_xian_label" class="chip">童限 {{ limits.tong_xian_label }}</span>
      <span class="chip">
        大限 {{ limits.da_xian_palace_label }}
        {{ limits.da_xian_start_age }}–{{ limits.da_xian_end_age }}岁
      </span>
    </div>

    <h4 v-if="years.length" class="section-title more">{{ $t('qizheng.limitYears') }}</h4>
    <div v-if="years.length" class="table-scroll">
      <table class="year-table">
        <thead>
          <tr>
            <th>虚岁</th>
            <th>年</th>
            <th>干支</th>
            <th>小限</th>
            <th>飞限</th>
            <th>童限</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in years" :key="row.age + '-' + row.year">
            <td>{{ row.age }}</td>
            <td>{{ row.year }}</td>
            <td>{{ row.gan_zhi }}</td>
            <td>{{ row.xiao_xian_label }}</td>
            <td>{{ row.fei_xian_label }}</td>
            <td>{{ row.tong_xian_label || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  natal: { type: Object, default: null }
})

const limits = computed(() => props.natal?.current_limits || null)
const years = computed(() => props.natal?.limit_years || [])
</script>

<style scoped>
.limits {
  margin-top: 16px;
}

.section-title {
  margin: 0 0 8px;
  font-size: 14px;
  color: #5c4a32;
}

.section-title.more {
  margin-top: 14px;
}

.limit-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  background: #faf6ef;
  border: 1px solid #f0ebe7;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  color: #5c4a32;
}

.table-scroll {
  overflow-x: auto;
}

.year-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.year-table th,
.year-table td {
  padding: 8px 6px;
  text-align: left;
  border-bottom: 1px solid #f0ebe7;
}

.year-table th {
  color: #8a7a62;
  font-weight: 500;
}
</style>
