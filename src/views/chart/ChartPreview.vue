<template>
  <div class="chart-preview">
    <div class="preview-header">
      <router-link to="/chart" class="back-link">← {{ $t('chart.back') }}</router-link>
      <h2 class="preview-title">{{ isComposite ? $t('chart.composite') : $t('chart.single') }}</h2>
    </div>

    <div class="form-card">
      <!-- 盘类型 -->
      <div class="form-row">
        <label class="form-label">{{ $t('chart.chartType') }}</label>
        <select v-model="chartType" class="form-select">
          <option v-for="opt in chartTypeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>

      <!-- 单盘：出生信息 -->
      <template v-if="!isComposite">
        <div class="form-row">
          <div class="form-item">
            <label class="form-label">{{ $t('chart.birthDate') }}</label>
            <input v-model="birthDate" type="date" class="form-input">
          </div>
          <div class="form-item">
            <label class="form-label">{{ $t('chart.birthTime') }}</label>
            <input v-model="birthTime" type="time" step="1" class="form-input">
          </div>
        </div>
        <div class="form-row">
          <div class="form-item">
            <label class="form-label">{{ $t('chart.latitude') }}</label>
            <input v-model.number="latitude" type="number" step="any" placeholder="如 39.9" class="form-input">
          </div>
          <div class="form-item">
            <label class="form-label">{{ $t('chart.longitude') }}</label>
            <input v-model.number="longitude" type="number" step="any" placeholder="如 116.4" class="form-input">
          </div>
        </div>
        <!-- 单盘下行运/月返/日返需填推运/查询日期 -->
        <div v-if="singleNeedTransitDate" class="form-row transit-row">
          <h4 class="transit-title">{{ $t('chart.transitDate') }}</h4>
          <div class="form-item">
            <label class="form-label">{{ $t('chart.transitDate') }}</label>
            <input v-model="singleTransitDate" type="date" class="form-input">
          </div>
          <div class="form-item">
            <label class="form-label">{{ $t('chart.birthTime') }}</label>
            <input v-model="singleTransitTime" type="time" step="1" class="form-input">
          </div>
        </div>
      </template>

      <!-- 合盘：单人+推运日（三限/次限/法达/小限/日弧）或 两人（+ 可选推运日） -->
      <template v-else>
        <div class="person-section">
          <h4>{{ singlePersonTransit ? $t('chart.birthInfo') : $t('chart.personA') }}</h4>
          <div class="form-row">
            <div class="form-item">
              <label class="form-label">{{ $t('chart.birthDate') }}</label>
              <input v-model="birthDateA" type="date" class="form-input">
            </div>
            <div class="form-item">
              <label class="form-label">{{ $t('chart.birthTime') }}</label>
              <input v-model="birthTimeA" type="time" step="1" class="form-input">
            </div>
          </div>
          <div class="form-row">
            <div class="form-item">
              <label class="form-label">{{ $t('chart.latitude') }}</label>
              <input v-model.number="latitudeA" type="number" step="any" class="form-input">
            </div>
            <div class="form-item">
              <label class="form-label">{{ $t('chart.longitude') }}</label>
              <input v-model.number="longitudeA" type="number" step="any" class="form-input">
            </div>
          </div>
        </div>
        <div v-if="needTwoPersons" class="person-section">
          <h4>{{ $t('chart.personB') }}</h4>
          <div class="form-row">
            <div class="form-item">
              <label class="form-label">{{ $t('chart.birthDate') }}</label>
              <input v-model="birthDateB" type="date" class="form-input">
            </div>
            <div class="form-item">
              <label class="form-label">{{ $t('chart.birthTime') }}</label>
              <input v-model="birthTimeB" type="time" step="1" class="form-input">
            </div>
          </div>
          <div class="form-row">
            <div class="form-item">
              <label class="form-label">{{ $t('chart.latitude') }}</label>
              <input v-model.number="latitudeB" type="number" step="any" class="form-input">
            </div>
            <div class="form-item">
              <label class="form-label">{{ $t('chart.longitude') }}</label>
              <input v-model.number="longitudeB" type="number" step="any" class="form-input">
            </div>
          </div>
        </div>
        <div v-if="needTransitDate" class="form-row transit-row">
          <h4 class="transit-title">{{ $t('chart.transitDate') }}</h4>
          <div class="form-item">
            <label class="form-label">{{ $t('chart.transitDate') }}</label>
            <input v-model="transitDate" type="date" class="form-input">
          </div>
          <div class="form-item">
            <label class="form-label">{{ $t('chart.birthTime') }}</label>
            <input v-model="transitTime" type="time" step="1" class="form-input">
          </div>
        </div>
      </template>

      <div class="form-actions">
        <button type="button" class="btn-submit" :disabled="loading" @click="onSubmit">
          {{ loading ? $t('chart.loading') : $t('chart.submit') }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="status-card">{{ $t('chart.loading') }}</div>
    <div v-else-if="error" class="status-card error">{{ error }}</div>
    <ChartResult v-else-if="result" :result="result" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  SINGLE_CHART_TYPES,
  COMPOSITE_CHART_TYPES,
  getChartConfig,
  TRANSIT_DATE_CHART_TYPES,
  fetchChart
} from '../../services/chart'
import ChartResult from './ChartResult.vue'

