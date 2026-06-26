<template>
  <div class="liuren-page">
    <h1 class="page-title">六壬</h1>

    <div class="query-card">
      <div class="liuren-tabs" role="tablist">
        <button
          v-for="tab in LIUREN_TYPE_OPTIONS"
          :key="tab.value"
          type="button"
          role="tab"
          class="liuren-tab"
          :class="{ 'is-active': activeTab === tab.value }"
          :aria-selected="activeTab === tab.value"
          @click="switchTab(tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="tab-panel" role="tabpanel">
        <div class="form-row">
          <div class="form-item">
            <label for="liurenDate">查询日期</label>
            <input id="liurenDate" v-model="shared.date" type="date" required>
          </div>
          <div class="form-item">
            <label for="liurenTime">查询时间</label>
            <input id="liurenTime" v-model="shared.time" type="time" step="1" required>
          </div>
        </div>

        <div v-if="activeTab === 'jinkoujue'" class="form-row">
          <div class="form-item form-item--full">
            <label for="diFen">地分</label>
            <select id="diFen" v-model="jinkouForm.diFen" class="field-select">
              <option v-for="opt in LIUREN_DI_FEN_OPTIONS" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-item">
            <label for="guiMethod">贵人起法</label>
            <select id="guiMethod" v-model="shared.guiMethod" class="field-select">
              <option
                v-for="opt in LIUREN_GUI_METHOD_OPTIONS"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-item">
            <label for="liurenLongitude">经度</label>
            <input
              id="liurenLongitude"
              v-model.number="shared.longitude"
              type="number"
              step="0.0001"
              min="-180"
              max="180"
            >
          </div>
          <div class="form-item form-item--checks">
            <label class="checkbox-label">
              <input v-model="shared.isSolarTime" type="checkbox">
              真太阳时
            </label>
          </div>
        </div>

        <details class="advanced-details">
          <summary>高级</summary>
          <div class="form-row">
            <div class="form-item">
              <label for="liurenTz">时区</label>
              <input id="liurenTz" v-model.number="shared.tz" type="number" step="1" min="-12" max="14">
            </div>
          </div>
        </details>

        <button type="button" class="submit-btn" :disabled="loading" @click="onSubmit">
          {{ loading ? '排盘中...' : '排盘' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="status-card">排盘中...</div>
    <div v-else-if="error" class="status-card error">{{ error }}</div>

    <div v-else-if="result" class="result-wrap">
      <LiurenMetaPanel :data="result" :selection="selection" @select="onSelect" />
      <LiurenPanGrid :data="result" :selection="selection" @select="onSelect" />
      <LiurenKeChuanPanel :data="result" :selection="selection" @select="onSelect" />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import {
  fetchLiuren,
  LIUREN_TYPE_OPTIONS,
  LIUREN_GUI_METHOD_OPTIONS,
  LIUREN_DI_FEN_OPTIONS
} from '../../services/liuren'
import { extractLiurenError } from '../../composables/useLiuren'
import LiurenMetaPanel from '../../components/liuren/LiurenMetaPanel.vue'
import LiurenPanGrid from '../../components/liuren/LiurenPanGrid.vue'
import LiurenKeChuanPanel from '../../components/liuren/LiurenKeChuanPanel.vue'
import '../../assets/styles/liuren.css'

const activeTab = ref('daliuren')

const shared = reactive({
  date: '2026-06-01',
  time: '14:00:00',
  guiMethod: 'tian',
  longitude: 116.4074,
  isSolarTime: true,
  tz: 8
})

const jinkouForm = reactive({
  diFen: 'chen'
})

const loading = ref(false)
const error = ref('')
const result = ref(null)
const selection = ref(null)

function switchTab(type) {
  if (activeTab.value === type) return
  activeTab.value = type
  error.value = ''
  result.value = null
  selection.value = null
}

function buildForm() {
  return {
    type: activeTab.value,
    date: shared.date,
    time: shared.time,
    guiMethod: shared.guiMethod,
    longitude: shared.longitude,
    isSolarTime: shared.isSolarTime,
    tz: shared.tz,
    diFen: activeTab.value === 'jinkoujue' ? jinkouForm.diFen : undefined
  }
}

function validateForm() {
  if (!shared.date || !shared.time) return '请填写查询日期与时间'
  if (activeTab.value === 'jinkoujue' && !jinkouForm.diFen) return '请选择地分'
  return ''
}

async function onSubmit() {
  const msg = validateForm()
  if (msg) {
    error.value = msg
    return
  }

  loading.value = true
  error.value = ''
  result.value = null
  selection.value = null

  try {
    const res = await fetchLiuren(buildForm())
    if (res?.code === 0 && res?.data) {
      result.value = res.data
    } else {
      error.value = res?.msg || '排盘失败，请稍后重试'
    }
  } catch (e) {
    error.value = extractLiurenError(e)
  } finally {
    loading.value = false
  }
}

function onSelect(next) {
  if (!next) {
    selection.value = null
    return
  }
  if (selection.value?.kind === next.kind && selection.value?.key === next.key) {
    selection.value = null
  } else {
    selection.value = next
  }
}
</script>

<style scoped>
.page-title {
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  margin: 0 0 16px;
  color: #333;
}

.query-card {
  background: #fff;
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 12px;
  border: 1px solid #f0ebe7;
}

.liuren-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 14px;
  padding: 4px;
  background: #faf8f6;
  border-radius: 10px;
}

.liuren-tab {
  flex: 1;
  padding: 9px 8px;
  border: none;
  border-radius: 8px;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  color: #888;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.liuren-tab.is-active {
  background: #fff;
  color: #6b5b4f;
  box-shadow: 0 1px 4px rgba(107, 91, 79, 0.12);
}

.liuren-tab:hover:not(.is-active) {
  color: #666;
}

.tab-panel {
  min-height: 0;
}

.form-row {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.form-item {
  flex: 1;
}

.form-item--full {
  flex: 1 1 100%;
}

.form-item label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 6px;
}

.form-item input[type="date"],
.form-item input[type="time"],
.form-item input[type="number"],
.field-select {
  width: 100%;
  border: 1px solid #ece3dc;
  border-radius: 8px;
  padding: 8px;
  font-size: 14px;
  background: #fff;
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
  margin-top: 12px;
  padding: 10px 16px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  background: #6b5b4f;
  border: 0;
  border-radius: 10px;
  cursor: pointer;
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
}

.status-card.error {
  color: #cf5a5a;
}

.result-wrap {
  background: #fff;
  border-radius: 14px;
  padding: 14px;
  border: 1px solid #f0ebe7;
}
</style>
