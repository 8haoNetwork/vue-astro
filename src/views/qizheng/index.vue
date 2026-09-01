<template>
  <div class="qizheng-page">
    <h1 class="page-title">{{ $t('qizheng.pageTitle') }}</h1>
    <p class="page-desc">{{ $t('qizheng.pageDesc') }}</p>

    <div class="query-card">
      <div class="mode-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          class="mode-tab"
          :class="{ 'is-active': chartMode === 'natal' }"
          :aria-selected="chartMode === 'natal'"
          @click="switchMode('natal')"
        >
          {{ $t('qizheng.natal') }}
        </button>
        <button
          type="button"
          role="tab"
          class="mode-tab"
          :class="{ 'is-active': chartMode === 'chart' }"
          :aria-selected="chartMode === 'chart'"
          @click="switchMode('chart')"
        >
          {{ $t('qizheng.transit') }}
        </button>
      </div>

      <div class="form-row">
        <div class="form-item">
          <label for="qzBirthDate">{{ $t('qizheng.birthDate') }}</label>
          <input id="qzBirthDate" v-model="birthDate" type="date" required>
        </div>
        <div class="form-item">
          <label for="qzBirthTime">{{ $t('qizheng.birthTime') }}</label>
          <input id="qzBirthTime" v-model="birthTime" type="time" step="1" required>
        </div>
      </div>

      <div class="form-row">
        <div class="form-item">
          <label for="qzGender">{{ $t('qizheng.gender') }}</label>
          <select id="qzGender" v-model="gender" class="field-select">
            <option value="male">{{ $t('qizheng.male') }}</option>
            <option value="female">{{ $t('qizheng.female') }}</option>
          </select>
        </div>
        <div class="form-item form-item--checks">
          <label class="checkbox-label">
            <input v-model="isSolarTime" type="checkbox">
            {{ $t('qizheng.solarTime') }}
          </label>
        </div>
      </div>

      <div v-if="chartMode === 'chart'" class="form-row">
        <div class="form-item">
          <label for="qzTargetDate">{{ $t('qizheng.targetDate') }}</label>
          <input id="qzTargetDate" v-model="targetDate" type="date">
        </div>
        <div class="form-item">
          <label for="qzTargetTime">{{ $t('qizheng.targetTime') }}</label>
          <input id="qzTargetTime" v-model="targetTime" type="time" step="1">
        </div>
      </div>

      <details class="advanced-details">
        <summary>{{ $t('qizheng.advanced') }}</summary>
        <div class="form-row">
          <div class="form-item">
            <label for="qzLon">{{ $t('qizheng.longitude') }}</label>
            <input id="qzLon" v-model.number="longitude" type="number" step="0.0001" min="-180" max="180">
          </div>
          <div class="form-item">
            <label for="qzLat">{{ $t('qizheng.latitude') }}</label>
            <input id="qzLat" v-model.number="latitude" type="number" step="0.0001" min="-90" max="90">
          </div>
        </div>
        <div class="form-row">
          <div class="form-item">
            <label for="qzTz">{{ $t('qizheng.tz') }}</label>
            <input id="qzTz" v-model.number="tz" type="number" step="1" min="-12" max="14">
          </div>
          <div class="form-item form-item--checks">
            <label class="checkbox-label">
              <input v-model="isLateZi" type="checkbox">
              {{ $t('qizheng.lateZi') }}
            </label>
          </div>
        </div>
      </details>

      <button type="button" class="submit-btn" :disabled="loading" @click="onSubmit">
        {{ loading ? $t('qizheng.calculating') : $t('qizheng.submit') }}
      </button>
    </div>

    <div v-if="loading" class="status-card">{{ $t('qizheng.calculating') }}</div>
    <div v-else-if="error && !result" class="status-card error">{{ error }}</div>

    <div v-else-if="result" class="result-wrap">
      <p v-if="error" class="demo-banner warn">{{ error }}</p>

      <p class="birth-info">
        {{ $t('qizheng.birthInfo') }}：{{ result.birth_dt }}
        · {{ genderLabel(result.gender, t) }}
        <span v-if="result.lunar_date"> · {{ result.lunar_date }}</span>
        <span v-if="chartMode === 'chart' && result.target_dt"> · {{ $t('qizheng.targetInfo') }} {{ result.target_dt }}</span>
      </p>

      <div v-if="result.grace" class="grace-row">
        <span>{{ $t('qizheng.self') }} {{ result.grace.self_wx_label }}</span>
        <span>{{ $t('qizheng.grace') }} {{ result.grace.grace_label }}</span>
        <span>{{ $t('qizheng.useful') }} {{ result.grace.useful_label }}</span>
        <span>{{ $t('qizheng.foe') }} {{ result.grace.foe_label }}</span>
        <span>{{ $t('qizheng.hardship') }} {{ result.grace.hardship_label }}</span>
      </div>

      <QizhengChartWheel
        :natal="result"
        :show-flow="chartMode === 'chart'"
        :selected-key="selectedStar"
        @select-star="selectedStar = $event"
      />

      <div v-if="selectedStarVo" class="star-card">
        <strong>{{ selectedStarVo.label }}</strong>
        {{ palaceNameByIndex(result.palaces, selectedStarVo.palace_index) }}
        · {{ formatPalaceDegree(palaceByIndex(result.palaces, selectedStarVo.palace_index)?.earthly_branch_label, selectedStarVo.palace_degree) }}
        · {{ xiuDisplayByKey(result.xiu_spans, selectedStarVo.xiu_degree?.xiu) }}
        {{ formatDeg(selectedStarVo.xiu_degree?.degree) }}
        <span v-if="selectedStarVo.dignity_label"> · {{ selectedStarVo.dignity_label }}</span>
        <span v-if="(selectedStarVo.status_labels || []).length">
          · {{ selectedStarVo.status_labels.join(' ') }}
        </span>
      </div>

      <div class="content-tabs">
        <button
          v-for="tab in resultTabs"
          :key="tab.id"
          type="button"
          class="content-tab"
          :class="{ active: resultTab === tab.id }"
          @click="resultTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <QizhengInterpret v-if="resultTab === 'interp'" :natal="result" />
      <QizhengStarTable
        v-else-if="resultTab === 'stars'"
        variant="natal"
        :stars="result.stars"
        :palaces="result.palaces"
        :xiu-spans="result.xiu_spans"
        :selected-key="selectedStar"
        @select-star="selectedStar = $event"
      />
      <QizhengStarTable
        v-else-if="resultTab === 'flow'"
        variant="flow"
        :stars="result.flow_stars || []"
        :palaces="result.palaces"
        :xiu-spans="result.xiu_spans"
        :selected-key="selectedStar"
        @select-star="selectedStar = $event"
      />
      <QizhengLimitsPanel v-else-if="resultTab === 'limits'" :natal="result" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import QizhengChartWheel from '../../components/qizheng/QizhengChartWheel.vue'
