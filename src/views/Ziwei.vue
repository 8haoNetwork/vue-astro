<template>
  <div class="ziwei-page">
    <!-- 入口选择 -->
    <div v-if="!chartMode" class="index-section">
      <h1 class="page-title">{{ t('pageTitle') }}</h1>
      <p class="page-subtitle">{{ t('subtitle') }}</p>
      <div class="option-cards">
        <div class="option-card" @click="setChartMode('full')">
          <div class="option-icon">📊</div>
          <h2 class="option-title">{{ t('fullChart') }}</h2>
          <p class="option-desc">{{ t('fullChartDesc') }}</p>
        </div>
        <div class="option-card" @click="setChartMode('natal')">
          <div class="option-icon">⭐</div>
          <h2 class="option-title">{{ t('natalChart') }}</h2>
          <p class="option-desc">{{ t('natalChartDesc') }}</p>
        </div>
      </div>
    </div>

    <!-- 表单 + 结果 -->
    <template v-else>
      <div class="query-card">
        <div class="form-header">
          <button v-if="ziweiData" type="button" class="back-mode-btn" @click="backToIndex">← {{ t('backToSelect') }}</button>
          <h2 class="form-title">{{ chartMode === 'full' ? t('fullChart') : t('natalChart') }}</h2>
        </div>
        <div class="form-row">
          <div class="form-item">
            <label for="birthDate">{{ t('birthDate') }}</label>
            <input id="birthDate" v-model="birthDate" type="date" required>
          </div>
          <div class="form-item">
            <label for="birthTime">{{ t('birthTime') }}</label>
            <input id="birthTime" v-model="birthTime" type="time" step="1" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-item">
            <label for="gender">{{ t('gender') }}</label>
            <select id="gender" v-model="gender" class="gender-select">
              <option value="male">{{ t('male') }}</option>
              <option value="female">{{ t('female') }}</option>
            </select>
          </div>
          <div class="form-item form-item--advanced">
            <label class="checkbox-label">
              <input v-model="isSolarTime" type="checkbox">
              {{ t('solarTime') }}
            </label>
          </div>
        </div>
        <details class="advanced-details">
          <summary>{{ t('advanced') }}</summary>
          <div class="advanced-row">
            <label class="checkbox-label">
              <input v-model="isLateZi" type="checkbox">
              {{ t('lateZi') }}
            </label>
          </div>
        </details>
        <button type="button" class="submit-btn" :disabled="loading" @click="fetchData">
          {{ loading ? t('calculating') : t('submit') }}
        </button>
      </div>

      <div v-if="loading" class="status-card">{{ t('calculating') }}</div>
      <div v-else-if="error" class="status-card error">{{ error }}</div>

      <div v-else-if="ziweiData" class="result-wrap">
        <div class="result-header">
          <h3>{{ t('analysis') }}</h3>
          <p class="birth-info">
            {{ t('birthInfo') }}：{{ birthDate }} {{ birthTime }} · {{ translateGender(gender) }}
            <span v-if="ziweiData.lunar_date"> · {{ t('lunar') }} {{ ziweiData.lunar_date }}</span>
          </p>
        </div>

        <!-- 4x4 传统宫位布局（与 vue_ziwei chartCommon 一致） -->
        <div v-if="palaces.length" class="chart-palace-grid-4x4">
          <!-- 第1行：福德、父母、命宫、兄弟 -->
          <div
            v-for="pos in [0, 1, 2, 3]"
            :key="'p-' + pos"
            class="chart-palace-box"
            :class="getPalaceBoxClass(pos)"
            @click="onPalaceClick(pos)"
          >
            <div class="chart-palace-name">{{ getPalaceByGridPosition(pos) ? palaceName(getPalaceByGridPosition(pos)) : '' }}</div>
            <div v-if="getPalaceByGridPosition(pos)" class="chart-palace-cell-wrap">
              <ZiweiPalaceCell :palace="getPalaceByGridPosition(pos)" :body-palace-index="bodyPalaceIndex" />
            </div>
          </div>
          <!-- 第2行左：田宅 -->
          <div
            class="chart-palace-box"
            :class="getPalaceBoxClass(4)"
            @click="onPalaceClick(4)"
          >
            <div class="chart-palace-name">{{ getPalaceByGridPosition(4) ? palaceName(getPalaceByGridPosition(4)) : '' }}</div>
            <div v-if="getPalaceByGridPosition(4)" class="chart-palace-cell-wrap">
              <ZiweiPalaceCell :palace="getPalaceByGridPosition(4)" :body-palace-index="bodyPalaceIndex" />
            </div>
          </div>
          <!-- 中间 2x2：基本信息 -->
          <div class="chart-info-block-center">
            <div class="chart-info-content">
              <div v-for="row in basicInfoRows" :key="row.label" class="chart-info-row">
                <span class="chart-info-label">{{ row.label }}</span>
                <span class="chart-info-value">{{ row.valueTranslated }}</span>
              </div>
            </div>
          </div>
          <!-- 第2行右：夫妻 -->
          <div
            class="chart-palace-box"
            :class="getPalaceBoxClass(5)"
            @click="onPalaceClick(5)"
          >
            <div class="chart-palace-name">{{ getPalaceByGridPosition(5) ? palaceName(getPalaceByGridPosition(5)) : '' }}</div>
            <div v-if="getPalaceByGridPosition(5)" class="chart-palace-cell-wrap">
              <ZiweiPalaceCell :palace="getPalaceByGridPosition(5)" :body-palace-index="bodyPalaceIndex" />
            </div>
          </div>
          <!-- 第3行左：官禄 -->
          <div
            class="chart-palace-box"
            :class="getPalaceBoxClass(6)"
            @click="onPalaceClick(6)"
          >
            <div class="chart-palace-name">{{ getPalaceByGridPosition(6) ? palaceName(getPalaceByGridPosition(6)) : '' }}</div>
            <div v-if="getPalaceByGridPosition(6)" class="chart-palace-cell-wrap">
              <ZiweiPalaceCell :palace="getPalaceByGridPosition(6)" :body-palace-index="bodyPalaceIndex" />
            </div>
          </div>
          <!-- 第3行右：子女 -->
          <div
            class="chart-palace-box"
            :class="getPalaceBoxClass(7)"
            @click="onPalaceClick(7)"
          >
            <div class="chart-palace-name">{{ getPalaceByGridPosition(7) ? palaceName(getPalaceByGridPosition(7)) : '' }}</div>
            <div v-if="getPalaceByGridPosition(7)" class="chart-palace-cell-wrap">
              <ZiweiPalaceCell :palace="getPalaceByGridPosition(7)" :body-palace-index="bodyPalaceIndex" />
            </div>
          </div>
          <!-- 第4行：交友、迁移、疾厄、财帛 -->
          <div
            v-for="pos in [8, 9, 10, 11]"
            :key="'p-' + pos"
            class="chart-palace-box"
            :class="getPalaceBoxClass(pos)"
            @click="onPalaceClick(pos)"
          >
            <div class="chart-palace-name">{{ getPalaceByGridPosition(pos) ? palaceName(getPalaceByGridPosition(pos)) : '' }}</div>
            <div v-if="getPalaceByGridPosition(pos)" class="chart-palace-cell-wrap">
              <ZiweiPalaceCell :palace="getPalaceByGridPosition(pos)" :body-palace-index="bodyPalaceIndex" />
            </div>
          </div>
        </div>

        <section v-if="patterns.length" class="chart-patterns-container">
          <h4 class="chart-patterns-title">{{ t('patternsTitle') }} ({{ patterns.length }})</h4>
          <div class="chart-patterns-content">
            <div v-for="(pat, i) in patterns" :key="i" class="chart-pattern-item">
              <div class="chart-pattern-name">{{ pat.name }}</div>
              <div class="chart-pattern-description">{{ pat.description || t('noDescription') }}</div>
            </div>
          </div>
        </section>

        <section v-if="starInterps.length" class="chart-star-interps-container">
          <h4 class="chart-star-interps-title">{{ t('starInterpsTitle') }} ({{ starInterps.length }})</h4>
          <div class="chart-star-interps-content">
            <div v-for="(item, i) in starInterps" :key="i" class="chart-star-interp-item">
              <div class="chart-star-interp-header">
                <span class="chart-star-interp-star-name">{{ translateStarName(item.star_name) || '' }}</span>
                <span class="chart-star-interp-palace-name">{{ translatePalaceName(item.palace_name) || '' }}</span>
              </div>
              <div class="chart-star-interp-description">{{ item.interpretation || t('noDescription') }}</div>
            </div>
          </div>
        </section>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { fetchZiweiNatal, fetchZiweiDetail } from '../services/ziwei'
