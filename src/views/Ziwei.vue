<template>
  <div class="ziwei-container">
    <h1>紫薇斗数</h1>
    
    <div class="ziwei-form">
      <div class="form-group">
        <label for="birthDate">出生日期</label>
        <input type="date" id="birthDate" v-model="birthDate" required>
      </div>
      
      <div class="form-group">
        <label for="birthTime">出生时间</label>
        <input type="time" id="birthTime" v-model="birthTime" required>
      </div>
      
      <div class="form-group">
        <label for="gender">性别</label>
        <select id="gender" v-model="gender" required>
          <option value="">请选择性别</option>
          <option value="male">男</option>
          <option value="female">女</option>
        </select>
      </div>
      
      <div class="form-actions">
        <button class="btn btn-primary" @click="fetchZiweiData">生成紫薇盘</button>
      </div>
    </div>
    
    <div v-if="loading" class="loading-container">
      <div class="loading"></div>
      <p>生成紫薇盘中...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <p class="error">{{ error }}</p>
    </div>
    
    <div v-else-if="ziweiData" class="ziwei-result">
      <div class="result-header">
        <h2>紫薇斗数分析</h2>
        <p class="birth-info">
          出生日期：{{ birthDate }} {{ birthTime }}<br>
          性别：{{ gender === 'male' ? '男' : '女' }}
        </p>
      </div>
      
      <div class="result-content">
        <div class="chart-section">
          <h3>紫薇盘图表</h3>
          <div class="chart-placeholder">
            <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20ziwei%20dou%20shu%20astrology%20chart%20with%20traditional%20chinese%20symbols%20on%20a%20red%20and%20gold%20background&image_size=square_hd" alt="紫薇盘图表" class="chart-image">
          </div>
        </div>
        
        <div class="palaces-section">
          <h3>十二宫位</h3>
          <div class="palaces-grid">
            <div v-for="palace in ziweiData.palaces" :key="palace.name" class="palace-item">
              <span class="palace-name">{{ palace.name }}</span>
              <span class="palace-stars">{{ palace.stars }}</span>
              <p class="palace-meaning">{{ palace.meaning }}</p>
            </div>
          </div>
        </div>
        
        <div class="destiny-section">
          <h3>命运格局</h3>
          <div class="destiny-content">
            <p>{{ ziweiData.destiny }}</p>
          </div>
        </div>
        
        <div class="personality-section">
          <h3>性格分析</h3>
          <div class="personality-content">
            <p>{{ ziweiData.personality }}</p>
          </div>
        </div>
        
        <div class="career-section">
          <h3>事业分析</h3>
          <div class="career-content">
            <p>{{ ziweiData.career }}</p>
          </div>
        </div>
        
        <div class="relationship-section">
          <h3>感情分析</h3>
          <div class="relationship-content">
            <p>{{ ziweiData.relationship }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { fetchZiwei } from '../services/api'

const birthDate = ref('')
const birthTime = ref('')
const gender = ref('')
const loading = ref(false)
const error = ref('')
const ziweiData = ref(null)

const fetchZiweiData = async () => {
  if (!birthDate.value || !birthTime.value || !gender.value) {
    error.value = '请填写完整的出生信息'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    // 这里调用API服务，实际项目中会通过后端接口获取数据
    // const data = await fetchZiwei(birthDate.value, birthTime.value, gender.value)
    // 模拟数据
    ziweiData.value = {
      palaces: [
        { name: '命宫', stars: '紫微、贪狼', meaning: '主个人命运、性格特质、人生格局' },
        { name: '兄弟宫', stars: '天机', meaning: '主兄弟姐妹关系、朋友缘分' },
        { name: '夫妻宫', stars: '太阳、太阴', meaning: '主婚姻感情、配偶特质' },
        { name: '子女宫', stars: '天同', meaning: '主子女缘分、晚辈关系' },
        { name: '财帛宫', stars: '武曲、天府', meaning: '主财富运势、理财能力' },
        { name: '疾厄宫', stars: '天相', meaning: '主健康状况、疾病隐患' },
        { name: '迁移宫', stars: '破军', meaning: '主外出运势、人际关系' },
        { name: '奴仆宫', stars: '七杀', meaning: '主下属关系、合作运势' },
        { name: '官禄宫', stars: '廉贞', meaning: '主事业运势、职业发展' },
        { name: '田宅宫', stars: '巨门', meaning: '主家庭运势、房产状况' },
        { name: '福德宫', stars: '天梁', meaning: '主福气运势、精神生活' },
        { name: '父母宫', stars: '文昌、文曲', meaning: '主父母缘分、长辈关系' }
      ],
      destiny: '你命宫有紫微贪狼同宫，格局显贵，主聪明机智，富有领导才能。一生运势起伏较大，但总体呈上升趋势，中年后事业有成，财富积累丰厚。晚年生活幸福，子女孝顺。',
      personality: '你性格开朗活泼，思维敏捷，具有强烈的好奇心和探索精神。为人处世圆滑得体，善于与人交往，有良好的人际关系。同时也有较强的自我意识和主观能动性，喜欢按照自己的意愿行事。',
      career: '你的事业发展较为顺利，尤其是在中年时期会有显著成就。适合从事需要创造力和领导力的工作，如企业家、管理者、艺术创作等。工作中会遇到一些挑战，但都能凭借自己的能力克服。',
      relationship: '你感情丰富，重视家庭和爱情。婚姻运势较好，配偶对你事业有帮助。婚前可能会有一些感情波折，但最终会找到适合自己的伴侣。婚后生活和谐美满，子女孝顺。'
    }
  } catch (err) {
    error.value = '生成紫薇盘失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.ziwei-container {
  max-width: 1200px;
  margin: 0 auto;
}

.ziwei-form {
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

.ziwei-result {
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

.palaces-section,
.destiny-section,
.personality-section,
.career-section,
.relationship-section {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 6px;
}

.palaces-section h3,
.destiny-section h3,
.personality-section h3,
.career-section h3,
.relationship-section h3 {
  margin-bottom: 1rem;
}

.palaces-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.palace-item {
  background: white;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.palace-name {
  display: block;
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.palace-stars {
  display: block;
  font-size: 0.9rem;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.palace-meaning {
  font-size: 0.85rem;
  color: #777;
  line-height: 1.4;
}

.destiny-content,
.personality-content,
.career-content,
.relationship-content {
  background: white;
  padding: 1.5rem;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.destiny-content p,
.personality-content p,
.career-content p,
.relationship-content p {
  color: #666;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .ziwei-container {
    padding: 0 1rem;
  }
  
  .ziwei-form {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .loading-container,
  .error-container {
    padding: 2rem;
    margin-bottom: 1.5rem;
  }
  
  .ziwei-result {
    padding: 1.5rem;
  }
  
  .result-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .palaces-grid {
    grid-template-columns: 1fr;
  }
  
  .destiny-content,
  .personality-content,
  .career-content,
  .relationship-content {
    padding: 1rem;
  }
}
</style>
