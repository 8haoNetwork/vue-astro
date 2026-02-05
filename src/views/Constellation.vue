<template>
  <div class="constellation-container">
    <h1>星座运势</h1>
    
    <div class="constellation-form">
      <div class="form-group">
        <label for="constellation">选择星座</label>
        <select id="constellation" v-model="selectedConstellation" @change="fetchConstellationData">
          <option value="">请选择星座</option>
          <option value="aries">白羊座</option>
          <option value="taurus">金牛座</option>
          <option value="gemini">双子座</option>
          <option value="cancer">巨蟹座</option>
          <option value="leo">狮子座</option>
          <option value="virgo">处女座</option>
          <option value="libra">天秤座</option>
          <option value="scorpio">天蝎座</option>
          <option value="sagittarius">射手座</option>
          <option value="capricorn">摩羯座</option>
          <option value="aquarius">水瓶座</option>
          <option value="pisces">双鱼座</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="type">选择类型</label>
        <select id="type" v-model="selectedType" @change="fetchConstellationData">
          <option value="daily">每日运势</option>
          <option value="weekly">每周运势</option>
          <option value="monthly">每月运势</option>
          <option value="yearly">每年运势</option>
        </select>
      </div>
    </div>
    
    <div v-if="loading" class="loading-container">
      <div class="loading"></div>
      <p>加载中...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <p class="error">{{ error }}</p>
    </div>
    
    <div v-else-if="constellationData" class="constellation-result">
      <div class="result-header">
        <h2>{{ constellationData.name }} {{ getTypeName(selectedType) }}运势</h2>
        <p class="date-range">{{ constellationData.dateRange }}</p>
      </div>
      
      <div class="result-content">
        <div class="fortune-overview">
          <div class="fortune-item">
            <span class="fortune-label">综合运势</span>
            <div class="fortune-value">{{ constellationData.overall }}</div>
            <div class="fortune-bar">
              <div class="fortune-fill" :style="{ width: constellationData.overall + '%' }"></div>
            </div>
          </div>
          
          <div class="fortune-item">
            <span class="fortune-label">财运</span>
            <div class="fortune-value">{{ constellationData.wealth }}</div>
            <div class="fortune-bar">
              <div class="fortune-fill" :style="{ width: constellationData.wealth + '%' }"></div>
            </div>
          </div>
          
          <div class="fortune-item">
            <span class="fortune-label">事业</span>
            <div class="fortune-value">{{ constellationData.career }}</div>
            <div class="fortune-bar">
              <div class="fortune-fill" :style="{ width: constellationData.career + '%' }"></div>
            </div>
          </div>
          
          <div class="fortune-item">
            <span class="fortune-label">感情</span>
            <div class="fortune-value">{{ constellationData.love }}</div>
            <div class="fortune-bar">
              <div class="fortune-fill" :style="{ width: constellationData.love + '%' }"></div>
            </div>
          </div>
        </div>
        
        <div class="fortune-details">
          <div class="detail-item">
            <h3>运势详解</h3>
            <p>{{ constellationData.details }}</p>
          </div>
          
          <div class="detail-item">
            <h3>幸运数字</h3>
            <p>{{ constellationData.luckyNumber }}</p>
          </div>
          
          <div class="detail-item">
            <h3>幸运颜色</h3>
            <p>{{ constellationData.luckyColor }}</p>
          </div>
          
          <div class="detail-item">
            <h3>今日宜忌</h3>
            <div class="宜忌">
              <div class="宜">
                <h4>宜</h4>
                <p>{{ constellationData.luckyThings }}</p>
              </div>
              <div class="忌">
                <h4>忌</h4>
                <p>{{ constellationData.unluckyThings }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { fetchConstellation } from '../services/api'

const selectedConstellation = ref('')
const selectedType = ref('daily')
const loading = ref(false)
const error = ref('')
const constellationData = ref(null)

const fetchConstellationData = async () => {
  if (!selectedConstellation.value) {
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    // 这里调用API服务，实际项目中会通过后端接口获取数据
    // const data = await fetchConstellation(selectedConstellation.value, selectedType.value)
    // 模拟数据
    constellationData.value = {
      name: getConstellationName(selectedConstellation.value),
      dateRange: getDateRange(selectedConstellation.value),
      overall: Math.floor(Math.random() * 40) + 60,
      wealth: Math.floor(Math.random() * 40) + 60,
      career: Math.floor(Math.random() * 40) + 60,
      love: Math.floor(Math.random() * 40) + 60,
      details: '今天你的运势整体不错，事业上会有新的机会，财运方面可能会有意外收获，感情方面与伴侣相处融洽。建议保持积极的心态，抓住机会展现自己的能力。',
      luckyNumber: Math.floor(Math.random() * 9) + 1,
      luckyColor: ['红色', '蓝色', '绿色', '黄色', '紫色'][Math.floor(Math.random() * 5)],
      luckyThings: '出行、签约、聚会、投资',
      unluckyThings: '争吵、熬夜、冲动消费'
    }
  } catch (err) {
    error.value = '获取星座运势失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const getConstellationName = (value) => {
  const names = {
    aries: '白羊座',
    taurus: '金牛座',
    gemini: '双子座',
    cancer: '巨蟹座',
    leo: '狮子座',
    virgo: '处女座',
    libra: '天秤座',
    scorpio: '天蝎座',
    sagittarius: '射手座',
    capricorn: '摩羯座',
    aquarius: '水瓶座',
    pisces: '双鱼座'
  }
  return names[value] || value
}

const getDateRange = (value) => {
  const ranges = {
    aries: '3月21日-4月19日',
    taurus: '4月20日-5月20日',
    gemini: '5月21日-6月21日',
    cancer: '6月22日-7月22日',
    leo: '7月23日-8月22日',
    virgo: '8月23日-9月22日',
    libra: '9月23日-10月23日',
    scorpio: '10月24日-11月22日',
    sagittarius: '11月23日-12月21日',
    capricorn: '12月22日-1月19日',
    aquarius: '1月20日-2月18日',
    pisces: '2月19日-3月20日'
  }
  return ranges[value] || ''
}

const getTypeName = (type) => {
  const types = {
    daily: '每日',
    weekly: '每周',
    monthly: '每月',
    yearly: '每年'
  }
  return types[type] || type
}
</script>

<style scoped>
.constellation-container {
  max-width: 1000px;
  margin: 0 auto;
}

.constellation-form {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.loading-container,
.error-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 4rem;
  text-align: center;
  margin-bottom: 2rem;
}

.constellation-result {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.result-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.result-header h2 {
  margin-bottom: 0.5rem;
}

.date-range {
  color: #666;
  font-size: 0.9rem;
}

.fortune-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.fortune-item {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 6px;
}

.fortune-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.fortune-value {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #667eea;
}

.fortune-bar {
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
}

.fortune-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.5s ease;
}

.fortune-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.detail-item {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 6px;
}

.detail-item h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.detail-item p {
  color: #666;
  line-height: 1.6;
}

.宜忌 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.宜, .忌 {
  padding: 1rem;
  border-radius: 4px;
}

.宜 {
  background: rgba(39, 174, 96, 0.1);
}

.忌 {
  background: rgba(231, 76, 60, 0.1);
}

.宜 h4, .忌 h4 {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .constellation-container {
    padding: 0 1rem;
  }
  
  .constellation-form {
    grid-template-columns: 1fr;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .loading-container,
  .error-container {
    padding: 2rem;
    margin-bottom: 1.5rem;
  }
  
  .constellation-result {
    padding: 1.5rem;
  }
  
  .fortune-overview {
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
  
  .fortune-item {
    padding: 0.8rem;
  }
  
  .fortune-details {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .detail-item {
    padding: 1rem;
  }
  
  .宜忌 {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}
</style>
