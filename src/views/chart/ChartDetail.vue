<!-- 星盘详细参数：星体信息、宫主星、相位表，可作组件或独立页内容 -->
<template>
  <div class="chart-detail">
    <div v-if="!hasData" class="empty-state">
      <div class="empty-state-icon">📋</div>
      <div>暂无详细参数</div>
    </div>
    <template v-else>
      <section v-if="planetList.length" class="detail-section">
        <h3 class="detail-section-title">星体信息</h3>
        <table class="detail-table">
          <thead>
            <tr>
              <th>星体</th>
              <th>星座度数</th>
              <th>宫位</th>
              <th>逆行</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(p, i) in planetList" :key="'p-' + i">
              <td>{{ p.planet_cn || p.planet_en }}</td>
              <td>{{ planetSignDegree(p) }}</td>
              <td>第{{ p.house_id }}宫</td>
              <td><span v-if="isRetrograde(p)" class="retrograde">逆行</span></td>
            </tr>
          </tbody>
        </table>
      </section>
      <section v-if="houseList.length" class="detail-section">
        <h3 class="detail-section-title">宫主星</h3>
        <table class="detail-table">
          <thead>
            <tr>
              <th>宫位</th>
              <th>星座度数</th>
              <th>宫主星</th>
              <th>飞入</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(h, i) in houseList" :key="'h-' + i">
              <td>第{{ h.house_id }}宫</td>
              <td>{{ houseSignDegree(h) }}</td>
              <td>{{ houseGuardian(h) }}</td>
              <td>{{ houseFlyInto(h) }}</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section v-if="aspectTableData.planets.length" class="detail-section">
        <h3 class="detail-section-title">相位表</h3>
        <table class="aspect-grid">
          <tbody>
            <tr v-for="(row, i) in aspectTableData.rows" :key="'row-' + i">
              <th>{{ row.planetShort }}</th>
              <td
                v-for="(cell, j) in row.cells"
                :key="'c-' + j"
                :class="{ empty: !cell }"
              >
                <span v-if="cell" class="aspect-cell" :class="'aspect-' + (cell.class || '')">{{ cell.short }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatPlanetLabel } from '../../utils/astroChartDisplay.js'

const props = defineProps({
  chartData: { type: Object, default: null }
})

const planetList = computed(() => {
  const d = props.chartData
  const raw = d?.planet ?? d?.planets
  return Array.isArray(raw) ? raw : []
})
const houseList = computed(() => {
  const d = props.chartData
  const raw = d?.house ?? d?.houses
  return Array.isArray(raw) ? raw : []
})

const hasData = computed(() => planetList.value.length > 0 || houseList.value.length > 0)

function formatLongitude(longitude) {
  if (longitude == null) return '-'
  const deg = Math.floor(longitude)
  const min = Math.floor((longitude - deg) * 60)
  const sec = Math.round(((longitude - deg) * 60 - min) * 60)
  return `${deg}°${min}'${sec}"`
}
function planetSignDegree(planet) {
  const sign = planet.sign
  const name = !sign ? '-' : typeof sign === 'string' ? sign : (sign.sign_cn || sign.sign_en || '-')
  if (name === '-') return '-'
  const lon = planet.longitude != null ? planet.longitude % 30 : 0
  return name + ' ' + formatLongitude(lon)
}
function houseSignDegree(house) {
  const sign = house.sign
  const name = !sign ? '-' : typeof sign === 'string' ? sign : (sign.sign_cn || sign.sign_en || '-')
  if (name === '-') return '-'
  const lon = house.longitude != null ? house.longitude % 30 : 0
  return name + ' ' + formatLongitude(lon)
}
function houseGuardian(house) {
  if (!house.main_planet?.length) return '-'
  const p = house.main_planet[0]
  return p.planet_cn || p.planet_en || '-'
}
function houseFlyInto(house) {
  const guardian = houseGuardian(house)
  if (guardian === '-' || !planetList.value.length) return '-'
  const p = planetList.value.find((x) => (x.planet_cn || x.planet_en) === guardian)
  if (!p) return '-'
  const sign = p.sign
  const signName = !sign ? '' : typeof sign === 'string' ? sign : (sign.sign_cn || sign.sign_en || '')
  return (signName ? signName + ' ' : '') + '第' + p.house_id + '宫'
}
function isRetrograde(planet) {
  const speed = parseFloat(planet.speed)
  return !Number.isNaN(speed) && speed < 0
}

