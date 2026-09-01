<template>
  <div class="app-container">
    <header class="app-header">
      <AppLangSelector class="app-header__lang" />
      <h1 class="app-title">ApiWorks Astro Demo</h1>
      <nav class="main-nav">
        <router-link to="/">首页</router-link>
        <router-link to="/sign">星座</router-link>
        <router-link to="/scope">运势</router-link>
        <router-link to="/chart">星盘</router-link>
        <router-link to="/ziwei">紫薇</router-link>
        <router-link to="/star">星宿</router-link>
        <router-link to="/bazi">生辰</router-link>
        <router-link to="/qimen">奇门</router-link>
        <router-link to="/liuren">六壬</router-link>
        <router-link to="/qizheng">政余</router-link>
      </nav>
    </header>
    <main class="app-main">
      <router-view />
    </main>
    <footer class="app-footer">
      <p class="footer-powered">
        Powered by <a href="https://astro.apiworks.com" target="_blank" rel="noopener noreferrer">apiworks.com</a>
      </p>
    </footer>
  </div>
</template>

<script setup>
import AppLangSelector from './components/AppLangSelector.vue'
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 2rem 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.app-header__lang {
  position: absolute;
  top: 0.5rem;
  right: 0.65rem;
  z-index: 2;
}

.app-title {
  margin: 0 0 0.6rem 0;
  padding-right: 4.5rem;
  font-size: 0.85rem;
  font-weight: 500;
  text-align: center;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.02em;
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

.app-footer p {
  margin: 0.25rem 0;
}

.footer-powered {
  font-size: 0.75rem;
  opacity: 0.65;
}

.footer-powered a {
  color: inherit;
  text-decoration: none;
}

.footer-powered a:hover {
  opacity: 1;
}

@media (max-width: 768px) {
  .app-header {
    padding: 0.65rem 0.75rem 0.85rem;
  }

  .app-header__lang {
    top: 0.4rem;
    right: 0.5rem;
  }

  .app-title {
    font-size: 0.8rem;
    padding-right: 3.8rem;
  }

  .main-nav {
    gap: 0.5rem;
  }

  .main-nav a {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }

  .app-main {
    padding: 0rem;
  }
}
</style>
