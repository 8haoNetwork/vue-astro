<template>
  <section class="bazi-card">
    <table class="bazi-table flow-six">
      <thead>
        <tr>
          <th class="corner-cell"></th>
          <th>年柱</th>
          <th>月柱</th>
          <th>日柱</th>
          <th>时柱</th>
          <th>流年</th>
          <th>流月</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="left-label">天干</td>
          <td
            v-for="item in flowPillars(data)"
            :key="`flow-tg-${item.key}`"
            class="cell-char tg"
            :class="wuXingClass(item.tg)"
          >
            {{ item.tg }}
          </td>
        </tr>
        <tr>
          <td class="left-label">地支</td>
          <td
            v-for="item in flowPillars(data)"
            :key="`flow-dz-${item.key}`"
            class="cell-char dz"
            :class="wuXingClass(item.dz)"
          >
            {{ item.dz }}
          </td>
        </tr>
        <tr>
          <td class="left-label">藏干</td>
          <td
            v-for="item in flowPillars(data)"
            :key="`flow-tg-shen-sha-${item.key}`"
            class="multi-line"
          >
            {{ item.tg_shen_sha || '--' }}
          </td>
        </tr>
        <tr>
          <td class="left-label">星运</td>
          <td
            v-for="item in flowPillars(data)"
            :key="`flow-dz-shen-sha-${item.key}`"
            class="multi-line"
          >
            {{ item.dz_shen_sha || '--' }}
          </td>
        </tr>
        <tr>
          <td class="left-label">空亡</td>
          <td v-for="item in flowPillars(data)" :key="`flow-na-yin-${item.key}`">
            {{ item.na_yin_wx || '--' }}
          </td>
        </tr>
        <tr>
          <td class="left-label">纳音</td>
          <td v-for="item in flowPillars(data)" :key="`flow-sub-key-${item.key}`">
            {{ item.sub_key || '--' }}
          </td>
        </tr>
      </tbody>
    </table>

    <div class="meta-wrap">
      <div class="meta-line">目标时间：{{ data.target_dt }}</div>
      <div class="meta-line">大运起运：{{ data.flow_start_dt }}</div>
      <div class="meta-line">本命天干冲克：{{ joinListComma(data.tg_chong_ke) }}</div>
      <div class="meta-line">本命地支冲克：{{ joinListComma(data.dz_chong_ke) }}</div>
      <div class="meta-line">流盘天干冲克：{{ joinListComma(data.flow_tg_chong_ke) }}</div>
      <div class="meta-line">流盘地支冲克：{{ joinListComma(data.flow_dz_chong_ke) }}</div>
    </div>

    <div class="flow-section">
      <div class="strip-head">大运</div>
      <div class="strip-list">
        <div
          v-for="item in (data.flow_decadal || [])"
          :key="`flow-decadal-${item.key}`"
          class="strip-item"
          :class="{ current: item.is_current }"
        >
          <div class="strip-key">{{ item.key }}</div>
          <div class="strip-gz">
            <span :class="wuXingClass(item.tg)">{{ item.tg }}</span>
            <span :class="wuXingClass(item.dz)">{{ item.dz }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="flow-section">
      <div class="strip-head">流年</div>
      <div class="strip-list">
        <div
          v-for="item in (data.flow_year || [])"
          :key="`flow-year-${item.key}`"
          class="strip-item"
          :class="{ current: item.is_current }"
        >
          <div class="strip-key">{{ item.key }}</div>
          <div class="strip-gz">
            <span :class="wuXingClass(item.tg)">{{ item.tg }}</span>
            <span :class="wuXingClass(item.dz)">{{ item.dz }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { flowPillars, joinListComma, wuXingClass } from '../composables/useBazi'

defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.bazi-card {
  border: 1px solid #f0ebe7;
  border-radius: 14px;
  overflow: hidden;
}

.bazi-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.bazi-table.flow-six .cell-char {
  min-height: 52px !important;
}

.bazi-table th,
.bazi-table td {
  min-height: 34px;
  border: 1px solid #f2f2f2;
  text-align: center;
  padding: 4px;
  font-size: 13px;
  color: #303030;
  word-break: break-word;
  vertical-align: middle;
}

.bazi-table td.multi-line {
  vertical-align: top;
}

.bazi-table th {
  font-weight: 600;
  background: #faf6f3;
}

.left-label {
  text-align: left !important;
  padding-left: 8px !important;
  color: #4f4f4f !important;
  background: #fafafa;
  width: 58px;
}

.corner-cell {
  width: 58px;
  background: #faf6f3;
}

.cell-char {
  font-size: 26px !important;
  font-weight: 400;
  line-height: 1;
  min-height: 72px !important;
}

.multi-line {
  white-space: pre-line;
  line-height: 1.5;
}

.wood { color: #5da174; }
.fire { color: #db6473; }
.earth { color: #9b6f4e; }
.metal { color: #c98d47; }
.water { color: #5ea6d8; }

.meta-wrap {
  padding: 10px 12px;
  background: #fff;
}

.meta-line {
  font-size: 12px;
  color: #666;
  line-height: 1.8;
}

.flow-section {
  border-top: 1px solid #f2f2f2;
  padding: 10px 10px 12px;
}

.strip-head {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.strip-list {
  display: flex;
  overflow-x: auto;
  gap: 8px;
}

.strip-item {
  min-width: 68px;
  border: 1px solid #efe7e1;
  border-radius: 10px;
  padding: 6px;
  background: #fff;
  text-align: center;
}

.strip-item.current {
  background: #fef4ef;
  border-color: #efcfbd;
}

.strip-key {
  font-size: 12px;
  color: #666;
}

.strip-gz {
  margin-top: 4px;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}
</style>
