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
        <button
          type="button"
          role="tab"
          class="mode-tab"
          :class="{ 'is-active': chartMode === 'comparison' }"
          :aria-selected="chartMode === 'comparison'"
          @click="switchMode('comparison')"
        >
          {{ $t('qizheng.comparison') }}
        </button>
      </div>

      <p v-if="isComparison" class="form-section">{{ $t('qizheng.personA') }}</p>
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

      <template v-if="isComparison">
        <p class="form-section">{{ $t('qizheng.personB') }}</p>
        <div class="form-row">
          <div class="form-item">
            <label for="qzBirthDateB">{{ $t('qizheng.birthDate') }}</label>
            <input id="qzBirthDateB" v-model="birthDateB" type="date" required>
          </div>
          <div class="form-item">
            <label for="qzBirthTimeB">{{ $t('qizheng.birthTime') }}</label>
            <input id="qzBirthTimeB" v-model="birthTimeB" type="time" step="1" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-item">
            <label for="qzGenderB">{{ $t('qizheng.gender') }}</label>
            <select id="qzGenderB" v-model="genderB" class="field-select">
              <option value="male">{{ $t('qizheng.male') }}</option>
              <option value="female">{{ $t('qizheng.female') }}</option>
            </select>
          </div>
          <div class="form-item" />
        </div>
      </template>

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
    <div v-else-if="error && !activeResult" class="status-card error">{{ error }}</div>

    <div v-else-if="activeResult" class="result-wrap">
      <p v-if="error" class="warn-banner">{{ error }}</p>

      <p v-if="isComparison" class="birth-info">
        {{ $t('qizheng.personA') }}：{{ comparisonResult.birth_dt }}
        · {{ genderLabel(comparisonResult.gender, t) }}
        <span v-if="comparisonResult.basic?.lunar_date">
          · {{ comparisonResult.basic.lunar_date }}
        </span>
        <br>
        {{ $t('qizheng.personB') }}：{{ comparisonResult.other_birth_dt }}
        · {{ genderLabel(comparisonResult.other_gender, t) }}
      </p>
      <p v-else class="birth-info">
        {{ $t('qizheng.birthInfo') }}：{{ chartResult.birth_dt }}
        · {{ genderLabel(chartResult.gender, t) }}
        <span v-if="chartResult.basic?.lunar_date">
          · {{ chartResult.basic.lunar_date }}
        </span>
        <span v-if="chartMode === 'chart' && chartResult.target_dt">
          · {{ $t('qizheng.targetInfo') }} {{ chartResult.target_dt }}
        </span>
      </p>

      <div v-if="graceSummary" class="grace-row">
        <span>{{ $t('qizheng.self') }} {{ graceSummary.self }}</span>
        <span>{{ $t('qizheng.grace') }} {{ graceSummary.grace }}</span>
        <span>{{ $t('qizheng.useful') }} {{ graceSummary.useful }}</span>
        <span>{{ $t('qizheng.foe') }} {{ graceSummary.foe }}</span>
        <span>{{ $t('qizheng.hardship') }} {{ graceSummary.hardship }}</span>
      </div>

      <div class="wheel-wrap">
        <QizhengLimitsPanel
          v-if="chartMode === 'chart' && chartResult?.current_limits"
          class="xingxian-overlay"
          :limits="chartResult.current_limits"
        />
        <QizhengChartWheel
          :natal="wheelNatal"
          :show-flow="chartMode === 'chart' || isComparison"
          :selected-key="selectedStar"
          @select-star="selectedStar = $event"
        />
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

      <QizhengBasePanel v-if="resultTab === 'base'" :natal="panelNatal" />
      <QizhengStarTable
        v-else-if="resultTab === 'stars'"
        variant="natal"
        :stars="panelNatal.stars"
        :palaces="panelNatal.palaces"
        :xiu-spans="panelNatal.xiu_spans"
        :selected-key="selectedStar"
        @select-star="selectedStar = $event"
      />
      <QizhengStarTable
        v-else-if="resultTab === 'flow'"
        :variant="isComparison ? 'natal' : 'flow'"
        :stars="overlayStars"
        :palaces="panelNatal.palaces"
        :xiu-spans="panelNatal.xiu_spans"
        :selected-key="selectedStar"
        @select-star="selectedStar = $event"
      />
      <QizhengHuaYaoPanel
        v-else-if="resultTab === 'huayao'"
        :groups="panelNatal.hua_yao_groups || []"
        :stars="panelNatal.stars"
      />
      <QizhengPatternsPanel
        v-else-if="resultTab === 'patterns'"
        :patterns="panelNatal.patterns || []"
      />
      <QizhengXiaoXianPanel
        v-else-if="resultTab === 'xiaoxian'"
        :years="chartResult?.limit_years || []"
      />
      <QizhengInterpret v-else-if="resultTab === 'interp'" :natal="panelNatal" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import QizhengChartWheel from '../../components/qizheng/QizhengChartWheel.vue'
