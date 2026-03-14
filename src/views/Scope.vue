<template>
  <div class="scope-page">
    <h1 class="page-title">运势</h1>
    <p class="page-desc">输入出生信息与推运日期，查看日/周/月/年运势</p>

    <div class="scope-form card">
      <div class="form-row">
        <div class="form-group">
          <label>出生日期</label>
          <input v-model="form.birthDate" type="date" class="form-input" />
        </div>
        <div class="form-group">
          <label>出生时间</label>
          <input v-model="form.birthTime" type="time" class="form-input" step="1" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>经度</label>
          <input v-model.number="form.longitude" type="number" class="form-input" placeholder="如 116.4074" step="any" />
        </div>
        <div class="form-group">
          <label>纬度</label>
          <input v-model.number="form.latitude" type="number" class="form-input" placeholder="如 39.9042" step="any" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>推运日期</label>
          <input v-model="form.transitDate" type="date" class="form-input" />
        </div>
        <div class="form-group">
          <label>推运时间</label>
          <input v-model="form.transitTime" type="time" class="form-input" step="1" />
        </div>
      </div>
      <div class="scope-tabs">
        <button
          v-for="t in scopeTabs"
          :key="t.type"
          type="button"
          class="tab-btn"
          :class="{ active: activeTab === t.type, loading: loading && activeTab === t.type }"
          :disabled="loading"
          @click="switchTab(t.type)"
        >
          {{ loading && activeTab === t.type ? '查询中...' : t.label }}
        </button>
      </div>
    </div>

    <div v-if="error" class="error-msg card">{{ error }}</div>

    <template v-if="result && !error">
      <!-- 第一部分：左侧综合平均分 + 右侧分项竖条 -->
      <div v-if="hasScopeSummary" class="scope-summary card">
        <div class="summary-left">
          <div class="summary-label">综合</div>
          <div class="summary-avg" :class="scoreClass(scopeInfoAverage)">
            {{ scopeInfoAverage }}
          </div>
          <div v-if="result.scope_total && (result.scope_total.start_date || result.scope_total.end_date)" class="summary-range">
            {{ result.scope_total.start_date }} ～ {{ result.scope_total.end_date }}
          </div>
        </div>
        <div v-if="result.scope_info && result.scope_info.length" class="summary-bars">
          <div
            v-for="(item, i) in result.scope_info"
            :key="i"
            class="bar-wrap"
            :title="item.label + '：' + item.val"
          >
            <div class="bar-container">
              <div
                class="bar-fill"
                :class="scoreClass(item.val)"
                :style="{ height: barHeight(item.val) + '%' }"
              />
            </div>
            <span class="bar-label">{{ item.label }}</span>
          </div>
        </div>
      </div>

      <!-- 第二部分：各分项分数与描述 -->
      <div v-if="result.scope_info && result.scope_info.length" class="scope-detail card">
        <h3 class="section-title">分项详情</h3>
        <div class="detail-list">
          <div
            v-for="(item, i) in result.scope_info"
            :key="i"
            class="detail-item"
            :style="{ borderLeftColor: item.color || '#667eea' }"
          >
            <div class="detail-head">
              <span class="detail-label">{{ item.label }}</span>
              <span class="detail-val" :class="scoreClass(item.val)">{{ item.val }} 分</span>
            </div>
            <p v-if="item.content" class="detail-content">{{ item.content }}</p>
          </div>
        </div>
      </div>

      <!-- 幸运信息 -->
      <div v-if="result.luck_info && result.luck_info.length" class="luck-info card">
        <h3 class="section-title">幸运信息</h3>
        <div class="luck-tags">
          <span v-for="(luck, i) in result.luck_info" :key="i" class="luck-tag">
            {{ luck.label }}：{{ luck.val }}
          </span>
        </div>
      </div>

      <!-- 日运建议（仅日运势） -->
      <div v-if="result.comment && (result.comment.prefer || result.comment.avoid || result.comment.summary)" class="scope-comment card">
        <h3 class="section-title">运势建议</h3>
        <div class="comment-block" v-if="result.comment.prefer">
          <span class="comment-label">宜</span>
          <span>{{ result.comment.prefer }}</span>
        </div>
        <div class="comment-block" v-if="result.comment.avoid">
          <span class="comment-label avoid">忌</span>
          <span>{{ result.comment.avoid }}</span>
        </div>
        <div class="comment-block" v-if="result.comment.summary">
          <span class="comment-label">总结</span>
          <span>{{ result.comment.summary }}</span>
        </div>
      </div>

      <!-- 星宿语料 -->
      <div v-if="result.corpus && result.corpus.length" class="scope-corpus card">
        <h3 class="section-title">星宿语料</h3>
        <div class="corpus-list">
          <div
            v-for="(c, i) in result.corpus"
            :key="i"
            class="corpus-item"
            :class="getJxClass(c.jx_type)"
          >
            <div class="corpus-header">
              <span v-if="getJxClass(c.jx_type)" class="corpus-jx">{{ getJxLabel(c.jx_type) }}</span>
              <span class="corpus-title">{{ c.title }}</span>
            </div>
            <div v-if="c.tip || c.start_days_desc || c.remain_days_desc" class="corpus-meta">
              <span v-if="c.tip" class="corpus-meta-item">{{ c.tip }}</span>
              <span v-if="c.start_days_desc" class="corpus-meta-item">{{ c.start_days_desc }}</span>
              <span v-if="c.remain_days_desc" class="corpus-meta-item">{{ c.remain_days_desc }}</span>
            </div>
            <div class="corpus-content" v-html="c.content || ''"></div>
          </div>
        </div>
      </div>

      <div v-if="emptyResult" class="empty-hint card">暂无运势内容</div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { fetchScope } from '../services/scope'

