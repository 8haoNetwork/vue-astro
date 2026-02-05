<template>
  <svg
    :viewBox="`0 0 ${size} ${size}`"
    :width="size"
    :height="size"
  >
    <defs>
      <radialGradient id="bgGrad">
        <stop offset="0%" stop-color="#cfc9ff"/>
        <stop offset="100%" stop-color="#9aa0ff"/>
      </radialGradient>
    </defs>

    <g :transform="`translate(${center}, ${center})`">

      <!-- 背景圆（由外向内） -->
      <circle :r="r5" fill="#b7baff" />
      <circle :r="r4" fill="#d1d3ff" />
      <circle :r="r3" fill="#c3c6ff" />
      <circle :r="r2" fill="#dde0ff" />
      <circle :r="r1" fill="url(#bgGrad)" />

      <!-- ⭐ 最外三圈的扇形分割线 -->
      <g>
        <line
          v-for="i in total"
          :key="'seg-'+i"
          :x1="getPoint(angle(i-1), r2).x"
          :y1="getPoint(angle(i-1), r2).y"
          :x2="getPoint(angle(i-1), r3).x"
          :y2="getPoint(angle(i-1), r3).y"
          stroke="#ffffff"
          stroke-opacity="0.65"
          stroke-width="1"
        />
      </g>
      <circle :r="r3" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="1" />
      <g>
        <line
          v-for="i in total"
          :key="'seg-'+i"
          :x1="getPoint(angle(i-1), r3).x"
          :y1="getPoint(angle(i-1), r3).y"
          :x2="getPoint(angle(i-1), r5).x"
          :y2="getPoint(angle(i-1), r5).y"
          stroke="#ffffff"
          stroke-opacity="0.65"
          stroke-width="3"
        />
      </g>
      <circle :r="r4" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="3" />
      <circle :r="r5" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="3" />

      <!-- 距离圈 - 使用扇区中心角度 -->
      <text
        v-for="i in total"
        :key="'dist-'+i"
        :x="getPoint(sectorCenterAngle(i-1), r5 - 15).x"
        :y="getPoint(sectorCenterAngle(i-1), r5 - 15).y"
        text-anchor="middle"
        dominant-baseline="middle"
        font-size="12"
        fill="#f2f3ff"
      >
        {{ distanceText(i-1) }}
      </text>

      <!-- 关系圈 - 使用扇区中心角度 -->
      <text
        v-for="i in total"
        :key="'rel-'+i"
        :x="getPoint(sectorCenterAngle(i-1), r4 - 15).x"
        :y="getPoint(sectorCenterAngle(i-1), r4 - 15).y"
        text-anchor="middle"
        dominant-baseline="middle"
        font-size="12"
        :fill="relationColor(i-1)"
      >
        {{ relationText(i-1) }}
      </text>

      <!-- 星宿圈 - 使用扇区中心角度 -->
      <text
        v-for="(name, idx) in naks"
        :key="'nak-'+idx"
        :x="getPoint(naksAngle(idx), r3 - 15).x"
        :y="getPoint(naksAngle(idx), r3 - 15).y"
        text-anchor="middle"
        dominant-baseline="middle"
        font-size="12"
        :fill="idx === naksIdx ? '#b8bc43' : '#ffffff'"
      >
        {{ name }}
      </text>

      <!-- 中心圆 -->
      <circle :r="rCenter" fill="#a6a9ff" />
      <!-- 星宿SVG图片 -->
      <image
        :href="naksSvg[naksIdx]"
        :width="rCenter * 1.2"
        :height="rCenter * 1.2"
        :x="-rCenter * 0.6"
        :y="-rCenter * 0.6"
      />
      <!-- 星宿中文名称 -->
      <text
        text-anchor="middle"
        dominant-baseline="middle"
        font-size="15"
        fill="#ffffff"
        font-weight="bold"
        :y="rCenter * 0.7"
      >
        {{ naksName }}
      </text>

    </g>
  </svg>
</template>

<script>
// 导入所有星宿SVG图片
import jiao_mu_jiao from './../assets/imgs/jiao_mu_jiao.svg'
import kang_jin_long from './../assets/imgs/kang_jin_long.svg'
import di_tu_he from './../assets/imgs/di_tu_he.svg'
import fang_ri_tu from './../assets/imgs/fang_ri_tu.svg'
import xin_yue_hu from './../assets/imgs/xin_yue_hu.svg'
import wei_huo_hu from './../assets/imgs/wei_huo_hu.svg'
import ji_shui_bao from './../assets/imgs/ji_shui_bao.svg'
import dou_mu_xie from './../assets/imgs/dou_mu_xie.svg'
import niu_jin_niu from './../assets/imgs/niu_jin_niu.svg'
import nü_tu_fu from './../assets/imgs/nü_tu_fu.svg'
import xu_ri_shu from './../assets/imgs/xu_ri_shu.svg'
import wei_yue_yan from './../assets/imgs/wei_yue_yan.svg'
import shi_huo_zhu from './../assets/imgs/shi_huo_zhu.svg'
import bi_shui_yu from './../assets/imgs/bi_shui_yu.svg'
import kui_mu_lang from './../assets/imgs/kui_mu_lang.svg'
import lou_jin_gou from './../assets/imgs/lou_jin_gou.svg'
import wei_tu_zhi from './../assets/imgs/wei_tu_zhi.svg'
import mao_ri_ji from './../assets/imgs/mao_ri_ji.svg'
import bi_yue_wu from './../assets/imgs/bi_yue_wu.svg'
import zhi_huo_hou from './../assets/imgs/zhi_huo_hou.svg'
import shen_shui_yuan from './../assets/imgs/shen_shui_yuan.svg'
import jing_mu_an from './../assets/imgs/jing_mu_an.svg'
import gui_jin_yang from './../assets/imgs/gui_jin_yang.svg'
import liu_tu_zhang from './../assets/imgs/liu_tu_zhang.svg'
import xing_ri_ma from './../assets/imgs/xing_ri_ma.svg'
import zhang_yue_lu from './../assets/imgs/zhang_yue_lu.svg'
import yi_huo_she from './../assets/imgs/yi_huo_she.svg'
import zhen_shui_yin from './../assets/imgs/zhen_shui_yin.svg'

