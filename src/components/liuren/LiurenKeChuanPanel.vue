<template>
  <div class="liuren-ke-chuan">
    <section v-if="siKe.length">
      <h3 class="liuren-section-title">四课</h3>
      <table v-if="isJinkou" class="liuren-ke-table liuren-jinkou-table">
        <thead>
          <tr>
            <th>课</th>
            <th>干支</th>
            <th>天将</th>
            <th>五行</th>
            <th>阴阳</th>
            <th>旺衰</th>
            <th>用神</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="ke in siKe"
            :key="ke.name"
            class="liuren-click-row"
            :class="{
              'is-yong': ke.is_yong_shen,
              'is-selected': isSelected('si_ke', ke.name)
            }"
            @click="emitSelect('si_ke', ke.name)"
          >
            <td>{{ ke.name }}</td>
            <td class="tian-cell">
              <QimenGanText :value="ke.tian" />
            </td>
            <td>{{ ke.tian_jiang || '—' }}</td>
            <td>{{ ke.wu_xing || '—' }}</td>
            <td>{{ ke.yin_yang || '—' }}</td>
            <td>{{ ke.wang_shuai || '—' }}</td>
            <td>{{ ke.is_yong_shen ? '用' : '—' }}</td>
          </tr>
        </tbody>
      </table>
      <table v-else class="liuren-ke-table">
        <thead>
          <tr>
            <th>课</th>
            <th>上神</th>
            <th>天将</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="ke in siKe"
            :key="ke.name"
            class="liuren-click-row"
            :class="{ 'is-selected': isSelected('si_ke', ke.name) }"
            @click="emitSelect('si_ke', ke.name)"
          >
            <td>{{ ke.name }}</td>
            <td class="tian-cell">
              <QimenGanText :value="ke.tian" />
            </td>
            <td>{{ ke.tian_jiang }}</td>
          </tr>
        </tbody>
      </table>

      <LiurenDetailPanel
        v-if="selection?.kind === 'si_ke'"
        class="liuren-inline-detail"
        :data="data"
        :selection="selection"
      />
    </section>

    <section v-if="sanChuan.length">
      <h3 class="liuren-section-title">三传</h3>
      <table class="liuren-chuan-table">
        <thead>
          <tr>
            <th>传</th>
            <th>支</th>
            <th>天将</th>
            <th>六亲</th>
            <th>空亡</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="chuan in sanChuan"
            :key="chuan.name"
            class="liuren-click-row"
            :class="{ 'is-selected': isSelected('san_chuan', chuan.name) }"
            @click="emitSelect('san_chuan', chuan.name)"
          >
            <td>{{ chuan.name }}</td>
            <td class="zhi-cell">{{ chuan.zhi }}</td>
            <td class="jiang-cell">{{ chuan.tian_jiang }}</td>
            <td>{{ chuan.liu_qin }}</td>
            <td>{{ chuan.kong_wang || '—' }}</td>
          </tr>
        </tbody>
      </table>

      <LiurenDetailPanel
        v-if="selection?.kind === 'san_chuan'"
        class="liuren-inline-detail"
        :data="data"
        :selection="selection"
      />
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { isJinkoujueResult, isLiurenSelectionActive } from '../../composables/useLiuren'
import QimenGanText from '../qimen/QimenGanText.vue'
import LiurenDetailPanel from './LiurenDetailPanel.vue'

const props = defineProps({
  data: { type: Object, default: null },
  selection: { type: Object, default: null }
})

const emit = defineEmits(['select'])

const isJinkou = computed(() => isJinkoujueResult(props.data))

const siKe = computed(() => {
  const raw = props.data?.si_ke
  return Array.isArray(raw) ? raw : []
})

const sanChuan = computed(() => {
  const raw = props.data?.san_chuan
  return Array.isArray(raw) ? raw : []
})

function isSelected(kind, key) {
  return isLiurenSelectionActive(props.selection, kind, key)
}

function emitSelect(kind, key) {
  emit('select', { kind, key })
}
</script>