import { useZiweiI18n } from '../composables/useZiweiI18n'
import ZiweiPalaceCell from '../components/ZiweiPalaceCell.vue'

const { t, translatePalaceName, translateStarName, translateFiveElementsClass, translateGender } = useZiweiI18n()

const chartMode = ref('') // '' | 'full' | 'natal'
const birthDate = ref('1999-09-09')
const birthTime = ref('09:09:00')
const gender = ref('male')
const isSolarTime = ref(false)
const isLateZi = ref(false)
const loading = ref(false)
const error = ref('')
const ziweiData = ref(null)

function setChartMode(mode) {
  chartMode.value = mode
  ziweiData.value = null
  error.value = ''
}

function backToIndex() {
  chartMode.value = ''
  ziweiData.value = null
  error.value = ''
}

const palaces = computed(() => {
  const d = ziweiData.value
  if (!d) return []
  const natal = d.natal || d
  const list = natal.palaces || d.palaces || []
  return Array.isArray(list) ? list : []
})

const bodyPalaceIndex = computed(() => {
  const d = ziweiData.value
  if (!d) return null
  const idx = d.body_palace_idx ?? d.natal?.body_palace_idx
  if (idx === undefined || idx === null) return null
  return Number(idx)
})

// 4x4 布局宫位顺序（与 vue_ziwei 一致）：位置 0~11 对应后端 palace.index
const PALACE_GRID_ORDER = [3, 4, 5, 6, 2, 7, 1, 8, 0, 11, 10, 9]

