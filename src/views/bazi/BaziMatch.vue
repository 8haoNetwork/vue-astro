<template>
  <div class="match-page">
    <router-link to="/bazi" class="back-link">← 八字</router-link>
    <div class="query-card">
      <div class="query-title">生辰合盘</div>
      <div class="form-grid">
        <div class="form-block">
          <label>自己</label>
          <div class="form-row">
            <input v-model="yourBirthDate" type="date" placeholder="出生日期">
            <input v-model="yourBirthTime" type="time" placeholder="出生时间">
          </div>
        </div>
        <div class="form-block">
          <label>对方</label>
          <div class="form-row">
            <input v-model="otherBirthDate" type="date" placeholder="出生日期">
            <input v-model="otherBirthTime" type="time" placeholder="出生时间">
          </div>
        </div>
      </div>
      <button type="button" class="submit-btn" :disabled="loading" @click="fetchMatch">
        {{ loading ? '测算中...' : '开始合盘' }}
      </button>
    </div>

    <div v-if="error" class="status-card error">{{ error }}</div>

    <template v-else-if="matchData">
      <div class="charts-section">
        <div class="chart-col">
          <div class="chart-title">你(男)</div>
          <MatchNatalCard :data="matchData.your_natal" />
        </div>
        <div class="chart-divider" />
        <div class="chart-col">
          <div class="chart-title">对方(男)</div>
          <MatchNatalCard :data="matchData.other_natal" />
        </div>
      </div>
      <section class="interpret-section">
        <h3 class="interpret-title">生辰合盘解读</h3>
        <div class="interpret-content">
          <p v-if="interpretText">{{ interpretText }}</p>
          <p v-else class="interpret-placeholder">合盘解读内容可由后端在 BaziMatchVO 中增加字段返回。</p>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { fetchBaziMatch } from '../../services/bazi'
import { buildBaziMatchQry } from '../../composables/useBazi'
import MatchNatalCard from './BaziMatchNatalCard.vue'

const yourBirthDate = ref('2008-01-10')
const yourBirthTime = ref('14:30:00')
const otherBirthDate = ref('1999-10-17')
const otherBirthTime = ref('21:00:00')
const loading = ref(false)
const error = ref('')
const matchData = ref(null)

const interpretText = ref('')

async function fetchMatch() {
  if (!yourBirthDate.value || !yourBirthTime.value) {
    error.value = '请填写自己的出生信息'
    return
  }
  if (!otherBirthDate.value || !otherBirthTime.value) {
    error.value = '请填写对方的出生信息'
    return
  }
  loading.value = true
  error.value = ''
  matchData.value = null
  try {
    const qry = buildBaziMatchQry(
      yourBirthDate.value,
      yourBirthTime.value,
      otherBirthDate.value,
      otherBirthTime.value
    )
    const res = await fetchBaziMatch(qry)
    if (res?.code === 0 && res?.data) {
      matchData.value = res.data
      interpretText.value = res.data.interpret_text || res.data.interpretation || ''
    } else {
      matchData.value = null
      error.value = res?.msg || '获取合盘数据失败，请稍后重试'
    }
  } catch {
    matchData.value = null
    error.value = '获取合盘数据失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.match-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 12px;
  position: relative;
}

.back-link {
  position: absolute;
  top: 12px;
  left: 12px;
  font-size: 14px;
  color: #8b7355;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.query-card {
  margin-top: 48px; /* 留出返回链接高度，避免重叠 */
  background: #fff;
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 12px;
}

.query-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-block label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 6px;
}

.form-row {
  display: flex;
  gap: 6px;
}

.form-row input {
  flex: 1;
  border: 1px solid #ece3dc;
  border-radius: 8px;
  padding: 8px;
  font-size: 13px;
}

.submit-btn {
  width: 100%;
  margin-top: 12px;
  padding: 10px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  background: #8b7355;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.status-card.error {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  text-align: center;
  color: #cf5a5a;
}

.charts-section {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0;
  background: #fff;
  border-radius: 14px;
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid #f0ebe7;
}

.chart-col {
  min-width: 0;
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
}

.chart-divider {
  width: 1px;
  background: #e8e2dc;
  margin: 0 8px;
}

.interpret-section {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  border: 1px solid #f0ebe7;
}

.interpret-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px;
}

.interpret-content {
  font-size: 14px;
  color: #444;
  line-height: 1.75;
}

.interpret-placeholder {
  color: #999;
}

/* 移动端 */
@media (max-width: 600px) {
  .match-page {
    padding: 10px;
  }

  .back-link {
    top: 10px;
    left: 10px;
    padding: 8px 0;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
  }

  .query-card {
    margin-top: 56px; /* 移动端返回链接 min-height 44px，留出间距 */
    padding: 12px;
    border-radius: 12px;
  }

  .query-title {
    font-size: 15px;
    margin-bottom: 10px;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .form-row input {
    padding: 10px 12px;
    font-size: 16px; /* 避免 iOS 缩放 */
    min-height: 44px;
  }

  .submit-btn {
    margin-top: 10px;
    padding: 12px;
    font-size: 16px;
    min-height: 48px;
    border-radius: 10px;
  }

  .charts-section {
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    padding: 8px;
    border-radius: 12px;
    gap: 0;
  }

  .chart-col {
    min-width: 0;
    overflow: hidden;
  }

  .chart-divider {
    width: 1px;
    height: auto;
    margin: 0 4px;
    flex-shrink: 0;
  }

  .chart-title {
    font-size: 12px;
    margin-bottom: 6px;
  }

  .interpret-section {
    padding: 12px;
    border-radius: 12px;
  }

  .interpret-title {
    font-size: 14px;
    margin-bottom: 10px;
  }

  .interpret-content {
    font-size: 14px;
    line-height: 1.7;
  }
}
</style>