const route = useRoute()
const mode = computed(() => route.query.mode || 'single')
const isComposite = computed(() => mode.value === 'composite')

const chartTypeOptions = computed(() =>
  isComposite.value ? COMPOSITE_CHART_TYPES : SINGLE_CHART_TYPES
)
const chartType = ref('')

watch(chartTypeOptions, (opts) => {
  if (opts.length && !chartType.value) chartType.value = opts[0].value
}, { immediate: true })

const chartConfig = computed(() => getChartConfig(chartType.value))
const needTransitDate = computed(() =>
  chartType.value && TRANSIT_DATE_CHART_TYPES.includes(chartType.value)
)
const needTwoPersons = computed(() => {
  const c = chartConfig.value
  return c && (c.schema === 'DoublePointQry' || c.schema === 'DpTransitDateQry')
})
const singlePersonTransit = computed(() => {
  const c = chartConfig.value
  return c && c.schema === 'SpTransitDateQry'
})
// 单盘下行运盘、月返盘、日返盘需要填推运/查询日期（DoublePointQry）
const singleNeedTransitDate = computed(() =>
  !isComposite.value && ['transit', 'lunarReturn', 'solarReturn'].includes(chartType.value)
)

// 单盘
const birthDate = ref('1990-01-01')
const birthTime = ref('12:00:00')
const latitude = ref(39.9042)
const longitude = ref(116.4074)

// 合盘 A / B（或单 person + 推运日）
const birthDateA = ref('1990-01-01')
const birthTimeA = ref('12:00:00')
const latitudeA = ref(39.9042)
const longitudeA = ref(116.4074)
const birthDateB = ref('1995-06-15')
const birthTimeB = ref('12:00:00')
const latitudeB = ref(39.9042)
const longitudeB = ref(116.4074)
const transitDate = ref(new Date().toISOString().slice(0, 10))
const transitTime = ref('12:00:00')
const singleTransitDate = ref(new Date().toISOString().slice(0, 10))
const singleTransitTime = ref('12:00:00')

const loading = ref(false)
const error = ref('')
const result = ref(null)

