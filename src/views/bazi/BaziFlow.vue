<template>
  <section class="bazi-card">
    <table class="bazi-table flow-table">
      <thead>
        <tr>
          <th class="corner-cell"></th>
          <th v-for="pillar in flowPillarList(data)" :key="`th-${pillar.type}`">
            {{ pillarColumnLabel(pillar.type) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="left-label">干神</td>
          <td v-for="pillar in flowPillarList(data)" :key="`gan_shen-${pillar.type}`">
            {{ pillar.gan_shen }}
          </td>
        </tr>
        <tr>
          <td class="left-label">天干</td>
          <td
            v-for="pillar in flowPillarList(data)"
            :key="`tg-${pillar.type}`"
            class="cell-char tg"
            :class="wuXingClass(pillar.tg)"
          >
            {{ pillar.tg }}
          </td>
        </tr>
        <tr>
          <td class="left-label">地支</td>
          <td
            v-for="pillar in flowPillarList(data)"
            :key="`dz-${pillar.type}`"
            class="cell-char dz"
            :class="wuXingClass(pillar.dz)"
          >
            {{ pillar.dz }}
          </td>
        </tr>
        <tr>
          <td class="left-label">藏干</td>
          <td
            v-for="pillar in flowPillarList(data)"
            :key="`cang-gan-${pillar.type}`"
            class="multi-line"
          >
            {{ joinListLines(pillar.cang_gan_zs) }}
          </td>
        </tr>
        <tr>
          <td class="left-label">星运</td>
          <td v-for="pillar in flowPillarList(data)" :key="`di-shi-${pillar.type}`">
            {{ pillar.di_shi || '--' }}
          </td>
        </tr>
        <tr>
          <td class="left-label">空亡</td>
          <td v-for="pillar in flowPillarList(data)" :key="`kong-wang-${pillar.type}`">
            {{ pillar.kong_wang || '--' }}
          </td>
        </tr>
        <tr>
          <td class="left-label">纳音</td>
          <td v-for="pillar in flowPillarList(data)" :key="`na-yin-${pillar.type}`">
            {{ pillar.na_yin || '--' }}
          </td>
        </tr>
        <tr>
          <td class="left-label">神煞</td>
          <td v-for="pillar in flowPillarList(data)" 
            :key="`shen-sha-${pillar.type}`"
            class="multi-line"
           >
            {{ joinListLines(pillar.shen_sha) }}
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flow-section">
      <div class="strip-head-row">
        <div class="strip-head">大运</div>
        <div class="strip-head-extra meta-line">{{ formatFlowStart(data.flow_start_dt, data.flow_start_age) }}</div>
      </div>
      <div class="flow-strip-wrap flow-strip-wrap-fill">
        <table class="flow-strip-table">
          <tbody>
            <tr>
              <td v-for="item in (data.flow_decadal || [])" :key="`d-key-${item.key}`" class="flow-strip-cell" :class="{ current: item.is_current }">{{ item.key }}</td>
            </tr>
            <tr>
              <td v-for="item in (data.flow_decadal || [])" :key="`d-sub-${item.key}`" class="flow-strip-cell flow-strip-sub" :class="{ current: item.is_current }">{{ item.sub_key || '--' }}</td>
            </tr>
            <tr>
              <td v-for="item in (data.flow_decadal || [])" :key="`d-tg-${item.key}`" class="flow-strip-cell flow-strip-gz" :class="{ current: item.is_current }">
                <span :class="wuXingClass(item.tg)">{{ item.tg }}</span><span class="flow-strip-shen-sha">{{ item.tg_shen_sha || '' }}</span>
              </td>
            </tr>
            <tr>
              <td v-for="item in (data.flow_decadal || [])" :key="`d-dz-${item.key}`" class="flow-strip-cell flow-strip-gz" :class="{ current: item.is_current }">
                <span :class="wuXingClass(item.dz)">{{ item.dz }}</span><span class="flow-strip-shen-sha">{{ item.dz_shen_sha || '' }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="flow-section">
      <div class="strip-head">流年</div>
      <div class="flow-strip-wrap flow-strip-wrap-fill">
        <table class="flow-strip-table">
          <tbody>
            <tr>
              <td v-for="item in (data.flow_year || [])" :key="`y-key-${item.key}`" class="flow-strip-cell" :class="{ current: item.is_current }">{{ item.key }}</td>
            </tr>
            <tr>
              <td v-for="item in (data.flow_year || [])" :key="`y-sub-${item.key}`" class="flow-strip-cell flow-strip-sub" :class="{ current: item.is_current }">{{ item.sub_key || '--' }}</td>
            </tr>
            <tr>
              <td v-for="item in (data.flow_year || [])" :key="`y-tg-${item.key}`" class="flow-strip-cell flow-strip-gz" :class="{ current: item.is_current }">
                <span :class="wuXingClass(item.tg)">{{ item.tg }}</span><span class="flow-strip-shen-sha">{{ item.tg_shen_sha || '' }}</span>
              </td>
            </tr>
            <tr>
              <td v-for="item in (data.flow_year || [])" :key="`y-dz-${item.key}`" class="flow-strip-cell flow-strip-gz" :class="{ current: item.is_current }">
                <span :class="wuXingClass(item.dz)">{{ item.dz }}</span><span class="flow-strip-shen-sha">{{ item.dz_shen_sha || '' }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="flow-section">
      <div class="strip-head">流月</div>
      <div class="flow-strip-wrap flow-strip-wrap-fill">
        <table class="flow-strip-table">
          <tbody>
            <tr>
              <td v-for="item in (data.flow_month || [])" :key="`m-key-${item.key}`" class="flow-strip-cell" :class="{ current: item.is_current }">{{ item.key }}</td>
            </tr>
            <tr>
              <td v-for="item in (data.flow_month || [])" :key="`m-sub-${item.key}`" class="flow-strip-cell flow-strip-sub" :class="{ current: item.is_current }">{{ item.sub_key || '--' }}</td>
            </tr>
            <tr>
              <td v-for="item in (data.flow_month || [])" :key="`m-tg-${item.key}`" class="flow-strip-cell flow-strip-gz" :class="{ current: item.is_current }">
                <span :class="wuXingClass(item.tg)">{{ item.tg }}</span><span class="flow-strip-shen-sha">{{ item.tg_shen_sha || '' }}</span>
              </td>
            </tr>
            <tr>
              <td v-for="item in (data.flow_month || [])" :key="`m-dz-${item.key}`" class="flow-strip-cell flow-strip-gz" :class="{ current: item.is_current }">
                <span :class="wuXingClass(item.dz)">{{ item.dz }}</span><span class="flow-strip-shen-sha">{{ item.dz_shen_sha || '' }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="flow-section">
      <div class="strip-head">流日</div>
      <div class="flow-strip-wrap flow-strip-wrap-scroll">
        <table class="flow-strip-table">
          <tbody>
            <tr>
              <td v-for="item in (data.flow_day || [])" :key="`day-key-${item.key}`" class="flow-strip-cell" :class="{ current: item.is_current }">{{ item.key }}</td>
            </tr>
            <tr>
              <td v-for="item in (data.flow_day || [])" :key="`day-sub-${item.key}`" class="flow-strip-cell flow-strip-sub" :class="{ current: item.is_current }">{{ item.sub_key || '--' }}</td>
            </tr>
            <tr>
              <td v-for="item in (data.flow_day || [])" :key="`day-tg-${item.key}`" class="flow-strip-cell flow-strip-gz" :class="{ current: item.is_current }">
                <span :class="wuXingClass(item.tg)">{{ item.tg }}</span><span class="flow-strip-shen-sha">{{ item.tg_shen_sha || '' }}</span>
              </td>
            </tr>
            <tr>
              <td v-for="item in (data.flow_day || [])" :key="`day-dz-${item.key}`" class="flow-strip-cell flow-strip-gz" :class="{ current: item.is_current }">
                <span :class="wuXingClass(item.dz)">{{ item.dz }}</span><span class="flow-strip-shen-sha">{{ item.dz_shen_sha || '' }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="chongke-section">
      <table class="chongke-table">
        <tbody>
          <tr>
            <td class="chongke-label" rowspan="2">天干</td>
            <td class="chongke-col">本命</td>
            <td>{{ joinListComma(data.tg_chong_ke) }}</td>
          </tr>
          <tr>
            <td class="chongke-col">运势</td>
            <td>{{ joinListComma(data.flow_tg_chong_ke) }}</td>
          </tr>
          <tr>
            <td class="chongke-label" rowspan="2">地支</td>
            <td class="chongke-col">本命</td>
            <td>{{ joinListComma(data.dz_chong_ke) }}</td>
          </tr>
          <tr>
            <td class="chongke-col">运势</td>
            <td>{{ joinListComma(data.flow_dz_chong_ke) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { flowPillarList, pillarColumnLabel, formatFlowStart, joinListLines, joinListComma, wuXingClass } from '../../composables/useBazi'

defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>
