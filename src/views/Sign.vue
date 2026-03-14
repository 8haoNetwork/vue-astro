<template>
  <div class="sign-page">
    <h1 class="page-title">星座</h1>
    <p class="page-desc">星座列表、星座配对与我的星座</p>

    <div class="sign-tabs card">
      <button
        v-for="t in signTabs"
        :key="t.type"
        type="button"
        class="tab-btn"
        :class="{ active: activeTab === t.type }"
        @click="activeTab = t.type"
      >
        {{ t.label }}
      </button>
    </div>

    <!-- 星座列表 -->
    <template v-if="activeTab === 'list'">
      <div v-if="listError" class="error-msg card">{{ listError }}</div>
      <div v-else class="sign-list card">
        <div v-if="listLoading" class="loading-hint">加载中...</div>
        <div v-else class="sign-grid">
          <div
            v-for="s in signList"
            :key="s.id"
            class="sign-card"
            :class="{ selected: selectedSignId === s.id }"
            @click="selectSign(s)"
          >
            <img v-if="s.img_url || s.circle_img_url" :src="s.circle_img_url || s.img_url" :alt="s.name" class="sign-card-img" />
            <div class="sign-card-placeholder" v-else />
            <div class="sign-card-name">{{ s.name }}</div>
            <div class="sign-card-en">{{ s.en_name }}</div>
            <div v-if="s.attr" class="sign-card-attr">{{ s.attr }}</div>
            <div v-if="s.date" class="sign-card-date">{{ s.date }}</div>
          </div>
        </div>
      </div>
      <!-- 星座详情（选中后展示） -->
      <div v-if="selectedSignId && signDetail" class="sign-detail card">
        <h3 class="section-title">{{ signDetail.name }} 详情</h3>
        <div v-if="signDetail.details && signDetail.details.length" class="detail-list">
          <div v-for="(d, i) in signDetail.details" :key="i" class="detail-item">
            <span v-if="d.label" class="detail-label">{{ d.label }}</span>
            <span class="detail-info">{{ d.info }}</span>
          </div>
        </div>
        <p v-else class="no-detail">暂无详细说明</p>
      </div>
    </template>

    <!-- 星座匹配 -->
    <template v-if="activeTab === 'compat'">
      <div class="compat-form card">
        <label class="compat-label">选择星座查看配对</label>
        <select v-model="compatSignId" class="form-input compat-select" @change="loadCompat">
          <option :value="null">请选择星座</option>
          <option v-for="s in signList" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </div>
      <div v-if="compatError" class="error-msg card">{{ compatError }}</div>
      <div v-else-if="compatLoading" class="loading-msg card">加载中...</div>
      <div v-else-if="compatList.length" class="compat-list card">
        <h3 class="section-title">配对结果</h3>
        <div v-for="(c, i) in compatList" :key="i" class="compat-item">
          <div class="compat-head">
            <img v-if="c.to_img_url" :src="c.to_img_url" :alt="c.to_sign_name" class="compat-img" />
            <span class="compat-pair">{{ c.from_sign_name }} × {{ c.to_sign_name }}</span>
            <span class="compat-score">契合度 {{ c.score }}</span>
          </div>
          <p v-if="c.comment" class="compat-comment">{{ c.comment }}</p>
          <div class="compat-desc">
            <p v-if="c.male_desc"><span class="desc-tag">男-女</span> {{ c.male_desc }}</p>
            <p v-if="c.female_desc"><span class="desc-tag">女-男</span> {{ c.female_desc }}</p>
          </div>
        </div>
      </div>
      <div v-else-if="compatSignId && !compatLoading" class="empty-hint card">暂无配对数据</div>
    </template>

    <!-- 我的星座 -->
    <template v-if="activeTab === 'mine'">
      <div class="my-sign-form card">
        <div class="form-row">
          <div class="form-group">
            <label>出生日期</label>
            <input v-model="mySignForm.birthDate" type="date" class="form-input" />
          </div>
          <div class="form-group">
            <label>出生时间</label>
            <input v-model="mySignForm.birthTime" type="time" class="form-input" step="1" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>经度</label>
            <input v-model.number="mySignForm.longitude" type="number" class="form-input" placeholder="如 116.4074" step="any" />
          </div>
          <div class="form-group">
            <label>纬度</label>
            <input v-model.number="mySignForm.latitude" type="number" class="form-input" placeholder="如 39.9042" step="any" />
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-primary" :disabled="mySignLoading" @click="loadMySign">
            {{ mySignLoading ? '查询中...' : '查询我的星座' }}
          </button>
        </div>
      </div>
      <div v-if="mySignError" class="error-msg card">{{ mySignError }}</div>
      <template v-else-if="mySignResult">
        <div class="my-sign-result card">
          <h3 class="section-title">我的星座</h3>
          <div v-if="matchedSignsList.length" class="matched-block">
            <div class="matched-title">匹配星座</div>
            <div class="matched-tags">
              <span v-for="(s, i) in matchedSignsList" :key="i" class="matched-tag">{{ s }}</span>
            </div>
          </div>
          <div v-if="mySignResult.hidden_skill" class="result-block">
            <span class="result-label">隐藏技能</span>
            <span>{{ mySignResult.hidden_skill }}</span>
          </div>
          <div v-if="mySignResult.scope_summary" class="result-block">
            <span class="result-label">运势总结</span>
            <span>{{ mySignResult.scope_summary }}</span>
          </div>
          <div v-if="mySignResult.scope_prefer" class="result-block prefer">
            <span class="result-label">宜</span>
            <span>{{ mySignResult.scope_prefer }}</span>
          </div>
          <div v-if="mySignResult.scope_avoid" class="result-block avoid">
            <span class="result-label">忌</span>
            <span>{{ mySignResult.scope_avoid }}</span>
          </div>
          <div v-if="mySignResult.luck_info && mySignResult.luck_info.length" class="luck-info">
            <span class="result-label">幸运信息</span>
            <div class="luck-tags">
              <span v-for="(luck, i) in mySignResult.luck_info" :key="i" class="luck-tag">
                {{ luck.label }}：{{ luck.val }}
              </span>
            </div>
          </div>
          <div v-if="mySignResult.sign_explains && mySignResult.sign_explains.length" class="sign-explains">
            <h4 class="subsection-title">行星星座解释</h4>
            <div v-for="(item, i) in explainItemsWithBlocks" :key="i" class="explain-card">
              <div class="explain-head">
                <div class="explain-left">
                  <span class="explain-label">{{ item.e.pl }} · {{ item.e.sign }}</span>
                  <span v-if="item.e.tag" class="explain-tag" :class="tagClass(item.e.tag)">{{ item.e.tag }}</span>
                </div>
              </div>

              <div class="explain-block-head">
                <span class="explain-block-cat" :class="categoryClass(item.block.label)">{{ categoryLabel(item.block.label) }}</span>
                <span class="explain-block-stars">
                  <span v-for="idx in 5" :key="idx" class="star" :class="{ on: idx <= summaryBlockStars(item.block.val) }">★</span>
                </span>
              </div>
              <p v-if="item.block.content" class="explain-block-content">{{ item.block.content }}</p>

            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { fetchSigns, fetchSignDetail, fetchSignCompat, fetchMySign } from '../services/sign'

