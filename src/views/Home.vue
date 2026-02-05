<template>
  <div class="home-container">
    <div class="hero-section">
      <h1>探索宇宙奥秘</h1>
      <p>通过星座、星盘、紫薇、星宿、生辰等工具，了解你的命运与性格</p>
      <div class="hero-buttons">
        <router-link to="/constellation" class="btn btn-primary">开始探索</router-link>
      </div>
    </div>
    
    <div class="features-section">
      <h2>核心功能</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">♈</div>
          <h3>星座运势</h3>
          <p>每日、每周、每月星座运势分析，了解你的财运、事业、感情</p>
          <router-link to="/constellation" class="btn btn-secondary">查看详情</router-link>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">⭐</div>
          <h3>个人星盘</h3>
          <p>基于你的出生时间和地点，生成详细的个人星盘分析</p>
          <router-link to="/horoscope" class="btn btn-secondary">查看详情</router-link>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">紫微</div>
          <h3>紫薇斗数</h3>
          <p>传统命理学工具，分析你的命运格局和人生轨迹</p>
          <router-link to="/ziwei" class="btn btn-secondary">查看详情</router-link>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">星宿</div>
          <h3>星宿分析</h3>
          <p>基于中国传统星宿文化，解读你的性格和命运</p>
          <router-link to="/star" class="btn btn-secondary">查看详情</router-link>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🎂</div>
          <h3>生辰测算</h3>
          <p>根据你的出生日期，分析你的命理特征和运势走向</p>
          <router-link to="/birthday" class="btn btn-secondary">查看详情</router-link>
        </div>
      </div>
    </div>
    
    <div class="about-section">
      <h2>关于我们</h2>
      <p>我们致力于通过现代科技与传统智慧的结合，为你提供准确、专业的命理分析服务。所有数据均通过后端API接口获取，确保分析结果的准确性和专业性。</p>
      <p>无论你是想了解每日运势，还是深入探索自己的命运轨迹，我们都能为你提供全方位的命理咨询服务。</p>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
}

.hero-section {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  margin-bottom: 3rem;
}

.hero-section h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: white;
}

.hero-section p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.features-section {
  margin-bottom: 3rem;
}

.features-section h2 {
  text-align: center;
  margin-bottom: 2rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  margin-bottom: 1rem;
}

.feature-card p {
  margin-bottom: 1.5rem;
  color: #666;
}

.about-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  text-align: center;
}

.about-section h2 {
  margin-bottom: 1rem;
}

.about-section p {
  margin-bottom: 1rem;
  color: #666;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .home-container {
    padding: 1rem 0;
  }
  
  .hero-section {
    padding: 2rem 1rem;
    margin-bottom: 2rem;
  }
  
  .hero-section h1 {
    font-size: 2rem;
  }
  
  .hero-section p {
    font-size: 1rem;
  }
  
  .features-section {
    margin-bottom: 2rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .feature-card {
    padding: 1.5rem;
  }
  
  .about-section {
    padding: 1.5rem;
  }
}
</style>
