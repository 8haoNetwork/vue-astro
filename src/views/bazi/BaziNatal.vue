<template>
  <section class="bazi-card">
    <div class="meta-wrap">
      <div class="meta-line">真太阳时：{{ data.birth_solar_dt }}</div>
      <div class="meta-line">出生节气：{{ data.birth_solar_term }}</div>
    </div>
    <table class="bazi-table">
      <thead>
        <tr>
          <th class="corner-cell"></th>
          <th>年柱</th>
          <th>月柱</th>
          <th>日柱</th>
          <th>时柱</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="left-label">干神</td>
          <td v-for="pillar in pillarList(data.pillars)" :key="pillar.type">{{ pillar.gan_shen }}</td>
        </tr>
        <tr>
          <td class="left-label">天干</td>
          <td
            v-for="pillar in pillarList(data.pillars)"
            :key="`${pillar.type}-tg`"
            class="cell-char tg"
            :class="wuXingClass(pillar.tg)"
          >
            {{ pillar.tg }}
          </td>
        </tr>
        <tr>
          <td class="left-label">地支</td>
          <td
            v-for="pillar in pillarList(data.pillars)"
            :key="`${pillar.type}-dz`"
            class="cell-char dz"
            :class="wuXingClass(pillar.dz)"
          >
            {{ pillar.dz }}
          </td>
        </tr>
        <tr>
          <td class="left-label">藏干</td>
          <td v-for="pillar in pillarList(data.pillars)" :key="`${pillar.type}-cang-gan`" class="multi-line">
            {{ joinListLines(pillar.cang_gan_wx) }}
          </td>
        </tr>
        <tr>
          <td class="left-label">支神</td>
          <td v-for="pillar in pillarList(data.pillars)" :key="`${pillar.type}-zhi-shen`" class="multi-line">
            {{ joinListLines(pillar.zhi_shen) }}
          </td>
        </tr>
        <tr>
          <td class="left-label">纳音</td>
          <td v-for="pillar in pillarList(data.pillars)" :key="`${pillar.type}-na-yin`">{{ pillar.na_yin }}</td>
        </tr>
        <tr>
          <td class="left-label">空亡</td>
          <td v-for="pillar in pillarList(data.pillars)" :key="`${pillar.type}-kong-wang`">{{ pillar.kong_wang }}</td>
        </tr>
        <tr>
          <td class="left-label">星运</td>
          <td v-for="pillar in pillarList(data.pillars)" :key="`${pillar.type}-di-shi`">{{ pillar.di_shi }}</td>
        </tr>
        <tr>
          <td class="left-label">自坐</td>
          <td v-for="pillar in pillarList(data.pillars)" :key="`${pillar.type}-zi-zuo`">{{ pillar.zi_zuo }}</td>
        </tr>
        <tr>
          <td class="left-label">神煞</td>
          <td v-for="pillar in pillarList(data.pillars)" :key="`${pillar.type}-shen-sha`" class="multi-line long">
            {{ joinListLines(pillar.shen_sha) }}
          </td>
        </tr>
        <tr>
          <td class="left-label">天干</td>
          <td colspan="4" class="text-left">{{ joinListComma(data.tg_chong_ke) }}</td>
        </tr>
        <tr>
          <td class="left-label">地支</td>
          <td colspan="4" class="text-left">{{ joinListComma(data.dz_chong_ke) }}</td>
        </tr>
        <tr>
          <td
            v-for="(item, i) in wangXiangRow(data.wang_xiang)"
            :key="`wang-xiang-${i}`"
            :class="wangXiangClass(item)"
          >
            {{ item }}
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { pillarList, joinListLines, joinListComma, wangXiangRow, wangXiangClass, wuXingClass } from '../../composables/useBazi'

defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>