const ASPECT_ANGLES = { 0: '合', 60: '六', 90: '刑', 120: '拱', 150: '补', 180: '冲' }
const ASPECT_CLASSES = { 0: 'conjunction', 60: 'sextile', 90: 'square', 120: 'trine', 150: 'quincunx', 180: 'opposition' }
const ALLOWED_PLANETS = ['Sun', '太阳', 'Moon', '月亮', 'Mercury', '水星', 'Venus', '金星', 'Mars', '火星', 'Jupiter', '木星', 'Saturn', '土星', 'Uranus', '天王星', 'Neptune', '海王星', 'Pluto', '冥王星', 'Ascendant', '上升点', 'AC', 'North Node', '北交点', 'True Node', 'Mean Node']

/** 与星盘图一致用单字（日、月…），避免 planet_cn「太阳」取 charAt(0) 变成「太」 */
function aspectPlanetShort(p, chartData) {
  if (p.planet_en) {
    const lbl = formatPlanetLabel(p.planet_en, 'zh', chartData)
    if (lbl) return [...lbl][0]
  }
  return (p.planet_cn || p.planet_en || '?').charAt(0)
}

const aspectTableData = computed(() => {
  const list = planetList.value
  const chartData = { planet: list }
  const planets = list
    .filter((p) => ALLOWED_PLANETS.includes(p.planet_en || '') || ALLOWED_PLANETS.includes(p.planet_cn || ''))
    .map((p) => ({
      name: p.planet_cn || p.planet_en,
      short: aspectPlanetShort(p, chartData),
      code: p.planet_en
    }))
  const aspectMap = {}
  list.forEach((planet) => {
    const p1 = planet.planet_cn || planet.planet_en
    if (!planets.some((x) => x.name === p1)) return
    ;(planet.planet_allow_degree || []).forEach((a) => {
      const p2 = a.planet_cn || a.planet_en
      if (!planets.some((x) => x.name === p2)) return
      const key = p1 < p2 ? p1 + '|' + p2 : p2 + '|' + p1
      if (!aspectMap[key]) aspectMap[key] = { angle: a.asp_angle, short: ASPECT_ANGLES[a.asp_angle] ?? '合', class: ASPECT_CLASSES[a.asp_angle] ?? 'conjunction' }
    })
  })
  const rows = []
  planets.forEach((p1, i) => {
    const cells = []
    for (let j = 0; j < i; j++) {
      const p2 = planets[j]
      const key = p1.name < p2.name ? p1.name + '|' + p2.name : p2.name + '|' + p1.name
      cells.push(aspectMap[key] || null)
    }
    rows.push({ planetShort: p1.short, cells })
  })
  return { planets, rows }
})
</script>

<style scoped>
.chart-detail {
  padding: 0;
}
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}
.empty-state-icon {
  font-size: 36px;
  margin-bottom: 10px;
  opacity: 0.5;
}
.detail-section {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}
.detail-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}
.detail-section-title {
  font-size: 1.1em;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e0e0e0;
}
.detail-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.detail-table thead {
  background: #f8f9fa;
}
.detail-table th,
.detail-table td {
  padding: 8px 10px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}
.detail-table th {
  font-weight: 600;
  color: #666;
}
.detail-table tbody tr:hover {
  background: #f8f9fa;
}
.retrograde {
  color: #e74c3c;
  font-weight: 600;
}
.aspect-grid {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.aspect-grid th,
.aspect-grid td {
  padding: 4px 6px;
  text-align: center;
  border: 1px solid #e0e0e0;
}
.aspect-grid th {
  background: #f8f9fa;
  font-weight: 600;
  color: #666;
}
.aspect-grid td.empty {
  background: #fafafa;
}
.aspect-cell {
  display: inline-block;
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: 600;
  font-size: 11px;
}
.aspect-conjunction { background: #ff6b6b; color: #fff; }
.aspect-sextile { background: #51cf66; color: #fff; }
.aspect-square { background: #ff8787; color: #fff; }
.aspect-trine { background: #4dabf7; color: #fff; }
.aspect-quincunx { background: #ffa94d; color: #fff; }
.aspect-opposition { background: #e03131; color: #fff; }
</style>