const signTabs = [
  { type: 'list', label: '星座列表' },
  { type: 'compat', label: '星座匹配' },
  { type: 'mine', label: '我的星座' }
]

const activeTab = ref('list')

// 星座列表
const signList = ref([])
const listLoading = ref(false)
const listError = ref('')
const selectedSignId = ref(null)
const signDetail = ref(null)
const detailLoading = ref(false)

// 星座匹配
const compatSignId = ref(null)
const compatList = ref([])
const compatLoading = ref(false)
const compatError = ref('')

// 我的星座
const mySignForm = ref({
  birthDate: '1990-01-01',
  birthTime: '12:00:00',
  longitude: 116.4074,
  latitude: 39.9042
})
const mySignResult = ref(null)
const mySignLoading = ref(false)
const mySignError = ref('')

const matchedSignsList = computed(() => {
  const s = mySignResult.value?.matched_signs
  if (!s) return []
  if (Array.isArray(s)) return s.filter(Boolean).map(String)
  const raw = String(s)
  return raw
    .split(/[,，、/\\s]+/g)
    .map((x) => x.trim())
    .filter(Boolean)
})

/** 行星星座解释列表，后端固定返回 summary 为 { label, val, content }，预计算 block */
const explainItemsWithBlocks = computed(() => {
  const list = mySignResult.value?.sign_explains || []
  return list.map((e) => ({ e, block: getExplainBlock(e) }))
})

