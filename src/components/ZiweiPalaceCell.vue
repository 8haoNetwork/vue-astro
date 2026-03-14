<template>
  <div class="palace-content" v-if="palace">
    <!-- 身宫标识：与 vue_ziwei 一致，内层用 div.body-palace-text.vertical-text -->
    <div class="body-palace-label" v-if="isBodyPalace">
      <div class="body-palace-text vertical-text">{{ t('palace.bodyPalace') }}</div>
    </div>

    <!-- 顶部：主星和辅星（竖排），与 vue_ziwei 一致：亮度 class 在 star-group 上，星名用 div.star-name-vertical，四化用 mutagen-rows + transform transform-star -->
    <div class="stars-row" v-if="allStars.length">
      <div
        v-for="(star, sIdx) in allStars"
        :key="'star-' + sIdx"
        class="star-group"
        :class="[
          isMajor(star) ? 'main-star-group' : 'minor-star-group',
          brightnessClass(star.brightness)
        ]"
      >
        <div class="star-name-vertical">{{ translateStarName(starName(star)) }}</div>
        <div class="star-brightness-text" v-if="star.brightness">{{ translateBrightness(star.brightness) }}</div>
        <div class="mutagen-rows" v-if="starMutagen(star)">
          <span
            class="transform transform-star"
            :class="mutagenClass(starMutagen(star))"
          >{{ getMutagenText(starMutagen(star)) }}</span>
        </div>
      </div>
    </div>

    <!-- 底部：与 vue_ziwei 一致——先 palace-ages（大限年龄整行），再 palace-bottom（左/中/右） -->
    <div class="palace-bottom-container">
      <div class="palace-ages" v-if="palace.decadal && palace.decadal.length">
        <span v-for="(age, aIdx) in palace.decadal" :key="'age-' + aIdx" class="age-item">{{ age }}<span v-if="aIdx < palace.decadal.length - 1">,</span></span>
      </div>
      <div class="palace-bottom">
        <div class="bottom-right" v-if="hasBottomRight">
          <div class="bottom-right-content">
            <div class="life-12-star" v-if="palace.life_12_star">{{ translateStarName(palace.life_12_star) }}</div>
            <div v-if="palace.heavenly_stem && palace.earthly_branch" class="branch-text vertical-text">{{ translateStem(palace.heavenly_stem) }}{{ translateBranch(palace.earthly_branch) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useZiweiI18n } from '../composables/useZiweiI18n'

const props = defineProps({
  palace: { type: Object, default: null },
  bodyPalaceIndex: { type: Number, default: null }
})

const { t, translateStarName, translateBrightness, getMutagenText, translateStem, translateBranch } = useZiweiI18n()

const isBodyPalace = computed(() => {
  if (props.bodyPalaceIndex == null || !props.palace) return false
  return Number(props.palace.index) === Number(props.bodyPalaceIndex)
})

const majorStars = computed(() => props.palace?.major_stars || [])
const allStars = computed(() => {
  if (!props.palace) return []
  const major = props.palace.major_stars || []
  const minor = props.palace.minor_stars || []
  const adj = props.palace.adj_stars || []
  return [...major, ...minor, ...adj]
})

function isMajor(star) {
  const name = starName(star)
  return majorStars.value.some(m => (m?.name || m) === name)
}

function starName(star) {
  return typeof star === 'string' ? star : (star?.name || '')
}

function starMutagen(star) {
  const name = star?.name
  if (!name || !props.palace?.mutagen_infos) return ''
  const info = props.palace.mutagen_infos.find(m => m.star_name === name)
  return info?.mutagen_type || star.mutagen_type || ''
}

function brightnessClass(brightness) {
  if (!brightness) return ''
  const map = {
    '庙': 'brightness-miao', 'miao': 'brightness-miao',
    '旺': 'brightness-wang', 'wang': 'brightness-wang',
    '得': 'brightness-de', 'de': 'brightness-de',
    '利': 'brightness-li', 'li': 'brightness-li',
    '平': 'brightness-ping', 'ping': 'brightness-ping',
    '不得地': 'brightness-budedi', 'budedi': 'brightness-budedi',
    '陷': 'brightness-xian', 'xian': 'brightness-xian'
  }
  const k = String(brightness).toLowerCase()
  return map[brightness] || map[k] || ''
}

function mutagenClass(mutagen) {
  if (!mutagen) return ''
  const k = String(mutagen).toLowerCase()
  if (k === '禄' || k === 'lu') return 'transform-lu'
  if (k === '权' || k === 'quan') return 'transform-quan'
  if (k === '科' || k === 'ke') return 'transform-ke'
  if (k === '忌' || k === 'ji') return 'transform-ji'
  return ''
}

const hasBottomRight = computed(() => {
  return props.palace?.life_12_star || (props.palace?.heavenly_stem && props.palace?.earthly_branch)
})
</script>

<style scoped>
/* 宫格内容样式已统一到 src/styles/ziweiChart.css（与 vue_ziwei PalaceContent 一致），此处仅保留必要的局部覆盖 */
</style>