export default {
  name: 'StarNaksDisk',
  props: {
    naksIdx: {
      type: Number,
      required: true
    },
    size: {
      type: Number,
      default: 360
    }
  },
  data() {
    return {
      total: 27,
      naks: [
        '角','亢','氐','房','心','尾','箕',
        '斗','女','虚','危','室','壁',
        '奎','娄','胃','昴','毕','觜','参',
        '井','鬼','柳','星','张','翼','轸'
      ],
      // 星宿SVG图片映射
      naksSvg: [
        jiao_mu_jiao, kang_jin_long, di_tu_he, fang_ri_tu, xin_yue_hu, wei_huo_hu, ji_shui_bao,
        dou_mu_xie, nü_tu_fu, xu_ri_shu, wei_yue_yan, shi_huo_zhu, bi_shui_yu,
        kui_mu_lang, lou_jin_gou, wei_tu_zhi, mao_ri_ji, bi_yue_wu, zhi_huo_hou, shen_shui_yuan,
        jing_mu_an, gui_jin_yang, liu_tu_zhang, xing_ri_ma, zhang_yue_lu, yi_huo_she, zhen_shui_yin
      ],
      // 星宿完整中文名称
      naksFullName: [
        '角木蛟', '亢金龙', '氐土貉', '房日兔', '心月狐', '尾火虎', '箕水豹',
        '斗木獬', '女土蝠', '虚日鼠', '危月燕', '室火猪', '壁水貐',
        '奎木狼', '娄金狗', '胃土雉', '昴日鸡', '毕月乌', '觜火猴', '参水猿',
        '井木犴', '鬼金羊', '柳土獐', '星日马', '张月鹿', '翼火蛇', '轸水蚓'
      ]
    }
  },
  computed: {
    center() { return this.size / 2 },
    r5() { return 180 }, // 最外
    r4() { return 150 },
    r3() { return 120 },
    r2() { return 90 },  // 最外三圈的内边界
    r1() { return 80 },
    rCenter() { return 80 },
    naksName() {
      return this.naks[this.naksIdx] + "宿"
    },
    // 每个扇区的角度宽度
    sectorWidth() {
      return 360 / this.total
    }
  },
  methods: {
    // 扇区起始角度（用于绘制分割线）
    angle(idx) {
      return idx * this.sectorWidth - 90
    },
    
    // 扇区中心角度（用于放置文字）
    sectorCenterAngle(idx) {
      // 起始角度 + 半个扇区宽度 = 扇区中心
      return idx * this.sectorWidth + this.sectorWidth / 2 - 90
    },
    
    // 星宿点的角度（将指定星宿固定到"命"的位置，即 idx=13 的位置）
    naksAngle(idx) {
      // 计算偏移量：将 naksIdx 移动到 idx=13 的位置
      const offset = (13 - this.naksIdx + this.total) % this.total
      const actualIdx = (idx + offset) % this.total
      return this.sectorCenterAngle(actualIdx)
    },
    
    getPoint(angle, radius) {
      const rad = angle * Math.PI / 180
      return {
        x: radius * Math.cos(rad),
        y: radius * Math.sin(rad)
      }
    },
    distanceText(idx) {
      // 27个扇区的直接映射
      const distanceMap = [
        '远','远','远','远',  // 0-3
        '',                  // 4
        '中','中','中','中',  // 5-8
        '近','近','近','近',  // 9-12
        '',                  // 13
        '近','近','近','近',  // 14-17
        '中','中','中','中',  // 18-21
        '',                  // 22         
        '远','远','远','远'   // 23-26
      ];
      
      return distanceMap[idx] || '';
    },
    relationText(idx) {
      const relationMap = [
        '成', '坏', '友', '亲', '胎', '荣', '衰', '安', '危', '成', '坏', '友', '亲', 
        '命', 
        '荣', '衰', '安', '危', '成', '坏', '友', '亲', '业', '荣', '衰', '安', '危'
      ]
      return relationMap[idx] || '';
    },
    relationColor(idx) {
      // 关系分类：好关系、坏关系、本命
      const colorMap = [
        'B', 'R', 'B', 'R', 'R', 'B', 'R', 'B', 'R', 'B', 'R', 'B', 'R',
        'Y',
        'B', 'R', 'B', 'R', 'B', 'R', 'B', 'R', 'B', 'B', 'R', 'B', 'R'
      ]
      switch (colorMap[idx]) {
        case 'B': return '#4e6fba' // 蓝色
        case 'R': return '#aa6262' // 红色
        case 'Y': return '#b8bc43' // 金色
        default: return '#9E9E9E' // 默认-灰色
      }
    }
  }
}
</script>