import QizhengStarTable from '../../components/qizheng/QizhengStarTable.vue'
import QizhengInterpret from '../../components/qizheng/QizhengInterpret.vue'
import QizhengLimitsPanel from '../../components/qizheng/QizhengLimitsPanel.vue'
import {
  fetchQizhengChart
} from '../../services/qizheng'
import { extractQizhengError, genderLabel, isApiSuccess, todayNoon } from '../../composables/useQizheng'
import { formatDeg, formatPalaceDegree, palaceByIndex, palaceNameByIndex, xiuDisplayByKey } from '../../utils/qizhengChart'

const { t } = useI18n()

const chartMode = ref('natal')
const birthDate = ref('1983-09-05')
const birthTime = ref('06:00:00')
const gender = ref('male')
const isSolarTime = ref(false)
const isLateZi = ref(false)
const longitude = ref(116.39)
const latitude = ref(39.91)
const tz = ref(8)
const targetDate = ref(todayNoon().slice(0, 10))
const targetTime = ref('12:00:00')

const loading = ref(false)
const error = ref('')
const result = ref(null)
const selectedStar = ref('')
const resultTab = ref('interp')

const resultTabs = computed(() => {
  const tabs = [
    { id: 'interp', label: t('qizheng.tabInterp') },
    { id: 'stars', label: t('qizheng.tabStars') },
    { id: 'flow', label: t('qizheng.tabFlow') }
  ]
  if (chartMode.value === 'chart') {
    tabs.push({ id: 'limits', label: t('qizheng.tabLimits') })
  }
  return tabs
})

const selectedStarVo = computed(() => {
  const key = selectedStar.value
  if (!key || !result.value) return null
  const natal = (result.value.stars || []).find((s) => s.key === key)
  if (resultTab.value === 'flow') {
    return (result.value.flow_stars || []).find((s) => s.key === key) || natal || null
  }
  return natal || null
})