import QizhengStarTable from '../../components/qizheng/QizhengStarTable.vue'
import QizhengHuaYaoPanel from '../../components/qizheng/QizhengHuaYaoPanel.vue'
import QizhengPatternsPanel from '../../components/qizheng/QizhengPatternsPanel.vue'
import QizhengXiaoXianPanel from '../../components/qizheng/QizhengXiaoXianPanel.vue'
import QizhengBasePanel from '../../components/qizheng/QizhengBasePanel.vue'
import QizhengLimitsPanel from '../../components/qizheng/QizhengLimitsPanel.vue'
import QizhengInterpret from '../../components/qizheng/QizhengInterpret.vue'
import { fetchQizhengChart, fetchQizhengComparison } from '../../services/qizheng'
import { extractQizhengError, genderLabel, isApiSuccess, todayNoon } from '../../composables/useQizheng'

const { t } = useI18n()

const chartMode = ref('natal')
const birthDate = ref('1993-09-05')
const birthTime = ref('06:00:00')
const gender = ref('male')
const birthDateB = ref('2000-06-15')
const birthTimeB = ref('12:00:00')
const genderB = ref('female')
const isSolarTime = ref(false)
const isLateZi = ref(false)
const longitude = ref(116.39)
const latitude = ref(39.91)
const tz = ref(8)
const targetDate = ref(todayNoon().slice(0, 10))
const targetTime = ref('12:00:00')

const loading = ref(false)
const error = ref('')
const chartResult = ref(null)
const comparisonResult = ref(null)
const selectedStar = ref('')
const resultTab = ref('base')

const isComparison = computed(() => chartMode.value === 'comparison')

const activeResult = computed(() =>
  isComparison.value ? comparisonResult.value : chartResult.value
)

/** tabs / 基础 / 解读：比较盘已与 NatalVo 同构扁平 */
const panelNatal = computed(() => activeResult.value || {})

/**
 * 圆盘数据：
 * - 本命/行运：chart 结果
 * - 比较：扁平同构，flow_stars=B；flow_aspects=A↔B，映射为 cross_aspects 供连线
 */
const wheelNatal = computed(() => {
  if (isComparison.value && comparisonResult.value) {
    const c = comparisonResult.value
    return {
      ...c,
      cross_aspects: c.flow_aspects || []
    }
  }
  return chartResult.value
})

/** 外圈星表：行运 / 比较都用 flow_stars */
const overlayStars = computed(() => activeResult.value?.flow_stars || [])

const resultTabs = computed(() => {
  if (isComparison.value) {
    return [
      { id: 'base', label: t('qizheng.tabBase') },
      { id: 'stars', label: t('qizheng.tabStars') },
      { id: 'flow', label: t('qizheng.tabStarsB') },
      { id: 'huayao', label: t('qizheng.tabHuaYao') },
      { id: 'patterns', label: t('qizheng.tabPatterns') },
      { id: 'interp', label: t('qizheng.tabInterp') }
    ]
  }
  return [
    { id: 'base', label: t('qizheng.tabBase') },
    { id: 'stars', label: t('qizheng.tabStars') },
    { id: 'flow', label: t('qizheng.tabFlow') },
    { id: 'huayao', label: t('qizheng.tabHuaYao') },
    { id: 'patterns', label: t('qizheng.tabPatterns') },
    { id: 'xiaoxian', label: t('qizheng.tabXiaoXian') },
    { id: 'interp', label: t('qizheng.tabInterp') }
  ]
})