const scopeTabs = [
  { type: 'day', label: '日运势' },
  { type: 'week', label: '周运势' },
  { type: 'month', label: '月运势' },
  { type: 'year', label: '年运势' }
]

function todayStr() {
  const n = new Date()
  return n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0') + '-' + String(n.getDate()).padStart(2, '0')
}

const form = ref({
  birthDate: '1990-01-01',
  birthTime: '12:00:00',
  longitude: 116.4074,
  latitude: 39.9042,
  transitDate: todayStr(),
  transitTime: '12:00:00'
})

const activeTab = ref('day')
const result = ref(null)
const loading = ref(false)
const error = ref('')

const scopeInfoAverage = computed(() => {
  const list = result.value?.scope_info
  if (!list || !list.length) return null
  const sum = list.reduce((a, b) => a + (b.val ?? 0), 0)
  return Math.round(sum / list.length)
})

const hasScopeSummary = computed(() => {
  const avg = scopeInfoAverage.value
  const list = result.value?.scope_info
  return (avg != null && !Number.isNaN(avg)) || (list && list.length > 0)
})

function barHeight(val) {
  if (val == null || Number.isNaN(Number(val))) return 0
  const n = Math.min(100, Math.max(0, Number(val)))
  return n
}

const emptyResult = computed(() => {
  const r = result.value
  if (!r) return true
  return !r.scope_total && (!r.scope_info || !r.scope_info.length) && (!r.corpus || !r.corpus.length) && !r.comment?.summary && (!r.luck_info || !r.luck_info.length)
})

function scoreClass(val) {
  if (val == null) return ''
  const n = Number(val)
  if (n >= 80) return 'score-high'
  if (n >= 60) return 'score-mid'
  return 'score-low'
}

function getJxClass(jxType) {
  if (!jxType) return ''
  const t = String(jxType).toUpperCase()
  if (t === 'JI') return 'jx-ji'
  if (t === 'XIONG') return 'jx-xiong'
  if (t === 'PING') return 'jx-ping'
  return ''
}

function getJxLabel(jxType) {
  if (!jxType) return ''
  const t = String(jxType).toUpperCase()
  if (t === 'JI') return '吉'
  if (t === 'XIONG') return '凶'
  if (t === 'PING') return '平'
  return ''
}

function getTransitDate() {
  const d = form.value.transitDate
  if (d) return d
  const now = new Date()
  return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0')
}

async function loadScope(type) {
  const f = form.value
  if (!f.birthDate || f.longitude == null || f.latitude == null) {
    error.value = '请填写出生日期与经纬度'
    return
  }
  loading.value = true
  error.value = ''
  result.value = null
  try {
    const data = await fetchScope(type, {
      birthDate: f.birthDate,
      birthTime: f.birthTime || '12:00:00',
      latitude: f.latitude,
      longitude: f.longitude,
      transitDate: getTransitDate(),
      transitTime: f.transitTime || '12:00:00',
      tz: 8,
      dst_auto: true
    })
    result.value = data
  } catch (e) {
    error.value = e?.response?.data?.msg || e?.message || '请求失败'
    result.value = null
  } finally {
    loading.value = false
  }
}

function switchTab(type) {
  activeTab.value = type
  loadScope(type)
}

onMounted(() => {
  loadScope('day')
})