async function loadSignList() {
  listLoading.value = true
  listError.value = ''
  try {
    const data = await fetchSigns()
    signList.value = Array.isArray(data) ? data : []
    if (signList.value.length && !compatSignId.value) compatSignId.value = signList.value[0].id
  } catch (e) {
    listError.value = e?.response?.data?.msg || e?.message || '获取星座列表失败'
    signList.value = []
  } finally {
    listLoading.value = false
  }
}

async function selectSign(sign) {
  selectedSignId.value = sign.id
  signDetail.value = null
  detailLoading.value = true
  try {
    signDetail.value = await fetchSignDetail(sign.id)
  } catch (e) {
    signDetail.value = null
  } finally {
    detailLoading.value = false
  }
}

async function loadCompat() {
  if (!compatSignId.value) {
    compatList.value = []
    return
  }
  compatLoading.value = true
  compatError.value = ''
  compatList.value = []
  try {
    const data = await fetchSignCompat(compatSignId.value)
    if (data && typeof data === 'object') {
      const arr = []
      Object.values(data).forEach(v => {
        if (Array.isArray(v)) arr.push(...v)
      })
      compatList.value = arr
    }
  } catch (e) {
    compatError.value = e?.response?.data?.msg || e?.message || '获取配对失败'
  } finally {
    compatLoading.value = false
  }
}

async function loadMySign() {
  const f = mySignForm.value
  if (!f.birthDate || f.longitude == null || f.latitude == null) {
    mySignError.value = '请填写出生日期与经纬度'
    return
  }
  mySignLoading.value = true
  mySignError.value = ''
  mySignResult.value = null
  try {
    mySignResult.value = await fetchMySign({
      birthDate: f.birthDate,
      birthTime: f.birthTime || '12:00:00',
      longitude: f.longitude,
      latitude: f.latitude
    })
  } catch (e) {
    mySignError.value = e?.response?.data?.msg || e?.message || '查询失败'
  } finally {
    mySignLoading.value = false
  }
}

function tagClass(tag) {
  const t = String(tag || '').toLowerCase()
  if (t === 'up') return 'is-up'
  if (t === 'down') return 'is-down'
  return ''
}

function parsedExplainSummary(summary) {
  if (summary == null) return { items: [], raw: '' }
  let raw = ''
  let obj = summary
  if (typeof summary === 'string') {
    raw = summary
    const txt = summary.trim()
    if ((txt.startsWith('{') && txt.endsWith('}')) || (txt.startsWith('[') && txt.endsWith(']'))) {
      try {
        obj = JSON.parse(txt)
      } catch {
        obj = summary
      }
    }
  } else if (typeof summary === 'object') {
    raw = JSON.stringify(summary, null, 2)
  }

  const items = []
  if (Array.isArray(obj)) {
    obj.forEach((v, idx) => {
      if (v && typeof v === 'object') {
        Object.entries(v).forEach(([k, val]) => items.push({ k, v: String(val ?? '') }))
      } else {
        items.push({ k: String(idx + 1), v: String(v ?? '') })
      }
    })
  } else if (obj && typeof obj === 'object') {
    Object.entries(obj).forEach(([k, val]) => {
      if (val == null) return
      if (typeof val === 'object') items.push({ k, v: JSON.stringify(val) })
      else items.push({ k, v: String(val) })
    })
  }

  const trimmedRaw = typeof raw === 'string' ? raw.trim() : ''
  return { items, raw: trimmedRaw }
}

function overallStars(n) {
  if (!Number.isFinite(Number(n))) return 0
  const v = Math.max(0, Math.min(100, Number(n)))
  return Math.max(1, Math.min(5, Math.round(v / 20)))
}

/**
 * 解析 SignExplainVo.summary（openapi：详细描述，JSON 格式）
 * 内容为 { label, val, content } 或 [{ label, val, content }]，label 对应爱情/财富/健康/事业等
 */
function summaryBlock(summary) {
  if (summary == null) return null
  let obj = summary
  if (typeof summary === 'string') {
    const txt = String(summary).trim()
    if (!txt) return null
    try {
      obj = JSON.parse(txt)
    } catch {
      if (txt.startsWith('{') || txt.startsWith('[')) return null
      return null
    }
  }
  if (!obj || typeof obj !== 'object') return null
  const single = Array.isArray(obj) ? obj[0] : obj
  if (!single || typeof single !== 'object') return null
  const val = single.val != null ? Number(single.val) : NaN
  const content = single.content != null ? String(single.content).trim() : ''
  if (!Number.isFinite(val) && !content) return null
  return {
    label: single.label != null ? single.label : '',
    val: Number.isFinite(val) ? val : 0,
    content
  }
}

