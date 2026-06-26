<template>
  <div class="qimen-page">
    <h1 class="page-title">奇门遁甲</h1>

    <div class="query-card">
      <div class="qimen-tabs" role="tablist">
        <button
          v-for="tab in QIMEN_QIJU_OPTIONS"
          :key="tab.type"
          type="button"
          role="tab"
          class="qimen-tab"
          :class="{ 'is-active': activeTab === tab.type }"
          :aria-selected="activeTab === tab.type"
          @click="switchTab(tab.type)"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="tab-panel" role="tabpanel">
        <!-- 时家 -->
        <template v-if="activeTab === 'shijia'">
          <div class="form-row">
            <div class="form-item">
              <label for="shijiaDate">查询日期</label>
              <input id="shijiaDate" v-model="shijiaForm.date" type="date" required>
            </div>
            <div class="form-item">
              <label for="shijiaTime">查询时间</label>
              <input id="shijiaTime" v-model="shijiaForm.time" type="time" step="1" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-item">
              <label for="shijiaJuMethod">定局法</label>
              <select id="shijiaJuMethod" v-model="shijiaForm.juMethod" class="field-select">
                <option v-for="jm in shijiaJuMethods" :key="jm.value" :value="jm.value">
                  {{ jm.label }}
                </option>
              </select>
            </div>
            <div class="form-item">
              <label for="shijiaPaiMethod">排盘方式</label>
              <select id="shijiaPaiMethod" v-model="shijiaForm.paiMethod" class="field-select">
                <option v-for="pm in shijiaPaiMethods" :key="pm.value" :value="pm.value">
                  {{ pm.label }}
                </option>
              </select>
            </div>
          </div>
        </template>

        <!-- 日家 -->
        <template v-else-if="activeTab === 'rijia'">
          <div class="form-row">
            <div class="form-item form-item--full">
              <label for="rijiaDate">查询日期</label>
              <input id="rijiaDate" v-model="rijiaForm.date" type="date" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-item form-item--full">
              <label for="rijiaJuMethod">定局法</label>
              <select id="rijiaJuMethod" v-model="rijiaForm.juMethod" class="field-select">
                <option v-for="jm in rijiaJuMethods" :key="jm.value" :value="jm.value">
                  {{ jm.label }}
                </option>
              </select>
            </div>
          </div>
        </template>

        <!-- 山向 -->
        <template v-else-if="activeTab === 'shanxiang'">
          <div class="form-row">
            <div class="form-item form-item--full">
              <label for="shanYear">查询年份</label>
              <input
                id="shanYear"
                v-model.number="shanxiangForm.year"
                type="number"
                min="1900"
                max="2100"
                step="1"
                required
              >
            </div>
          </div>
          <div class="form-row">
            <div class="form-item form-item--shan-group form-item--full">
              <label for="shanMount">山向坐向</label>
              <div class="shan-select-group">
                <select
                  id="shanMount"
                  v-model="shanxiangForm.shanMount"
                  class="field-select shan-select-group__mount"
                  @change="onShanMountChange"
                >
                  <option v-for="s in QIMEN_SHAN_MOUNT_OPTIONS" :key="s.value" :value="s.value">
                    {{ s.label }}
                  </option>
                </select>
                <select
                  id="shanYuan"
                  v-model="shanxiangForm.shanYuan"
                  class="field-select shan-select-group__yuan"
                  aria-label="罗经度数"
                >
                  <option
                    v-for="seg in shanMountSegments"
                    :key="seg.yuan"
                    :value="seg.yuan"
                  >
                    {{ formatShanMountSegmentLabel(seg) }}
                  </option>
                </select>
              </div>
              <p v-if="selectedShanMount && selectedShanMountSegment" class="shan-mount-hint">
                坐{{ formatShanDegreeDisplay(selectedShanMount.mountDegree) }}
                · 向{{ formatShanDegreeDisplay(selectedShanMount.facingDegree) }}
                · 罗盘 {{ selectedShanMountSegment.degreeRange }}
              </p>
            </div>
          </div>
        </template>

        <div v-if="activeTab !== 'shanxiang'" class="form-row">
          <div class="form-item">
            <label for="longitude">经度</label>
            <input
              id="longitude"
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
            <label class="checkbox-label">
              <input v-model="shared.withLiuren" type="checkbox">
              奇门穿壬
            </label>
          </div>
        </div>

        <details v-if="activeTab !== 'shanxiang'" class="advanced-details">
          <summary>高级</summary>
          <div v-if="currentPaiMethod === 'feipan'" class="form-row">
            <div class="form-item">
              <label for="feipanStyle">飞盘类型</label>
              <select
                id="feipanStyle"
                v-model="currentFeipanStyle"
                class="field-select"
              >
                <option
                  v-for="fs in QIMEN_FEIPAN_STYLE_OPTIONS"
                  :key="fs.value"
                  :value="fs.value"
                >
                  {{ fs.label }}
                </option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-item">
              <label for="tz">时区</label>
              <input id="tz" v-model.number="shared.tz" type="number" step="1" min="-12" max="14">
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
      <QimenMetaPanel :data="result" />
      <QimenPalaceGrid :data="result" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import {
  fetchQimen,
  QIMEN_QIJU_OPTIONS,
  QIMEN_SHAN_MOUNT_OPTIONS,
  QIMEN_FEIPAN_STYLE_OPTIONS,
  QIMEN_FEIPAN_STYLE_DEFAULT,
  formatShanMountSegmentLabel,
  formatShanDegreeDisplay,
  findShanMountOption,
  findShanMountSegment,
  getShanMountSegments,
  getJuMethodOptions,
  getPaiMethodOptions,
  defaultJuMethodForType,
  defaultShanMount,
  defaultShanYuan
} from '../../services/qimen'
import { extractQimenError } from '../../composables/useQimen'
import QimenMetaPanel from '../../components/qimen/QimenMetaPanel.vue'
import QimenPalaceGrid from '../../components/qimen/QimenPalaceGrid.vue'
import '../../assets/styles/qimen.css'
import '../../assets/styles/qimen-theme.css'