/** 始终走 chart：本命/行运共用一次结果，切换模式只改展示 */
function formParams() {
  const time = targetTime.value || '12:00:00'
  return {
    birthDate: birthDate.value,
    birthTime: birthTime.value,
    gender: gender.value,
    is_solar_time: isSolarTime.value,
    is_late_zi: isLateZi.value,
    longitude: longitude.value,
    latitude: latitude.value,
    tz: tz.value,
    target_dt: `${targetDate.value} ${time.length === 5 ? `${time}:00` : time}`
  }
}

function switchMode(mode) {
  if (chartMode.value === mode) return
  chartMode.value = mode
  if (mode === 'natal' && resultTab.value === 'limits') {
    resultTab.value = 'interp'
  }
}

function applyResult(data) {
  result.value = data
  selectedStar.value = data?.stars?.[0]?.key || ''
  resultTab.value = 'interp'
}

async function onSubmit() {
  if (!birthDate.value || !birthTime.value) {
    error.value = t('qizheng.errorFillBirth')
    return
  }
  if (!targetDate.value) {
    error.value = t('qizheng.errorFillBirth')
    return
  }

  loading.value = true
  error.value = ''

  try {
    const res = await fetchQizhengChart(formParams())

    if (isApiSuccess(res)) {
      applyResult(res.data)
    } else {
      error.value = res?.msg || t('qizheng.errorFetchFailed')
      result.value = null
    }
  } catch (e) {
    error.value = extractQizhengError(e, t('qizheng.errorFetchFailed'))
    result.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  onSubmit()
})
</script>

<style scoped>
.qizheng-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 8px 12px 24px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  margin: 0 0 6px;
  color: #333;
}

.page-desc {
  text-align: center;
  color: #888;
  font-size: 13px;
  margin: 0 0 16px;
  line-height: 1.5;
}

.query-card,
.result-wrap,
.status-card {
  background: #fff;
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 12px;
  border: 1px solid #f0ebe7;
}

.status-card {
  text-align: center;
  color: #666;
}

.status-card.error {
  color: #cf5a5a;
}

.mode-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 14px;
  padding: 4px;
  background: #faf8f6;
  border-radius: 10px;
}

.mode-tab {
  flex: 1;
  padding: 9px 8px;
  border: none;
  border-radius: 8px;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  color: #888;
  cursor: pointer;
}

.mode-tab.is-active {
  background: #fff;
  color: #8b7355;
  box-shadow: 0 1px 4px rgba(139, 115, 85, 0.12);
}

.form-row {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.form-item {
  flex: 1;
}

.form-item label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 6px;
}

.form-item input,
.field-select {
  width: 100%;
  border: 1px solid #ece3dc;
  border-radius: 8px;
  padding: 8px;
  font-size: 14px;
  background: #fff;
  box-sizing: border-box;
}

.form-item--checks {
  display: flex;
  align-items: flex-end;
}

.checkbox-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  padding-bottom: 8px;
}

.advanced-details {
  margin: 8px 0;
  font-size: 13px;
  color: #666;
}

.advanced-details summary {
  cursor: pointer;
  margin-bottom: 8px;
}

.submit-btn {
  width: 100%;
  margin-top: 8px;
  padding: 10px 16px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  background: #8b7355;
  border: 0;
  border-radius: 10px;
  cursor: pointer;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.demo-banner {
  margin: 0 0 12px;
  padding: 8px 10px;
  background: #faf6ef;
  border-radius: 8px;
  font-size: 12px;
  color: #8b7355;
  line-height: 1.5;
}

.demo-banner.warn {
  background: #f8ecec;
  color: #a06050;
}

.birth-info {
  margin: 0 0 12px;
  font-size: 13px;
  color: #666;
  text-align: center;
}

.grace-row {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0 0 12px;
  font-size: 12px;
  color: #8b7355;
}

.star-card {
  margin: 12px 0 4px;
  padding: 10px 12px;
  background: #faf8f6;
  border-radius: 10px;
  font-size: 13px;
  color: #5c4a32;
}

.content-tabs {
  display: flex;
  gap: 6px;
  margin: 14px 0 4px;
  flex-wrap: wrap;
}

.content-tab {
  border: 1px solid #ece3dc;
  background: #fff;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 13px;
  color: #8a7a62;
  cursor: pointer;
}

.content-tab.active {
  background: #8b7355;
  border-color: #8b7355;
  color: #fff;
}
</style>