/**
 * 取当前条的展示 block：按 openapi SignExplainVo，优先用 e.summary（详细描述 JSON）；
 * 若 summary 解析不出 block，再尝试本条顶层 e 上的 label/val/content（兼容部分实现）
 */
function getExplainBlock(e) {
  if (!e) return null
  const fromSummary = summaryBlock(e.summary)
  if (fromSummary) return fromSummary
  const val = e.val != null ? Number(e.val) : NaN
  const content = e.content != null ? String(e.content).trim() : ''
  if (!Number.isFinite(val) && !content) return null
  return {
    label: e.label != null ? e.label : '',
    val: Number.isFinite(val) ? val : 0,
    content
  }
}

/** 0–100 分换算为 1–5 星，与 overallStars 一致 */
function summaryBlockStars(val) {
  return overallStars(val)
}

// label / summary 键 与 爱情、财富、健康、事业 等对应展示
const CATEGORY_MAP = {
  overall: '综合',
  love: '爱情',
  wealth: '财富',
  health: '健康',
  career: '事业'
}

function categoryLabel(key) {
  if (key == null) return ''
  const k = String(key).trim()
  return CATEGORY_MAP[k] || k
}

function categoryClass(label) {
  const name = categoryLabel(label)
  if (name === '爱情') return 'cat-love'
  if (name === '财富') return 'cat-wealth'
  if (name === '健康') return 'cat-health'
  if (name === '事业') return 'cat-career'
  return ''
}

watch(activeTab, (tab) => {
  if (tab === 'compat' && signList.value.length && compatSignId.value) loadCompat()
})

onMounted(() => {
  loadSignList()
})
</script>

<style scoped>
.sign-page {
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

.sign-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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

.tab-btn:hover:not(.active) {
  background: #ddd;
}

.error-msg {
  color: #c00;
  font-size: 14px;
}

.loading-hint,
.loading-msg {
  text-align: center;
  color: #888;
}

/* 星座列表 */
.sign-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
}

.sign-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border-radius: 10px;
  border: 2px solid transparent;
  cursor: pointer;
  background: #f8f9fa;
  transition: all 0.2s;
}

.sign-card:hover,
.sign-card.selected {
  border-color: #667eea;
  background: #f0f2ff;
}

.sign-card-img,
.sign-card-placeholder {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 8px;
}