const activeTab = ref('shijia')

const shared = reactive({
  longitude: 116.4074,
  isSolarTime: true,
  withLiuren: false,
  tz: 8
})

const shijiaForm = reactive({
  date: '2026-05-12',
  time: '19:31:00',
  juMethod: 'chaibu',
  paiMethod: 'zhuanpan',
  feipanStyle: QIMEN_FEIPAN_STYLE_DEFAULT
})

const rijiaForm = reactive({
  date: '2026-05-12',
  juMethod: defaultJuMethodForType('rijia')
})

const shanxiangForm = reactive({
  year: 2026,
  shanMount: defaultShanMount(),
  shanYuan: defaultShanYuan()
})

const loading = ref(false)
const error = ref('')
const result = ref(null)

const shijiaJuMethods = computed(() => getJuMethodOptions('shijia'))
const rijiaJuMethods = computed(() => getJuMethodOptions('rijia'))
const shijiaPaiMethods = computed(() => getPaiMethodOptions('shijia'))

const selectedShanMount = computed(() => findShanMountOption(shanxiangForm.shanMount))
const shanMountSegments = computed(() => getShanMountSegments(shanxiangForm.shanMount))
const selectedShanMountSegment = computed(() =>
  findShanMountSegment(shanxiangForm.shanMount, shanxiangForm.shanYuan)
)

const currentPaiMethod = computed(() => {
  if (activeTab.value === 'shijia') return shijiaForm.paiMethod
  return 'zhuanpan'
})

const currentFeipanStyle = computed({
  get() {
    if (activeTab.value === 'shijia') return shijiaForm.feipanStyle
    return QIMEN_FEIPAN_STYLE_DEFAULT
  },
  set(v) {
    if (activeTab.value === 'shijia') shijiaForm.feipanStyle = v
  }
})

function switchTab(type) {
  if (activeTab.value === type) return
  activeTab.value = type
  error.value = ''
  result.value = null
}

function onShanMountChange() {
  shanxiangForm.shanYuan = defaultShanYuan()
}

function buildForm() {
  const type = activeTab.value

  if (type === 'shijia') {
    return {
      type,
      date: shijiaForm.date,
      time: shijiaForm.time,
      juMethod: shijiaForm.juMethod,
      paiMethod: shijiaForm.paiMethod,
      feipanStyle: shijiaForm.paiMethod === 'feipan' ? shijiaForm.feipanStyle : undefined,
      longitude: shared.longitude,
      isSolarTime: shared.isSolarTime,
      withLiuren: shared.withLiuren,
      tz: shared.tz
    }
  }

  if (type === 'rijia') {
    return {
      type,
      date: rijiaForm.date,
      juMethod: rijiaForm.juMethod,
      paiMethod: 'zhuanpan',
      longitude: shared.longitude,
      isSolarTime: shared.isSolarTime,
      withLiuren: shared.withLiuren,
      tz: shared.tz
    }
  }

  return {
    type,
    year: shanxiangForm.year,
    shanMount: shanxiangForm.shanMount,
    yuan: shanxiangForm.shanYuan
  }
}

function validateForm() {
  const type = activeTab.value

  if (type === 'shijia') {
    if (!shijiaForm.date || !shijiaForm.time) return '请填写查询日期与时间'
    if (!shijiaForm.juMethod) return '请选择定局法'
    return ''
  }

  if (type === 'rijia') {
    if (!rijiaForm.date) return '请填写查询日期'
    if (!rijiaForm.juMethod) return '请选择定局法'
    return ''
  }

  if (!shanxiangForm.year || shanxiangForm.year < 1900 || shanxiangForm.year > 2100) {
    return '请填写有效年份'
  }
  if (!shanxiangForm.shanMount) return '山向奇门须选择山向'
  if (!selectedShanMountSegment.value) return '请选择罗经度数细项'
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

  try {
    const res = await fetchQimen(buildForm())
    if (res?.code === 0 && res?.data) {
      const form = buildForm()
      result.value = {
        ...res.data,
        pai_method: res.data.pai_method ?? form.paiMethod,
        feipan_style: res.data.feipan_style ?? form.feipanStyle
      }
    } else {
      error.value = res?.msg || '排盘失败，请稍后重试'
    }
  } catch (e) {
    error.value = extractQimenError(e)
  } finally {
    loading.value = false
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

.qimen-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 14px;
  padding: 4px;
  background: #faf8f6;
  border-radius: 10px;
}

.qimen-tab {
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

.qimen-tab.is-active {
  background: #fff;
  color: #8b7355;
  box-shadow: 0 1px 4px rgba(139, 115, 85, 0.12);
}

.qimen-tab:hover:not(.is-active) {
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

.shan-select-group {
  display: flex;
  gap: 6px;
}

.shan-select-group__mount {
  flex: 1.15;
  min-width: 0;
  font-size: 13px;
}

.shan-select-group__yuan {
  flex: 1;
  min-width: 0;
  font-size: 13px;
}

.form-item--shan-group .shan-mount-hint {
  margin: 6px 0 0;
  font-size: 11px;
  line-height: 1.45;
  color: #999;
}

.form-item--check,
.form-item--checks {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 12px;
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
  background: #8b7355;
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