const graceSummary = computed(() => {
  const g = panelNatal.value?.basic?.grace
  if (!g?.degree) return null
  const row = g.degree
  if (!row.self_wx_label && !row.grace_label) return null
  return {
    self: row.self_wx_label || '',
    grace: row.grace_label || '',
    useful: row.useful_label || '',
    foe: row.foe_label || '',
    hardship: row.hardship_label || ''
  }
})

function sharedLocationParams() {
  return {
    is_solar_time: isSolarTime.value,
    is_late_zi: isLateZi.value,
    longitude: longitude.value,
    latitude: latitude.value,
    tz: tz.value
  }
}

function formParams() {
  const time = targetTime.value || '12:00:00'
  return {
    birthDate: birthDate.value,
    birthTime: birthTime.value,
    gender: gender.value,
    ...sharedLocationParams(),
    target_dt: `${targetDate.value} ${time.length === 5 ? `${time}:00` : time}`
  }
}

function comparisonParams() {
  const loc = sharedLocationParams()
  return {
    personA: {
      birthDate: birthDate.value,
      birthTime: birthTime.value,
      gender: gender.value,
      ...loc
    },
    personB: {
      birthDate: birthDateB.value,
      birthTime: birthTimeB.value,
      gender: genderB.value,
      ...loc
    }
  }
}

function switchMode(mode) {
  if (chartMode.value === mode) return
  chartMode.value = mode
  resultTab.value = 'base'
  selectedStar.value = activeResult.value?.stars?.[0]?.key || ''
}

function applyChartResult(data) {
  chartResult.value = data
  selectedStar.value = data?.stars?.[0]?.key || ''
  resultTab.value = 'base'
}

function applyComparisonResult(data) {
  comparisonResult.value = data
  selectedStar.value = data?.stars?.[0]?.key || ''
  resultTab.value = 'base'
}

async function onSubmit() {
  if (!birthDate.value || !birthTime.value) {
    error.value = t('qizheng.errorFillBirth')
    return
  }

  if (isComparison.value) {
    if (!birthDateB.value || !birthTimeB.value) {
      error.value = t('qizheng.errorFillBoth')
      return
    }
  } else if (!targetDate.value) {
    error.value = t('qizheng.errorFillBirth')
    return
  }

  loading.value = true
  error.value = ''

  try {
    if (isComparison.value) {
      const res = await fetchQizhengComparison(comparisonParams())
      if (isApiSuccess(res)) {
        applyComparisonResult(res.data)
      } else {
        error.value = res?.msg || t('qizheng.errorFetchFailed')
        comparisonResult.value = null
      }
    } else {
      const res = await fetchQizhengChart(formParams())
      if (isApiSuccess(res)) {
        applyChartResult(res.data)
      } else {
        error.value = res?.msg || t('qizheng.errorFetchFailed')
        chartResult.value = null
      }
    }
  } catch (e) {
    error.value = extractQizhengError(e, t('qizheng.errorFetchFailed'))
    if (isComparison.value) comparisonResult.value = null
    else chartResult.value = null
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

.form-section {
  margin: 4px 0 10px;
  font-size: 13px;
  font-weight: 600;
  color: #8b7355;
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

.warn-banner {
  margin: 0 0 12px;
  padding: 8px 10px;
  background: #f8ecec;
  border-radius: 8px;
  font-size: 12px;
  color: #a06050;
  line-height: 1.5;
}

.birth-info {
  margin: 0 0 12px;
  font-size: 13px;
  color: #666;
  text-align: center;
  line-height: 1.6;
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

.wheel-wrap {
  position: relative;
}

.xingxian-overlay {
  position: absolute;
  left: 4px;
  bottom: 10%;
  top: auto;
  z-index: 2;
}

@media (max-width: 480px) {
  .xingxian-overlay {
    left: 0;
    bottom: 6%;
    top: auto;
    font-size: 12px;
    transform: scale(0.92);
    transform-origin: bottom left;
  }
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