.sign-card-placeholder {
  background: linear-gradient(135deg, #e0e0e0, #f5f5f5);
}

.sign-card-name {
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

.sign-card-en {
  font-size: 11px;
  color: #888;
}

.sign-card-attr,
.sign-card-date {
  font-size: 11px;
  color: #666;
  margin-top: 2px;
}

.section-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 14px;
  padding-bottom: 8px;
  border-bottom: 2px solid #eee;
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  gap: 8px;
  font-size: 14px;
}

.detail-label {
  flex-shrink: 0;
  font-weight: 600;
  color: #555;
}

.detail-info {
  color: #333;
}

.no-detail {
  color: #888;
  font-size: 14px;
  margin: 0;
}

/* 星座匹配 */
.compat-form {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.compat-label {
  font-weight: 500;
  color: #333;
}

.compat-select {
  min-width: 140px;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.compat-list .compat-item {
  padding: 14px;
  border-radius: 8px;
  background: #f8f9fa;
  margin-bottom: 12px;
  border-left: 4px solid #667eea;
}

.compat-item:last-child {
  margin-bottom: 0;
}

.compat-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.compat-img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.compat-pair {
  font-weight: 600;
  color: #333;
}

.compat-score {
  margin-left: auto;
  color: #667eea;
  font-weight: 600;
}

.compat-comment {
  font-size: 14px;
  color: #555;
  margin: 0 0 8px;
  line-height: 1.5;
}

.compat-desc p {
  font-size: 13px;
  color: #666;
  margin: 4px 0;
  line-height: 1.5;
}

.desc-tag {
  display: inline-block;
  padding: 0 6px;
  font-size: 11px;
  background: #eee;
  border-radius: 4px;
  margin-right: 6px;
}

.empty-hint {
  color: #888;
  text-align: center;
}

/* 我的星座 */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  color: #555;
  font-weight: 500;
}

.form-input {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
}

.form-actions {
  margin-top: 8px;
}

.btn-primary {
  padding: 10px 24px;
  background: #667eea;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.matched-signs {
  font-size: 1.1rem;
  font-weight: 600;
  color: #667eea;
  margin: 0 0 16px;
}

.matched-block {
  margin: 0 0 16px;
  padding: 12px 14px;
  border-radius: 10px;
  background: #f0f2ff;
  border: 1px solid #e6e9ff;
}

.matched-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 14px;
}

.matched-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.matched-tag {
  padding: 6px 10px;
  background: #fff;
  border: 1px solid #dfe3ff;
  border-radius: 999px;
  font-size: 13px;
  color: #3d4bb2;
  font-weight: 600;
}

.result-block {
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.5;
}

.result-label {
  display: inline-block;
  font-weight: 600;
  color: #555;
  margin-right: 8px;
  min-width: 72px;
}

.result-block.prefer .result-label { color: #238636; }
.result-block.avoid .result-label { color: #cf2222; }

.luck-info {
  margin-top: 16px;
}

.luck-info .result-label {
  display: block;
  margin-bottom: 8px;
}

.luck-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.luck-tag {
  padding: 4px 10px;
  background: #f0f2ff;
  border-radius: 6px;
  font-size: 13px;
  color: #555;
}

.subsection-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  margin: 16px 0 10px;
}

.explain-card {
  padding: 14px;
  border-radius: 10px;
  background: #f8f9fa;
  border-left: 4px solid #667eea;
  margin-bottom: 12px;
}

.explain-card:last-child {
  margin-bottom: 0;
}

.explain-head {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.explain-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.explain-tag-img {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.explain-label {
  font-weight: 700;
  color: #333;
  font-size: 14px;
  white-space: nowrap;
}

.explain-category {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}
.explain-category.cat-love {
  background: rgba(232, 67, 147, 0.15);
  color: #c2185b;
}
.explain-category.cat-wealth {
  background: rgba(255, 193, 7, 0.2);
  color: #f57c00;
}
.explain-category.cat-health {
  background: rgba(76, 175, 80, 0.15);
  color: #2e7d32;
}
.explain-category.cat-career {
  background: rgba(33, 150, 243, 0.15);
  color: #1565c0;
}
.explain-category:not([class*="cat-"]) {
  background: #eee;
  color: #555;
}

.explain-tag {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid #ddd;
  background: #fff;
  color: #666;
  flex-shrink: 0;
}

.explain-tag.is-up {
  color: #238636;
  border-color: rgba(35, 134, 54, 0.35);
  background: rgba(35, 134, 54, 0.08);
}

.explain-tag.is-down {
  color: #cf2222;
  border-color: rgba(207, 34, 34, 0.35);
  background: rgba(207, 34, 34, 0.08);
}

.explain-items {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.explain-block-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 0 10px;
}

.explain-block-cat {
  font-weight: 700;
  font-size: 15px;
  padding: 4px 0;
}

.explain-block-n-stars {
  font-weight: 600;
  color: #667eea;
  font-size: 14px;
}

.explain-block-stars {
  display: inline-flex;
  gap: 2px;
}

.explain-block-stars .star {
  font-size: 16px;
  color: #ddd;
}

.explain-block-stars .star.on {
  color: #f4b400;
}

.explain-block-content {
  margin: 0;
  font-size: 14px;
  line-height: 1.65;
  color: #333;
}

.explain-overall {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 6px 0 12px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid #eee;
}

.overall-k {
  font-weight: 800;
  color: #333;
  font-size: 13px;
}

.overall-v {
  font-weight: 900;
  color: #667eea;
  font-size: 18px;
  line-height: 1;
}

.overall-stars {
  margin-left: auto;
  display: inline-flex;
  gap: 3px;
}

.star {
  font-size: 14px;
  color: #ddd;
}

.star.on {
  color: #f4b400;
}

.explain-item-row {
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: 10px;
  font-size: 13px;
  line-height: 1.5;
}

.explain-item-k {
  color: #555;
  font-weight: 700;
}

.explain-item-v {
  color: #333;
}

.explain-summary {
  color: #333;
  font-size: 13px;
  line-height: 1.6;
  margin: 0;
}

.explain-more {
  margin-top: 10px;
}

.explain-more summary {
  cursor: pointer;
  color: #667eea;
  font-weight: 600;
  font-size: 13px;
}

.explain-raw {
  margin: 10px 0 0;
  padding: 10px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #eee;
  font-size: 12px;
  color: #333;
  overflow: auto;
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  .sign-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
