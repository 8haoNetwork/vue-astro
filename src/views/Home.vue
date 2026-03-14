<template>
  <div class="home-page">
    <h1 class="page-title">Astro Demo</h1>
    <p class="page-desc">星座、运势、星盘等功能的演示，请使用上方菜单进入各功能。</p>

    <div class="home-visual">
      <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="100" cy="60" r="28" fill="none" stroke="#e0e0e0" stroke-width="2" />
        <circle cx="100" cy="60" r="4" fill="#ddd" />
        <circle cx="60" cy="35" r="3" fill="#e8e8e8" />
        <circle cx="140" cy="45" r="2.5" fill="#e8e8e8" />
        <circle cx="75" cy="85" r="2" fill="#eee" />
        <circle cx="125" cy="78" r="2.5" fill="#eee" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  max-width: 640px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px;
}

.page-desc {
  color: #666;
  font-size: 14px;
  margin: 0 0 32px;
  line-height: 1.5;
}

.home-visual {
  margin-top: 24px;
  padding: 48px 24px;
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-visual svg {
  width: 100%;
  max-width: 280px;
  height: auto;
}
</style>
