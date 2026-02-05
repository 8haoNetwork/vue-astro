<template>
  <div class="birthday-container">
    <h1>生辰测算</h1>
    
    <div class="birthday-form">
      <div class="form-group">
        <label for="birthDate">出生日期</label>
        <input type="date" id="birthDate" v-model="birthDate" required>
      </div>
      
      <div class="form-group">
        <label for="birthTime">出生时间</label>
        <input type="time" id="birthTime" v-model="birthTime" required>
      </div>
      
      <div class="form-actions">
        <button class="btn btn-primary" @click="fetchBirthdayData">测算生辰</button>
      </div>
    </div>
    
    <div v-if="loading" class="loading-container">
      <div class="loading"></div>
      <p>测算中...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <p class="error">{{ error }}</p>
    </div>
    
    <div v-else-if="birthdayData" class="birthday-result">
      <div class="result-header">
        <h2>生辰测算结果</h2>
        <p class="birth-info">
          出生日期：{{ birthDate }} {{ birthTime }}
        </p>
      </div>
      
      <div class="result-content">
        <div class="bazi-section">
          <h3>八字信息</h3>
          <div class="bazi-info">
            <div class="bazi-item">
              <span class="bazi-label">年柱</span>
              <span class="bazi-value">{{ birthdayData.bazi.year }}</span>
            </div>
            <div class="bazi-item">
              <span class="bazi-label">月柱</span>
              <span class="bazi-value">{{ birthdayData.bazi.month }}</span>
            </div>
            <div class="bazi-item">
              <span class="bazi-label">日柱</span>
              <span class="bazi-value">{{ birthdayData.bazi.day }}</span>
            </div>
            <div class="bazi-item">
              <span class="bazi-label">时柱</span>
              <span class="bazi-value">{{ birthdayData.bazi.hour }}</span>
            </div>
          </div>
        </div>
        
        <div class="zodiac-section">
          <h3>生肖信息</h3>
          <div class="zodiac-info">
            <div class="zodiac-item">
              <span class="zodiac-label">生肖</span>
              <span class="zodiac-value">{{ birthdayData.zodiac.animal }}</span>
            </div>
            <div class="zodiac-item">
              <span class="zodiac-label">五行</span>
              <span class="zodiac-value">{{ birthdayData.zodiac.element }}</span>
            </div>
            <div class="zodiac-item">
              <span class="zodiac-label">纳音</span>
              <span class="zodiac-value">{{ birthdayData.zodiac.nayin }}</span>
            </div>
          </div>
        </div>
        
        <div class="personality-section">
          <h3>性格分析</h3>
          <div class="personality-content">
            <p>{{ birthdayData.personality }}</p>
          </div>
        </div>
        
        <div class="career-section">
          <h3>事业分析</h3>
          <div class="career-content">
            <p>{{ birthdayData.career }}</p>
          </div>
        </div>
        
        <div class="relationship-section">
          <h3>感情分析</h3>
          <div class="relationship-content">
            <p>{{ birthdayData.relationship }}</p>
          </div>
        </div>
        
        <div class="fortune-section">
          <h3>运势分析</h3>
          <div class="fortune-content">
            <p>{{ birthdayData.fortune }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { fetchBirthday } from '../services/api'

const birthDate = ref('')
const birthTime = ref('')
const loading = ref(false)
const error = ref('')
const birthdayData = ref(null)

const fetchBirthdayData = async () => {
  if (!birthDate.value || !birthTime.value) {
    error.value = '请填写完整的出生信息'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    // 这里调用API服务，实际项目中会通过后端接口获取数据
    // const data = await fetchBirthday(birthDate.value, birthTime.value)
    // 模拟数据
    birthdayData.value = {
      bazi: {
        year: '甲子',
        month: '丙寅',
        day: '戊辰',
        hour: '庚申'
      },
      zodiac: {
        animal: '鼠',
        element: '木',
        nayin: '海中金'
      },
      personality: '你性格开朗活泼，思维敏捷，具有强烈的好奇心和探索精神。为人处世圆滑得体，善于与人交往，有良好的人际关系。同时也有较强的自我意识和主观能动性，喜欢按照自己的意愿行事。',
      career: '你在事业上会有不错的发展，尤其是在需要创造力和领导力的领域。你具有较强的适应能力和学习能力，能够快速掌握新技能。适合的职业包括企业家、管理者、艺术家、教育工作者等。',
      relationship: '你感情丰富，重视家庭和爱情。婚姻运势较好，配偶对你事业有帮助。婚前可能会有一些感情波折，但最终会找到适合自己的伴侣。婚后生活和谐美满，子女孝顺。',
      fortune: '你整体运势不错，尤其是在中年时期会有显著成就。财运方面，你会通过自己的努力获得丰厚的回报。健康方面，注意保持良好的生活习惯，避免过度劳累。晚年生活幸福，衣食无忧。'
    }
  } catch (err) {
    error.value = '测算生辰失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.birthday-container {
  max-width: 1000px;
  margin: 0 auto;
}

.birthday-form {
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

.birthday-result {
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
}

.result-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.bazi-section,
.zodiac-section {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 6px;
}

.bazi-section h3,
.zodiac-section h3 {
  margin-bottom: 1rem;
}

.bazi-info,
.zodiac-info {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.bazi-item,
.zodiac-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.bazi-label,
.zodiac-label {
  font-weight: 500;
  color: #555;
}

.bazi-value,
.zodiac-value {
  font-weight: 600;
  color: #667eea;
}

.personality-section,
.career-section,
.relationship-section,
.fortune-section {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 6px;
}

.personality-section h3,
.career-section h3,
.relationship-section h3,
.fortune-section h3 {
  margin-bottom: 1rem;
}

.personality-content,
.career-content,
.relationship-content,
.fortune-content {
  background: white;
  padding: 1.5rem;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.personality-content p,
.career-content p,
.relationship-content p,
.fortune-content p {
  color: #666;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .birthday-container {
    padding: 0 1rem;
  }
  
  .birthday-form {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .loading-container,
  .error-container {
    padding: 2rem;
    margin-bottom: 1.5rem;
  }
  
  .birthday-result {
    padding: 1.5rem;
  }
  
  .result-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .bazi-info,
  .zodiac-info {
    gap: 0.5rem;
  }
  
  .bazi-item,
  .zodiac-item {
    padding: 0.6rem;
  }
  
  .personality-content,
  .career-content,
  .relationship-content,
  .fortune-content {
    padding: 1rem;
  }
}
</style>
