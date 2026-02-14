<template>
  <div class="match-natal-card">
    <table class="match-table">
      <thead>
        <tr>
          <th v-for="p in pillars" :key="p.type" class="match-th">{{ pillarColLabel(p.type) }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td v-for="p in pillars" :key="'tg-' + p.type" class="match-td">
            <span class="match-td-char">
              <span class="pillar-char tg" :class="wuXingClass(p.tg)">{{ p.tg }}</span>
              <span v-if="shenShortChars(p, 'gan').length" class="pillar-shen-vertical">
                <span v-for="(c, i) in shenShortChars(p, 'gan')" :key="'gan-' + p.type + '-' + i" class="pillar-shen-char">{{ c }}</span>
              </span>
            </span>
          </td>
        </tr>
        <tr>
          <td v-for="p in pillars" :key="'dz-' + p.type" class="match-td">
            <span class="match-td-char">
              <span class="pillar-char dz" :class="wuXingClass(p.dz)">{{ p.dz }}</span>
              <span v-if="shenShortChars(p, 'zhi').length" class="pillar-shen-vertical">
                <span v-for="(c, i) in shenShortChars(p, 'zhi')" :key="'zhi-' + p.type + '-' + i" class="pillar-shen-char">{{ c }}</span>
              </span>
            </span>
          </td>
        </tr>
        <tr v-if="dayunList.length">
          <td colspan="4" class="match-dayun-cell">
            <div class="dayun-rows">
              <div class="dayun-row dayun-ages">
                <span v-for="(d, i) in dayunList" :key="'age-' + i" class="dayun-cell">{{ d.key || '--' }}</span>
              </div>
              <div class="dayun-row dayun-gz">
                <span v-for="(d, i) in dayunList" :key="'gz-' + i" class="dayun-cell dayun-gz-vertical">
                  <span v-if="d.tg || d.dz" class="dayun-gz-chars">
                    <span class="dayun-tg">{{ d.tg || ' ' }}</span>
                    <span class="dayun-dz">{{ d.dz || ' ' }}</span>
                  </span>
                  <span v-else>--</span>
                </span>
              </div>
              <div class="dayun-row dayun-years">
                <span v-for="(d, i) in dayunList" :key="'yr-' + i" class="dayun-cell">{{ d.sub_key || '--' }}</span>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="4" class="match-row-label">纳音</td>
        </tr>
        <tr>
          <td v-for="p in pillars" :key="'ny-' + p.type" class="match-td" :class="naYinWxClass(p.na_yin)">{{ p.na_yin || '--' }}</td>
        </tr>
        <tr>
          <td colspan="4" class="match-row-label">空亡</td>
        </tr>
        <tr>
          <td v-for="p in pillars" :key="'kw-' + p.type" class="match-td">{{ p.kong_wang || '--' }}</td>
        </tr>
        <tr>
          <td colspan="4" class="match-row-label">地势</td>
        </tr>
        <tr>
          <td v-for="p in pillars" :key="'ds-' + p.type" class="match-td">{{ p.di_shi || '--' }}</td>
        </tr>
        <tr>
          <td colspan="4" class="match-row-label">自坐</td>
        </tr>
        <tr>
          <td v-for="p in pillars" :key="'zz-' + p.type" class="match-td">{{ p.zi_zuo || '--' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { pillarList, joinList, wuXingClass } from '../../composables/useBazi'

const props = defineProps({
  data: {
    type: Object,
    default: null
  }
})

const pillarLabelShort = {
  natal_year: '年',
  natal_month: '月',
  natal_day: '日',
  natal_hour: '时'
}

function pillarColLabel(type) {
  return pillarLabelShort[type] || type || '--'
}

function shenShort(p, kind) {
  if (kind === 'gan') {
    return p.gan_shen_short ?? p.gan_shen ?? ''
  }
  if (kind === 'zhi') {
    if (p.zhi_shen_short) return p.zhi_shen_short
    const zs = p.zhi_shen
    return Array.isArray(zs) && zs.length ? zs.join('') : (p.zhi_shen_short || '')
  }
  return ''
}

/** 去掉 [] 和标点，拆成单字数组，竖排用 */
function shenShortChars(p, kind) {
  const raw = shenShort(p, kind)
  if (!raw) return []
  const s = String(raw).replace(/[\[\]、，。\s,，、]/g, '')
  return s ? [...s] : []
}

const pillars = computed(() => pillarList(props.data?.pillars || []))

const dayunList = computed(() => {
  const d = props.data?.flow_decadal || props.data?.decadal || []
  return Array.isArray(d) ? d.slice(0, 8) : []
})

function naYinWxClass(naYin) {
  if (!naYin || typeof naYin !== 'string') return ''
  if (/木|桑|柘|榴|杨|柳|松|柏|大林|林|平地|石榴|长流|井泉|大溪|涧下/.test(naYin)) return 'wx-wood'
  if (/火|灯|炉|覆|山头|山下|霹雳|天上/.test(naYin)) return 'wx-fire'
  if (/土|城|壁|沙|路|大驿|屋上|壁上|沙中/.test(naYin)) return 'wx-earth'
  if (/金|海|沙|白|金箔|钗钏|剑锋/.test(naYin)) return 'wx-metal'
  if (/水|涧|泉|长流|大溪|大海|天河水/.test(naYin)) return 'wx-water'
  return ''
}
</script>

<style scoped>
.match-natal-card {
  font-size: 12px;
  color: #333;
}

.match-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  margin-bottom: 10px;
}

.match-table th,
.match-table td {
  border: 1px solid #eee;
  padding: 4px 6px;
  vertical-align: middle;
  text-align: center;
}

.match-th {
  font-size: 11px;
  color: #666;
  font-weight: 600;
  background: #fafafa;
}

.match-table td.match-row-label {
  text-align: left;
  color: #666;
  font-size: 11px;
  font-weight: 600;
  background: #f5f5f5;
  padding: 4px 8px;
}

.match-td {
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

.match-td-char {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  line-height: 1.2;
}

.match-td-char .pillar-char {
  font-size: 18px;
  font-weight: 600;
}

.pillar-shen-vertical {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.1;
}

.pillar-shen-char {
  font-size: 10px;
  color: #888;
}

.wood { color: #4CAF50; }
.fire { color: #F44336; }
.earth { color: #795548; }
.metal { color: #C9A227; }
.water { color: #2196F3; }

.wx-wood { color: #2E7D32; }
.wx-fire { color: #C62828; }
.wx-earth { color: #6D4C41; }
.wx-metal { color: #C9A227; }
.wx-water { color: #1565C0; }

.match-table td.match-dayun-cell {
  text-align: left;
  padding: 6px 8px;
  vertical-align: top;
}

.dayun-rows {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dayun-row {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 2px;
  font-size: 10px;
}

.dayun-cell {
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dayun-gz .dayun-cell { font-weight: 600; }

.dayun-gz-vertical .dayun-gz-chars {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.1;
}

.dayun-gz-vertical .dayun-tg,
.dayun-gz-vertical .dayun-dz {
  display: block;
}

/* 移动端 */
@media (max-width: 600px) {
  .match-natal-card {
    font-size: 11px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .match-table {
    margin-bottom: 8px;
  }

  .match-table th,
  .match-table td {
    padding: 3px 4px;
  }

  .match-th {
    font-size: 10px;
  }

  .match-table td.match-row-label {
    font-size: 10px;
    padding: 3px 6px;
  }

  .match-td {
    font-size: 10px;
  }

  .match-td-char .pillar-char {
    font-size: 15px;
  }

  .pillar-shen-char {
    font-size: 9px;
  }

  .match-table td.match-dayun-cell {
    padding: 4px 6px;
  }

  .dayun-row {
    font-size: 9px;
    gap: 1px;
  }

  .dayun-cell {
    min-width: 0;
  }
}
</style>