/** 当前点击的宫位（后端 index），-1 表示未点击，默认高亮命宫 */
const clickedPalaceBackendIndex = ref(-1)

const natalPalaceIdx = computed(() => {
  const d = ziweiData.value
  if (!d) return null
  const idx = d.natal_palace_idx ?? d.natal?.natal_palace_idx
  if (idx === undefined || idx === null) return null
  return Number(idx)
})

/** 三方四正：本宫、对宫(+6)、财帛位(+8)、官禄位(+4)，返回后端 index 数组 */
function getSurroundedBackendIndices(backendIndex) {
  const fix = (i) => ((i % 12) + 12) % 12
  return [
    backendIndex,
    fix(backendIndex + 6),
    fix(backendIndex + 8),
    fix(backendIndex + 4)
  ]
}

/** 点击某宫时，除本宫外需要“三合对宫”高亮的后端 index 列表 */
const surroundedBackendIndices = computed(() => {
  if (clickedPalaceBackendIndex.value < 0) return []
  const [target, opposite, wealth, career] = getSurroundedBackendIndices(clickedPalaceBackendIndex.value)
  return [opposite, wealth, career]
})

function getPalaceByGridPosition(position) {
  if (position < 0 || position > 11) return null
  const backendIndex = PALACE_GRID_ORDER[position]
  return palaces.value.find(p => p.index === backendIndex) || null
}

/** 根据网格位置返回宫格高亮 class：本宫 highlight，三方四正其余 highlight-surrounded */
function getPalaceBoxClass(gridPos) {
  const palace = getPalaceByGridPosition(gridPos)
  if (!palace) return {}
  const backendIndex = palace.index
  const clicked = clickedPalaceBackendIndex.value
  const natalIdx = natalPalaceIdx.value
  const isOrigin = natalIdx != null && backendIndex === natalIdx
  const isClicked = clicked >= 0 && backendIndex === clicked
  const isSurrounded = clicked >= 0 && surroundedBackendIndices.value.includes(backendIndex)
  return {
    'highlight': (clicked < 0 && isOrigin) || isClicked,
    'highlight-surrounded': isSurrounded
  }
}

function onPalaceClick(gridPos) {
  const palace = getPalaceByGridPosition(gridPos)
  if (!palace) return
  const backendIndex = palace.index
  if (clickedPalaceBackendIndex.value === backendIndex) {
    clickedPalaceBackendIndex.value = -1
  } else {
    clickedPalaceBackendIndex.value = backendIndex
  }
}

const patterns = computed(() => {
  const d = ziweiData.value
  const arr = d?.patterns
  return Array.isArray(arr) ? arr : []
})

const starInterps = computed(() => {
  const d = ziweiData.value
  const arr = d?.natal_star_interps ?? d?.star_interps
  return Array.isArray(arr) ? arr : []
})

