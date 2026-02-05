<template>
  <div class="horoscope-container">
    <h1>个人星盘</h1>
    
    <div class="horoscope-form">
      <div class="form-group">
        <label for="birthDate">出生日期</label>
        <input type="date" id="birthDate" v-model="birthDate" required>
      </div>
      
      <div class="form-group">
        <label for="birthTime">出生时间</label>
        <input type="time" id="birthTime" v-model="birthTime" required>
      </div>
      
      <div class="form-group">
        <label for="birthPlace">出生地点</label>
        <input type="text" id="birthPlace" v-model="birthPlace" placeholder="例如：北京" required>
      </div>
      
      <div class="form-actions">
        <button class="btn btn-primary" @click="fetchHoroscopeData">生成星盘</button>
      </div>
    </div>
    
    <div v-if="loading" class="loading-container">
      <div class="loading"></div>
      <p>生成星盘中...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <p class="error">{{ error }}</p>
    </div>
    
    <div v-else-if="horoscopeData" class="horoscope-result">
      <div class="result-header">
        <h2>个人星盘分析</h2>
        <p class="birth-info">
          出生日期：{{ birthDate }} {{ birthTime }}<br>
          出生地点：{{ birthPlace }}
        </p>
      </div>
      
      <div class="result-content">
        <div class="chart-section">
          <h3>星盘图表</h3>
          <div class="chart-placeholder">
            <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=astrology%20birth%20chart%20with%20zodiac%20signs%20and%20planets%20on%20a%20dark%20blue%20background&image_size=square_hd" alt="星盘图表" class="chart-image">
          </div>
        </div>
        
        <div class="planets-section">
          <h3>行星位置</h3>
          <div class="planets-grid">
            <div v-for="planet in horoscopeData.planets" :key="planet.name" class="planet-item">
              <span class="planet-name">{{ planet.name }}</span>
              <span class="planet-sign">{{ planet.sign }}</span>
              <span class="planet-degree">{{ planet.degree }}°</span>
            </div>
          </div>
        </div>
        
        <div class="houses-section">
          <h3>宫位分析</h3>
          <div class="houses-grid">
            <div v-for="house in horoscopeData.houses" :key="house.number" class="house-item">
              <span class="house-number">第{{ house.number }}宫</span>
              <span class="house-cusp">{{ house.cusp }}°</span>
              <span class="house-sign">{{ house.sign }}</span>
              <p class="house-meaning">{{ house.meaning }}</p>
            </div>
          </div>
        </div>
        
        <div class="personality-section">
          <h3>性格分析</h3>
          <div class="personality-content">
            <p>{{ horoscopeData.personality }}</p>
          </div>
        </div>
        
        <div class="career-section">
          <h3>事业分析</h3>
          <div class="career-content">
            <p>{{ horoscopeData.career }}</p>
          </div>
        </div>
        
        <div class="relationship-section">
          <h3>感情分析</h3>
          <div class="relationship-content">
            <p>{{ horoscopeData.relationship }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { fetchHoroscope } from '../services/api'

const birthDate = ref('')
const birthTime = ref('')
const birthPlace = ref('')
const loading = ref(false)
const error = ref('')
const horoscopeData = ref(null)

const fetchHoroscopeData = async () => {
  if (!birthDate.value || !birthTime.value || !birthPlace.value) {
    error.value = '请填写完整的出生信息'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    // 这里调用API服务，实际项目中会通过后端接口获取数据
    // const data = await fetchHoroscope(birthDate.value, birthTime.value, birthPlace.value)
    // 模拟数据
    horoscopeData.value = {
      planets: [
        { name: '太阳', sign: '白羊座', degree: 15 },
        { name: '月亮', sign: '巨蟹座', degree: 8 },
        { name: '水星', sign: '双鱼座', degree: 28 },
        { name: '金星', sign: '金牛座', degree: 5 },
        { name: '火星', sign: '白羊座', degree: 22 },
        { name: '木星', sign: '射手座', degree: 12 },
        { name: '土星', sign: '摩羯座', degree: 18 },
        { name: '天王星', sign: '水瓶座', degree: 10 },
        { name: '海王星', sign: '双鱼座', degree: 5 },
        { name: '冥王星', sign: '摩羯座', degree: 20 }
      ],
      houses: [
        { number: '1', cusp: '15', sign: '白羊座', meaning: '自我认同、个人形象、性格特质' },
        { number: '2', cusp: '8', sign: '金牛座', meaning: '财富、价值观、物质占有' },
        { number: '3', cusp: '28', sign: '双子座', meaning: '沟通、学习、短途旅行' },
        { number: '4', cusp: '5', sign: '巨蟹座', meaning: '家庭、根源、情感基础' },
        { number: '5', cusp: '22', sign: '狮子座', meaning: '创造力、爱情、娱乐' },
        { number: '6', cusp: '12', sign: '处女座', meaning: '工作、健康、日常习惯' },
        { number: '7', cusp: '18', sign: '天秤座', meaning: '关系、婚姻、合作' },
        { number: '8', cusp: '10', sign: '天蝎座', meaning: ' transformation、shared resources、intimacy' },
        { number: '9', cusp: '5', sign: '射手座', meaning: '哲学、教育、长途旅行' },
        { number: '10', cusp: '20', sign: '摩羯座', meaning: '事业、社会地位、成就' },
        { number: '11', cusp: '15', sign: '水瓶座', meaning: '朋友、团体、未来愿景' },
        { number: '12', cusp: '8', sign: '双鱼座', meaning: '潜意识、灵性、隐藏的事物' }
      ],
      personality: '你是一个充满活力和热情的人，具有强烈的自我意识和领导能力。太阳在白羊座赋予你勇敢、果断的特质，而月亮在巨蟹座则使你情感丰富、重视家庭。你善于表达自己的想法，具有创新精神，喜欢尝试新事物。',
      career: '你的事业发展会比较顺利，尤其是在需要创造力和领导力的领域。火星在白羊座的位置表明你有强烈的事业心和竞争意识，能够克服困难实现目标。适合的职业包括企业家、领导者、艺术家、教育工作者等。',
      relationship: '在感情方面，你倾向于寻找能够与你平等相处、相互支持的伴侣。金星在金牛座的位置表明你重视稳定和安全感，希望建立长期的、忠诚的关系。你会为了维护关系而努力，并且愿意为对方付出。'
    }
  } catch (err) {
    error.value = '生成星盘失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.horoscope-container {
  max-width: 1200px;
  margin: 0 auto;
}

.horoscope-form {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

.form-actions {
  margin-top: 1.5rem;
  text-align: center;
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

.horoscope-result {
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
  margin-bottom: 1rem;
}

.birth-info {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.result-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.chart-section {
  grid-column: 1 / -1;
  text-align: center;
}

.chart-placeholder {
  margin-top: 1rem;
}

.chart-image {
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.planets-section,
.houses-section,
.personality-section,
.career-section,
.relationship-section {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 6px;
}

.planets-section h3,
.houses-section h3,
.personality-section h3,
.career-section h3,
.relationship-section h3 {
  margin-bottom: 1rem;
}

.planets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.5rem;
}

.planet-item {
  background: white;
  padding: 0.8rem;
  border-radius: 4px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.planet-name {
  display: block;
  font-weight: 500;
  margin-bottom: 0.2rem;
}

.planet-sign {
  display: block;
  font-size: 0.9rem;
  color: #667eea;
  margin-bottom: 0.2rem;
}

.planet-degree {
  display: block;
  font-size: 0.8rem;
  color: #666;
}

.houses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.house-item {
  background: white;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.house-number {
  display: block;
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.house-cusp,
.house-sign {
  display: inline-block;
  margin-right: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.house-meaning {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #777;
  line-height: 1.4;
}

.personality-content,
.career-content,
.relationship-content {
  background: white;
  padding: 1.5rem;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.personality-content p,
.career-content p,
.relationship-content p {
  color: #666;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .horoscope-container {
    padding: 0 1rem;
  }
  
  .horoscope-form {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .loading-container,
  .error-container {
    padding: 2rem;
    margin-bottom: 1.5rem;
  }
  
  .horoscope-result {
    padding: 1.5rem;
  }
  
  .result-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .planets-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .houses-grid {
    grid-template-columns: 1fr;
  }
  
  .personality-content,
  .career-content,
  .relationship-content {
    padding: 1rem;
  }
}
</style>
