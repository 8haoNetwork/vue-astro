<template>
  <div class="chart-page">
    <h1 class="page-title">{{ $t('chart.title') }}</h1>
    <p class="page-desc">{{ $t('chart.desc') }}</p>
    <div class="mode-cards">
      <router-link :to="{ name: 'ChartPreview', query: { mode: 'single' } }" class="mode-card">
        <div class="mode-icon">📊</div>
        <h2>{{ $t('chart.single') }}</h2>
        <p>{{ $t('chart.singleDesc') }}</p>
      </router-link>
      <router-link :to="{ name: 'ChartPreview', query: { mode: 'composite' } }" class="mode-card">
        <div class="mode-icon">👫</div>
        <h2>{{ $t('chart.composite') }}</h2>
        <p>{{ $t('chart.compositeDesc') }}</p>
      </router-link>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.chart-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px 16px;
}
.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px;
  text-align: center;
}
.page-desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 32px;
  text-align: center;
}
.mode-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}
.mode-card {
  background: #fff;
  border-radius: 14px;
  padding: 24px 20px;
  text-align: center;
  text-decoration: none;
  color: inherit;
  border: 1px solid #eee;
  transition: all 0.2s;
}
.mode-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15);
}
.mode-icon {
  font-size: 40px;
  margin-bottom: 12px;
}
.mode-card h2 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px;
}
.mode-card p {
  font-size: 13px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}
</style>