const basicInfoRows = computed(() => {
  const d = ziweiData.value
  if (!d) return []
  const rows = []
  if (d.five_elements_class != null && d.five_elements_class !== '') {
    rows.push({ label: t('fiveElementsClass'), value: d.five_elements_class, valueTranslated: translateFiveElementsClass(d.five_elements_class) })
  }
  if (d.soul_lord != null && d.soul_lord !== '') {
    rows.push({ label: t('lifeLord'), value: d.soul_lord, valueTranslated: translateStarName(d.soul_lord) })
  }
  if (d.body_lord != null && d.body_lord !== '') {
    rows.push({ label: t('bodyLord'), value: d.body_lord, valueTranslated: translateStarName(d.body_lord) })
  }
  if (d.zodiac != null && d.zodiac !== '') {
    rows.push({ label: t('zodiac'), value: d.zodiac, valueTranslated: d.zodiac })
  }
  return rows
})

function palaceName(p) {
  const raw = p.name ?? p.palace_name ?? ''
  return raw ? translatePalaceName(raw) : `#${p.index}`
}

function starLine(stars) {
  if (!Array.isArray(stars) || !stars.length) return ''
  return stars.map(s => (typeof s === 'string' ? s : s.name)).filter(Boolean).join(' ')
}

function starLineTranslated(stars) {
  if (!Array.isArray(stars) || !stars.length) return ''
  return stars.map(s => translateStarName(typeof s === 'string' ? s : s.name)).filter(Boolean).join(' ')
}

async function fetchData() {
  if (!birthDate.value || !birthTime.value) {
    error.value = t('errorFillBirth')
    return
  }
  loading.value = true
  error.value = ''
  ziweiData.value = null
  try {
    const params = {
      birthDate: birthDate.value,
      birthTime: birthTime.value,
      gender: gender.value,
      tz: 8,
      is_solar_time: isSolarTime.value,
      is_late_zi: isLateZi.value
    }
    const res = chartMode.value === 'full'
      ? await fetchZiweiDetail(params)
      : await fetchZiweiNatal(params)

    if (res?.code === 0 && res?.data != null) {
      ziweiData.value = res.data
      clickedPalaceBackendIndex.value = -1
    } else {
      ziweiData.value = null
      error.value = res?.msg || t('errorFetchFailed')
    }
  } catch (e) {
    ziweiData.value = null
    error.value = t('errorFetchFailed')
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<style src="../styles/ziweiChart.css"></style>
<style scoped>
.ziwei-page {
  max-width: 640px;
  margin: 0 auto;
  padding: 12px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px;
  text-align: center;
}

.page-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0 0 24px;
  text-align: center;
}

.option-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.option-card {
  background: #fff;
  border-radius: 14px;
  padding: 20px 16px;
  cursor: pointer;
  border: 1px solid #ece3dc;
  transition: all 0.2s;
}

.option-card:hover {
  border-color: #8b7355;
  box-shadow: 0 4px 12px rgba(139, 115, 85, 0.12);
}

.option-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.option-title {
  font-size: 17px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px;
}

.option-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.query-card {
  background: #fff;
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 12px;
  border: 1px solid #f0ebe7;
}

.form-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.back-mode-btn {
  background: none;
  border: 0;
  font-size: 14px;
  color: #8b7355;
  cursor: pointer;
  padding: 0;
}

.back-mode-btn:hover {
  text-decoration: underline;
}

.form-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.form-row {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.form-item {
  flex: 1;
}

.form-item--advanced {
  display: flex;
  align-items: flex-end;
}

.form-item label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 6px;
}

.form-item input[type="date"],
.form-item input[type="time"] {
  width: 100%;
  border: 1px solid #ece3dc;
  border-radius: 8px;
  padding: 8px;
  font-size: 14px;
}

.gender-select {
  width: 100%;
  border: 1px solid #ece3dc;
  border-radius: 8px;
  padding: 8px;
  font-size: 14px;
  background: #fff;
}

.checkbox-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
}

.advanced-details {
  margin: 10px 0;
  font-size: 13px;
  color: #666;
}

.advanced-details summary {
  cursor: pointer;
}

.advanced-row {
  margin-top: 8px;
}

.submit-btn {
  width: 100%;
  margin-top: 12px;
  padding: 10px 16px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  background: #8b7355;
  border: 0;
  border-radius: 10px;
  cursor: pointer;
}

.submit-btn:hover:not(:disabled) {
  background: #7a6449;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.status-card {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  text-align: center;
  color: #666;
  margin-bottom: 12px;
}

.status-card.error {
  color: #cf5a5a;
}

.result-wrap {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  border: 1px solid #f0ebe7;
}

.result-header {
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.result-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px;
}

.birth-info {
  font-size: 13px;
  color: #666;
  margin: 0;
}
</style>
