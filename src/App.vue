<template>
  <div class="app-container">
    <header class="app-header">
      <h1>星座星盘占卜</h1>
      <nav class="main-nav">
        <router-link to="/">首页</router-link>
        <router-link to="/constellation">星座</router-link>
        <router-link to="/horoscope">星盘</router-link>
        <router-link to="/ziwei">紫薇</router-link>
        <router-link to="/star">星宿</router-link>
        <router-link to="/birthday">生辰</router-link>
      </nav>
    </header>
    <main class="app-main">
      <router-view />
    </main>
    <footer class="app-footer">
      <p>© 2026 星座星盘占卜 - 探索宇宙奥秘</p>
    </footer>
  </div>
</template>

<script setup>
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  margin: 0 0 1rem 0;
  font-size: 1.8rem;
  text-align: center;
}

.main-nav {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.main-nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.main-nav a:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.app-main {
  flex: 1;
  padding: 2rem;
  background: #f5f5f5;
}

.app-footer {
  background: #333;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}

@media (max-width: 768px) {
  .app-header {
    padding: 1rem;
  }
  
  .app-header h1 {
    font-size: 1.4rem;
  }
  
  .main-nav {
    gap: 0.5rem;
  }
  
  .main-nav a {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
  
  .app-main {
    padding: 1rem;
  }
}
</style>