async function onSubmit() {
  error.value = ''
  result.value = null
  const config = chartConfig.value
  if (!config) {
    error.value = '请选择盘类型'
    return
  }
  if (!isComposite.value) {
    if (!birthDate.value || !birthTime.value) {
      error.value = '请填写出生日期与时间'
      return
    }
    if (latitude.value == null || longitude.value == null) {
      error.value = '请填写经纬度'
      return
    }
    if (singleNeedTransitDate.value && !singleTransitDate.value) {
      error.value = '请填写推运/查询日期'
      return
    }
  } else {
    if (!birthDateA.value || !birthTimeA.value) {
      error.value = '请填写第一人出生日期与时间'
      return
    }
    if (latitudeA.value == null || longitudeA.value == null) {
      error.value = '请填写第一人经纬度'
      return
    }
    if (needTwoPersons.value && (!birthDateB.value || !birthTimeB.value)) {
      error.value = '请填写第二人出生日期与时间'
      return
    }
    if (needTwoPersons.value && (latitudeB.value == null || longitudeB.value == null)) {
      error.value = '请填写第二人经纬度'
      return
    }
    if (needTransitDate.value && !transitDate.value) {
      error.value = '请填写推运日期'
      return
    }
  }

  loading.value = true
  try {
    let default_params = {
      bodies: ["0","1","2","3","4","5","6","7","8","9","m"],
      asteroids: ["I"],
      virtual_bodies: ["10","11"],
      render_mode: 'Default'

    }
    let params
    if (!isComposite.value) {
      params = {
        birthDate: birthDate.value,
        birthTime: birthTime.value,
        latitude: latitude.value,
        longitude: longitude.value
      }
      if (singleNeedTransitDate.value) {
        params.transitDate = singleTransitDate.value
        params.transitTime = singleTransitTime.value
      }
    } else if (singlePersonTransit.value) {
      params = {
        birthDate: birthDateA.value,
        birthTime: birthTimeA.value,
        latitude: latitudeA.value,
        longitude: longitudeA.value,
        transitDate: transitDate.value,
        transitTime: transitTime.value
      }
    } else {
      params = {
        birthDateA: birthDateA.value,
        birthTimeA: birthTimeA.value,
        latitudeA: latitudeA.value,
        longitudeA: longitudeA.value,
        birthDateB: birthDateB.value,
        birthTimeB: birthTimeB.value,
        latitudeB: latitudeB.value,
        longitudeB: longitudeB.value,
        transitDate: transitDate.value,
        transitTime: transitTime.value
      }
    }
    let real_params = { ...default_params, ...params }
    const data = await fetchChart(chartType.value, real_params)
    result.value = data
  } catch (e) {
    error.value = e?.response?.data?.msg || e?.message || '请求失败'
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.chart-preview {
  max-width: 720px;
  margin: 0 auto;
  padding: 16px;
}
.preview-header {
  margin-bottom: 20px;
}
.back-link {
  display: inline-block;
  font-size: 14px;
  color: #667eea;
  text-decoration: none;
  margin-bottom: 8px;
}
.back-link:hover {
  text-decoration: underline;
}
.preview-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}
.form-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid #eee;
}
.form-row {
  display: flex;
  gap: 12px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}
.form-item {
  flex: 1;
  min-width: 140px;
}
.form-item-full {
  min-width: 100%;
}
.form-label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 6px;
}
.form-input,
.form-select {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 14px;
}
.form-select {
  max-width: 280px;
}
.person-section {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}
.person-section:last-of-type {
  border-bottom: 0;
}
.person-section h4 {
  font-size: 14px;
  color: #333;
  margin: 0 0 12px;
}
.form-actions {
  margin-top: 20px;
}
.btn-submit {
  width: 100%;
  padding: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  background: #667eea;
  border: 0;
  border-radius: 10px;
  cursor: pointer;
}
.btn-submit:hover:not(:disabled) {
  background: #5a6fd6;
}
.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.status-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  color: #666;
  margin-bottom: 16px;
}
.status-card.error {
  color: #c62828;
}
.transit-title {
  font-size: 14px;
  color: #333;
  margin: 0 0 8px;
  width: 100%;
}

.transit-row {
  align-items: flex-end;
}
</style>
