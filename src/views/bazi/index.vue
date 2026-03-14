<template>
  <div class="birthday-page">
    <router-link to="/bazi/match" class="match-link">合盘</router-link>
    <div class="query-card">
      <div class="form-row">
        <div class="form-item">
          <label for="birthDate">出生日期</label>
          <input id="birthDate" v-model="birthDate" type="date" required>
        </div>
        <div class="form-item">
          <label for="birthTime">出生时间</label>
          <input id="birthTime" v-model="birthTime" type="time" required>
        </div>
      </div>
      <button type="button" class="submit-btn" :disabled="loading" @click="onSubmit">
        {{ loading ? '测算中...' : '重新测算' }}
      </button>
    </div>

    <div v-if="loading" class="status-card">测算中...</div>
    <div v-else-if="error" class="status-card error">{{ error }}</div>

    <div v-else class="panel-wrap">
      <div class="tab-switch">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'natal' }"
          @click="activeTab = 'natal'"
        >
          生辰
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'flow' }"
          @click="switchToFlow"
        >
          流盘
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'summary' }"
          @click="switchToSummary"
        >
          综合
        </button>
      </div>

      <BaziNatal v-if="activeTab === 'natal' && natalData" :data="natalData" />
      <BaziFlow v-else-if="activeTab === 'flow' && flowData" :data="flowData" />
      <BaziSummary v-else-if="activeTab === 'summary' && summaryData" :data="summaryData" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchBaziFlow, fetchBaziNatal, fetchBaziSummary } from '../../services/bazi'
import { buildBaziQry } from '../../composables/useBazi'
import BaziNatal from './BaziNatal.vue'
import BaziFlow from './BaziFlow.vue'
import BaziSummary from './BaziSummary.vue'

const now = new Date()
const birthDate = ref('2008-01-10')
const birthTime = ref(now.toTimeString().slice(0, 8))
const loading = ref(false)
const error = ref('')
const activeTab = ref('natal')

const natalData = ref(null)
const flowData = ref(null)
const summaryData = ref(null)

