<template>
  <div class="star-container">
    <h1>{{ $t('star.title') }}</h1>
    
    <div class="star-form">
      <div class="form-group">
        <label for="birthDate">{{ $t('star.form.birthDate') }}</label>
        <input type="date" id="birthDate" v-model="birthDate" required>
      </div>
      
      <div class="form-group">
        <label for="birthTime">{{ $t('star.form.birthTime') }}</label>
        <input type="time" id="birthTime" v-model="birthTime" required>
      </div>
      
      <div class="form-actions">
        <button class="btn btn-primary" @click="fetchStarData">{{ $t('star.form.query') }}</button>
      </div>
    </div>
    
    <div v-if="loading" class="loading-container">
      <div class="loading"></div>
      <p>{{ $t('star.loading') }}</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <p class="error">{{ error }}</p>
    </div>
    
    <div v-else-if="starData" class="star-result">
      <div class="result-header">
        <h2>{{ $t('star.result.header') }}</h2>
        <p class="birth-info">{{ $t('star.result.birthInfo') }}{{ birthDate }} {{ birthTime }}</p>
        <p class="analysis-time" v-if="starData.analysis_time">{{ $t('star.result.analysisTime') }}{{ starData.analysis_time }}</p>
      </div>
      
      <!-- Tab切换 -->
      <div class="tab-container">
        <div class="tab-buttons">
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'natal' }"
            @click="activeTab = 'natal'"
          >
            {{ $t('star.result.natal.title') }}
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'daily' }"
            @click="activeTab = 'daily'"
          >
            {{ $t('star.result.daily.title') }}
          </button>
        </div>
        
        <div class="tab-content">
          <!-- 本命星宿Tab -->
          <div v-if="activeTab === 'natal'" class="tab-panel">
            <div class="star-svg-container">
              <StarMansionChart :naksIdx="starData.natal_naks_info.idx" />
              
              <!-- 本命星宿解读 -->
              <div class="interps-section" v-if="starData.natal_interps && starData.natal_interps.length > 0">
                <h4>{{ $t('star.result.natal.interpretation') }}</h4>
                <div v-for="(section, index) in starData.natal_interps" :key="index" class="interp-item">
                  <h5>{{ section.title }}</h5>
                  <p>{{ section.content }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 值日星宿Tab -->
          <div v-if="activeTab === 'daily'" class="tab-panel">
            <div class="star-svg-container">
              <StarMansionChart :naksIdx="starData.daily_naks_info.idx" />
              
              <!-- 值日星宿解读 -->
              <div class="interps-section" v-if="starData.daily_interps && starData.daily_interps.length > 0">
                <h4>{{ $t('star.result.daily.interpretation') }}</h4>
                <div v-for="(section, index) in starData.daily_interps" :key="index" class="interp-item">
                  <h5>{{ section.title }}</h5>
                  <p>{{ section.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 与他人本命星宿关系 -->
      <div class="relation-section" v-if="starData.others_natal_relation && starData.others_natal_relation.length > 0">
        <h3>{{ $t('star.result.relation.natalTitle') }}</h3>
        <div v-for="(relation, index) in starData.others_natal_relation" :key="index" class="relation-item">
          <div class="relation-header">
            <span class="relation-name">{{ getStarName(relation.other_naks.name) }}</span>
            <span class="relation-type">{{ getRelationTypeName(relation.relation_type) }}</span>
            <span class="relation-reverse" v-if="relation.is_reverse">{{ $t('star.result.relation.reverse') }}</span>
          </div>
          
          <!-- 关系描述 -->
          <div v-if="relation.comments" class="relation-comments">
            <p class="description">{{ relation.comments.description }}</p>
            
            <!-- 附加描述信息 -->
            <div v-if="relation.comments.comments && relation.comments.comments.length > 0" class="additional-comments">
              <div v-for="(section, secIndex) in relation.comments.comments" :key="secIndex" class="section">
                <h5>{{ section.title }}</h5>
                <p>{{ section.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 与他人值日星宿关系 -->
      <div class="relation-section" v-if="starData.others_daily_relation && starData.others_daily_relation.length > 0">
        <h3>{{ $t('star.result.relation.dailyTitle') }}</h3>
        <div v-for="(relation, index) in starData.others_daily_relation" :key="index" class="relation-item">
          <div class="relation-header">
            <span class="relation-name">{{ getStarName(relation.other_naks.name) }}</span>
            <span class="relation-type">{{ getRelationTypeName(relation.relation_type) }}</span>
            <span class="relation-reverse" v-if="relation.is_reverse">{{ $t('star.result.relation.reverse') }}</span>
          </div>
          
          <!-- 关系描述 -->
          <div v-if="relation.comments" class="relation-comments">
            <p class="description">{{ relation.comments.description }}</p>
            
            <!-- 附加描述信息 -->
            <div v-if="relation.comments.comments && relation.comments.comments.length > 0" class="additional-comments">
              <div v-for="(section, secIndex) in relation.comments.comments" :key="secIndex" class="section">
                <h5>{{ section.title }}</h5>
                <p>{{ section.content }}</p>
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
import { useI18n } from 'vue-i18n'
import { fetchStar } from '../services/api'
import { zhCN, enUS, i18n } from '../i18n'
import StarMansionChart from '../components/StarMansionChart.vue'

const { t } = useI18n()

// 设置默认值：日期为1999-01-02，时间为当前时间
const now = new Date()
const birthDate = ref('1999-01-02')
const birthTime = ref(now.toTimeString().slice(0, 5))
const loading = ref(false)
const error = ref('')
const starData = ref(null)
const activeTab = ref('natal') // 默认显示本命星宿

// 翻译星宿名称：英文简写 -> 对应语言的名称
const getStarName = (name) => {
  if (!name) return ''
  // 根据当前语言决定显示中文还是英文
  if (i18n.global.locale.value === 'zh-CN') {
    // 中文模式：显示中文名称
    return zhCN.starNames[name] || name
  } else {
    // 英文模式：显示英文名称
    return enUS.starNames[name] || name
  }
}

// 翻译关系类型名称
const getRelationTypeName = (type) => {
  if (!type) return ''
  if (i18n.global.locale.value === 'zh-CN') {
    return zhCN.relationTypes[type] || type
  } else {
    return enUS.relationTypes[type] || type
  }
}

// 调用API获取星宿数据
    const fetchStarData = async () => {
      if (!birthDate.value || !birthTime.value) {
        error.value = $t('star.error.selectDateTime')
        return
      }
      
      loading.value = true
      error.value = ''
      
      try {
        // 构建请求参数 - 适配新的后端接口格式
        const qry = {
          birth_info: {
            birthday: `${birthDate.value} ${birthTime.value}:00`,
            tz: 8,
            longitude: null,
            latitude: null,
            user_id: ''
          },
          others_birth_info: [],
          target_date: null,
          is_solar_time: false,
          is_late_zi: false,
          niu_xiu_handle: 'nvxiu'
        }
        
        // 调用API服务
        const response = await fetchStar(qry)
        
        // 检查响应是否成功
        if (response.code === 0 && response.data) {
          starData.value = response.data
        } else {
          error.value = response.msg || $t('star.error.fetchFailed')
        }
      } catch (err) {
        error.value = $t('star.error.queryFailed')
        console.error('API调用错误:', err)
      } finally {
        loading.value = false
      }
    }
</script>

<style scoped>
.star-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.star-container h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 2.5rem;
}

.star-form {
  background: #f9f9f9;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
  font-size: 1rem;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #4CAF50;
}

.form-actions {
  text-align: center;
  margin-top: 30px;
}

.btn {
  padding: 12px 30px;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: bold;
}

.btn-primary {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
}

.loading-container {
  text-align: center;
  padding: 50px;
}

.loading {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  text-align: center;
  padding: 30px;
  background: #ffebee;
  border-radius: 10px;
  border-left: 5px solid #f44336;
  margin-bottom: 30px;
}

.error {
  color: #c62828;
  font-size: 1.1rem;
  font-weight: bold;
}

.star-result {
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.result-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #4CAF50;
}

.result-header h2 {
  color: #333;
  margin-bottom: 15px;
  font-size: 2rem;
}

.birth-info {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 10px;
}

.analysis-time {
  color: #999;
  font-size: 0.9rem;
}

/* Tab样式 */
.tab-container {
  margin-top: 30px;
}

.tab-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  gap: 10px;
}

.tab-btn {
  padding: 12px 30px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.3s;
  font-weight: bold;
  color: #666;
}

.tab-btn:hover {
  border-color: #4CAF50;
  color: #4CAF50;
}

.tab-btn.active {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.tab-content {
  background: #f9f9f9;
  padding: 30px;
  border-radius: 10px;
  min-height: 400px;
}

.tab-panel {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* SVG星宿容器 */
.star-svg-container {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

/* SVG样式 */
.star-svg {
  width: 100%;
  max-width: 500px;
  height: auto;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

/* SVG文字样式 */
.svg-number {
  font-size: 48px;
  font-weight: bold;
  fill: #333;
  font-family: 'Arial', sans-serif;
}

.svg-name {
  font-size: 28px;
  font-weight: bold;
  fill: #4CAF50;
  font-family: 'Arial', sans-serif;
}

.svg-element {
  font-size: 18px;
  fill: #666;
  font-family: 'Arial', sans-serif;
}

.svg-outer-text {
  font-size: 14px;
  fill: #888;
  font-family: 'Arial', sans-serif;
  letter-spacing: 1px;
}

/* 新的SVG文字样式 */
.svg-number-large {
  font-size: 60px;
  font-weight: bold;
  fill: #d4af37;
  font-family: 'SimHei', '黑体', sans-serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.svg-name-large {
  font-size: 32px;
  font-weight: bold;
  fill: #c41e3a;
  font-family: 'SimHei', '黑体', sans-serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.svg-element-large {
  font-size: 24px;
  fill: #003366;
  font-family: 'SimHei', '黑体', sans-serif;
  font-weight: 500;
}

.svg-symbols {
  font-size: 20px;
  font-weight: bold;
  fill: #006400;
  font-family: 'SimHei', '黑体', sans-serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.svg-star-text {
  font-size: 14px;
  fill: #4b0082;
  font-family: 'SimSun', '宋体', sans-serif;
  font-weight: 500;
  text-shadow: 0.5px 0.5px 1px rgba(0, 0, 0, 0.1);
}

/* SVG动画 */
@keyframes svg-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.02);
    opacity: 0.9;
  }
}

.star-svg circle {
  transition: all 0.3s ease;
}

.star-svg:hover circle {
  animation: svg-pulse 2s ease-in-out infinite;
}

/* 解读部分 */
.interps-section {
  margin-top: 25px;
  width: 100%;
}

.interps-section h4 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.4rem;
  border-left: 4px solid #4CAF50;
  padding-left: 15px;
}

.interp-item {
  margin-bottom: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
}

.interp-item h5 {
  color: #4CAF50;
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.interp-item p {
  color: #666;
  line-height: 1.6;
  font-size: 1rem;
}

/* 关系部分 */
.relation-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.relation-section h3 {
  color: #42b883;
  margin-bottom: 15px;
}

.relation-item {
  margin-bottom: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 6px;
}

.relation-header {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.relation-name {
  font-weight: bold;
  color: #42b883;
  font-size: 16px;
}

.relation-type {
  background: #42b883;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
}

.relation-reverse {
  color: #ff9800;
  font-size: 14px;
  font-weight: 500;
}

.relation-comments .description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 10px;
}

.additional-comments .section {
  margin-top: 15px;
  padding: 10px;
  background: #fff;
  border-radius: 4px;
}

.additional-comments .section h5 {
  color: #333;
  margin-bottom: 5px;
  font-size: 14px;
}

.additional-comments .section p {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .star-container {
    padding: 10px;
  }
  
  .star-container h1 {
    font-size: 2rem;
  }
  
  .star-form {
    padding: 20px;
  }
  
  .tab-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .tab-btn {
    width: 100%;
    max-width: 250px;
  }
  
  .tab-content {
    padding: 20px;
  }
  
  .star-circle {
    width: 160px;
    height: 160px;
  }
  
  .star-number {
    font-size: 3rem;
  }
  
  .star-name-large {
    font-size: 1.2rem;
  }
  
  .star-details {
    padding: 20px;
  }
}
</style>