watch(
  () => form.value.transitDate,
  (val) => {
    if (!val) form.value.transitDate = todayStr()
  },
  { immediate: true }
)
</script>

<style scoped>
.scope-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 20px 16px 40px;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 8px;
}

.page-desc {
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 24px;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid #eee;
}

.scope-form .form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 13px;
  color: #555;
  font-weight: 500;
}

.form-input {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.scope-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.tab-btn {
  padding: 10px 20px;
  border: 1px solid #ddd;
  background: #e8e8e8;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  color: #666;
}

.tab-btn.active {
  background: #667eea;
  color: #fff;
  border-color: #667eea;
}

.tab-btn:hover:not(.active):not(:disabled) {
  background: #ddd;
}

.tab-btn:disabled {
  cursor: not-allowed;
  opacity: 0.85;
}

.error-msg {
  color: #c00;
  font-size: 14px;
}

/* 第一部分：综合 + 竖条图 */
.scope-summary {
  display: flex;
  align-items: center;
  gap: 28px;
  padding: 24px 20px;
  min-height: 180px;
}

.summary-left {
  flex-shrink: 0;
  text-align: center;
}

.summary-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.summary-avg {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.2;
}

.summary-avg.score-high { color: #238636; }
.summary-avg.score-mid { color: #b38600; }
.summary-avg.score-low { color: #cf2222; }

.summary-avg-hint {
  font-size: 13px;
  color: #888;
  margin-top: 2px;
}

.summary-range {
  font-size: 12px;
  color: #999;
  margin-top: 10px;
}

.summary-bars {
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 12px;
  min-height: 140px;
  padding-bottom: 22px;
}

.bar-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 56px;
}

.bar-container {
  height: 100px;
  width: 24px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-bottom: 6px;
}

.bar-fill {
  width: 60%;
  min-height: 4px;
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
}

.bar-fill.score-high { background: #238636; }
.bar-fill.score-mid { background: #b38600; }
.bar-fill.score-low { background: #cf2222; }

.bar-label {
  font-size: 11px;
  color: #666;
  margin-top: 6px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.section-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 14px;
  padding-bottom: 8px;
  border-bottom: 2px solid #eee;
}

/* 第二部分：分项详情 */
.scope-detail .detail-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  padding: 14px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  background: #f8f9fa;
}

.detail-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.detail-label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.detail-val {
  font-weight: 700;
  font-size: 1rem;
}

.detail-val.score-high { color: #238636; }
.detail-val.score-mid { color: #b38600; }
.detail-val.score-low { color: #cf2222; }

.detail-content {
  font-size: 13px;
  color: #555;
  line-height: 1.5;
  margin: 0;
}

.luck-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.luck-tag {
  padding: 6px 12px;
  background: #eef2ff;
  color: #4455aa;
  border-radius: 20px;
  font-size: 13px;
}

.comment-block {
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.5;
}

.comment-block:last-child { margin-bottom: 0; }

.comment-label {
  display: inline-block;
  margin-right: 8px;
  font-weight: 600;
  color: #238636;
  min-width: 36px;
}

.comment-label.avoid { color: #cf2222; }

.corpus-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.corpus-item {
  padding: 14px;
  border-radius: 8px;
  background: #f8f9fa;
  border-left: 4px solid #667eea;
}

.corpus-item.jx-ji { border-left-color: #238636; }
.corpus-item.jx-xiong { border-left-color: #cf2222; }
.corpus-item.jx-ping { border-left-color: #4455aa; }

.corpus-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.corpus-jx {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 600;
  background: #e6f4ea;
  color: #238636;
  border: 1px solid #c5e6cf;
}

.corpus-item.jx-xiong .corpus-jx {
  background: #fdecec;
  color: #cf2222;
  border-color: #f7c3c3;
}

.corpus-item.jx-ping .corpus-jx {
  background: #eef2ff;
  color: #4455aa;
  border-color: #d1d9ff;
}

.corpus-title {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.corpus-meta {
  font-size: 11px;
  color: #888;
  margin-bottom: 6px;
}

.corpus-meta-item { margin-right: 10px; }

.corpus-content {
  font-size: 13px;
  color: #555;
  line-height: 1.6;
}

.corpus-content :deep(p) { margin: 0 0 0.5em; }
.corpus-content :deep(p:last-child) { margin-bottom: 0; }

.empty-hint {
  text-align: center;
  color: #999;
  padding: 40px 20px;
}

@media (max-width: 600px) {
  .scope-form .form-row {
    grid-template-columns: 1fr;
  }

  .scope-tabs {
    justify-content: flex-start;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