const fetchNatal = async () => {
  if (!birthDate.value || !birthTime.value) {
    error.value = '请填写完整的出生信息'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const res = await fetchBaziNatal(buildBaziQry(birthDate.value, birthTime.value))
    if (res?.code === 0 && res?.data) {
      natalData.value = res.data
    } else {
      natalData.value = null
      error.value = res?.msg || '获取生辰数据失败，请稍后重试'
    }
  } catch {
    natalData.value = null
    error.value = '获取生辰数据失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const fetchFlow = async () => {
  if (!birthDate.value || !birthTime.value) {
    error.value = '请填写完整的出生信息'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const flowQry = {
      ...buildBaziQry(birthDate.value, birthTime.value),
      target_dt: `${birthDate.value} ${birthTime.value}`
    }
    const res = await fetchBaziFlow(flowQry)
    if (res?.code === 0 && res?.data) {
      flowData.value = res.data
    } else {
      flowData.value = null
      error.value = res?.msg || '获取流盘数据失败，请稍后重试'
    }
  } catch {
    flowData.value = null
    error.value = '获取流盘数据失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const switchToFlow = () => {
  activeTab.value = 'flow'
  fetchFlow()
}

const fetchSummary = async () => {
  if (!birthDate.value || !birthTime.value) {
    error.value = '请填写完整的出生信息'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const res = await fetchBaziSummary(buildBaziQry(birthDate.value, birthTime.value))
    if (res?.code === 0 && res?.data) {
      summaryData.value = res.data
    } else {
      summaryData.value = null
      error.value = res?.msg || '获取综合数据失败，请稍后重试'
    }
  } catch {
    summaryData.value = null
    error.value = '获取综合数据失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const switchToSummary = () => {
  activeTab.value = 'summary'
  fetchSummary()
}

/** 提交表单：根据当前 tab 重新请求对应接口 */
const onSubmit = () => {
  if (activeTab.value === 'natal') {
    fetchNatal()
  } else if (activeTab.value === 'flow') {
    fetchFlow()
  } else {
    fetchSummary()
  }
}

onMounted(() => {
  fetchNatal()
})
</script>

<style scoped>
.birthday-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 12px;
  position: relative;
}

.match-link {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 14px;
  color: #8b7355;
  text-decoration: none;
}

.match-link:hover {
  text-decoration: underline;
}

.query-card {
  background: #fff;
  border-radius: 14px;
  padding: 12px;
  margin-bottom: 12px;
}

.form-row {
  display: flex;
  gap: 8px;
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

.form-item input {
  width: 100%;
  border: 1px solid #ece3dc;
  border-radius: 8px;
  padding: 8px;
  font-size: 14px;
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
}

.status-card.error {
  color: #cf5a5a;
}

.panel-wrap {
  background: #fff;
  border-radius: 16px;
  padding: 12px;
}

.tab-switch {
  display: flex;
  background: #f5eee9;
  border-radius: 22px;
  padding: 4px;
  margin-bottom: 12px;
}

.tab-btn {
  flex: 1;
  border: 0;
  background: transparent;
  border-radius: 18px;
  padding: 8px 0;
  font-size: 16px;
  color: #9a8a7d;
  cursor: pointer;
}

.tab-btn.active {
  background: #fff;
  color: #111;
  font-weight: 600;
}

/* 本命/流盘子组件共用样式 */
.panel-wrap :deep(.bazi-card) {
  border: 1px solid #f0ebe7;
  border-radius: 14px;
  overflow: hidden;
}

.panel-wrap :deep(.meta-wrap) {
  padding: 10px 12px;
  background: #fff;
}

.panel-wrap :deep(.meta-line) {
  font-size: 12px;
  color: #666;
  line-height: 1.8;
}

.panel-wrap :deep(.bazi-table) {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.panel-wrap :deep(.bazi-table.flow-table .cell-char) {
  min-height: 52px !important;
}

.panel-wrap :deep(.bazi-table th),
.panel-wrap :deep(.bazi-table td) {
  min-height: 34px;
  border: 1px solid #f2f2f2;
  text-align: center;
  padding: 4px;
  font-size: 13px;
  word-break: break-word;
  vertical-align: middle;
}

.panel-wrap :deep(.bazi-table td.multi-line) {
  vertical-align: top;
}

.panel-wrap :deep(.bazi-table th) {
  font-weight: 600;
  background: #faf6f3;
}

.panel-wrap :deep(.left-label) {
  text-align: center;
  color: #4f4f4f !important;
  background: #fafafa;
  width: 58px;
}

.panel-wrap :deep(.bazi-table td.text-left) {
  text-align: left;
  padding-left: 10px;
}

.panel-wrap :deep(.corner-cell) {
  width: 58px;
  background: #faf6f3;
}

.panel-wrap :deep(.cell-char) {
  font-size: 26px !important;
  font-weight: 400;
  line-height: 1;
  min-height: 72px !important;
}

.panel-wrap :deep(.multi-line) {
  white-space: pre-line;
  line-height: 1.5;
}

.panel-wrap :deep(.multi-line.long) {
  min-height: 72px !important;
}

.panel-wrap :deep(.wood) { color: #5da174; }
.panel-wrap :deep(.fire) { color: #db6473; }
.panel-wrap :deep(.earth) { color: #9b6f4e; }
.panel-wrap :deep(.metal) { color: #c98d47; }
.panel-wrap :deep(.water) { color: #5ea6d8; }

.panel-wrap :deep(.flow-section) {
  border-top: 1px solid #f2f2f2;
  padding: 10px 10px 12px;
}

.panel-wrap :deep(.chongke-section) {
  border-top: 1px solid #f2f2f2;
  padding: 10px 12px;
}

.panel-wrap :deep(.chongke-table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  color: #666;
}

.panel-wrap :deep(.chongke-table td) {
  border: 1px solid #f2f2f2;
  padding: 6px 8px;
  text-align: left;
  vertical-align: top;
}

.panel-wrap :deep(.chongke-table .chongke-label) {
  width: 48px;
  text-align: center;
  color: #4f4f4f;
  font-weight: 500;
}

.panel-wrap :deep(.chongke-table .chongke-col) {
  width: 56px;
  color: #333;
  font-weight: 500;
}

.panel-wrap :deep(.strip-head-row) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.panel-wrap :deep(.strip-head-row .strip-head) {
  margin-bottom: 0;
}

.panel-wrap :deep(.strip-head-extra) {
  font-size: 12px;
  color: #666;
  line-height: 1.8;
}

.panel-wrap :deep(.strip-head) {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.panel-wrap :deep(.flow-strip-wrap) {
  width: 100%;
}

.panel-wrap :deep(.flow-strip-wrap-fill) {
  overflow: visible;
}

.panel-wrap :deep(.flow-strip-wrap-fill .flow-strip-table) {
  table-layout: fixed;
  width: 100%;
}

.panel-wrap :deep(.flow-strip-wrap-scroll) {
  overflow-x: auto;
}

.panel-wrap :deep(.flow-strip-wrap-scroll .flow-strip-table) {
  table-layout: fixed;
  min-width: max-content;
}

.panel-wrap :deep(.flow-strip-wrap-scroll .flow-strip-cell) {
  min-width: 48px;
}

.panel-wrap :deep(.flow-strip-table) {
  border-collapse: collapse;
  font-size: 12px;
}

.panel-wrap :deep(.flow-strip-cell) {
  padding: 4px 6px;
  text-align: center;
  vertical-align: middle;
  background: #fff;
  border: 1px solid #f2f2f2;
}

.panel-wrap :deep(.flow-strip-cell.current) {
  background: #fef4ef;
}

.panel-wrap :deep(.flow-strip-cell.flow-strip-sub) {
  font-size: 11px;
  color: #888;
}

.panel-wrap :deep(.flow-strip-cell.flow-strip-gz) {
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}

.panel-wrap :deep(.flow-strip-shen-sha) {
  font-size: 11px;
  color: #888;
  margin-left: 4px;
}

.panel-wrap :deep(.strip-list) {
  display: flex;
  overflow-x: auto;
  gap: 8px;
}

.panel-wrap :deep(.strip-list-fill) {
  width: 100%;
  overflow: visible;
}

.panel-wrap :deep(.strip-list-fill .strip-item) {
  flex: 1 1 0;
  min-width: 0;
}

.panel-wrap :deep(.strip-list-scroll) {
  overflow-x: auto;
}

.panel-wrap :deep(.strip-list-scroll .strip-item) {
  flex: 0 0 auto;
  min-width: 48px;
}

.panel-wrap :deep(.strip-item) {
  min-width: 48px;
  padding: 4px 6px;
  background: #fff;
  text-align: center;
}

.panel-wrap :deep(.strip-item.current) {
  background: #fef4ef;
}

.panel-wrap :deep(.strip-key) {
  font-size: 12px;
  color: #666;
}

.panel-wrap :deep(.strip-sub-key) {
  font-size: 11px;
  color: #888;
  margin-top: 2px;
}

.panel-wrap :deep(.strip-item-four .strip-row-gz) {
  margin-top: 2px;
  line-height: 1.2;
  text-align: center;
  white-space: nowrap;
}

.panel-wrap :deep(.strip-item-four .strip-tg),
.panel-wrap :deep(.strip-item-four .strip-dz) {
  font-size: 18px;
  font-weight: 600;
}

.panel-wrap :deep(.strip-item-four .strip-shen-sha) {
  font-size: 11px;
  color: #888;
  margin-left: 4px;
}

.panel-wrap :deep(.strip-gz) {
  margin-top: 4px;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}
</style>
