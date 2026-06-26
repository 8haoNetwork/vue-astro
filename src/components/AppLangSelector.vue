<template>
  <label class="app-lang-selector" title="接口返回语言">
    <select
      class="app-lang-selector__select"
      :value="appLang"
      aria-label="接口返回语言"
      @change="onChange"
    >
      <option v-for="opt in appLangOptions" :key="opt.value" :value="opt.value">
        {{ opt.shortLabel }}
      </option>
    </select>
  </label>
</template>

<script setup>
import { useAppLang } from '../composables/useAppLang'

const { appLang, appLangOptions, setLang } = useAppLang()

function onChange(event) {
  setLang(event.target.value)
}
</script>

<style scoped>
.app-lang-selector {
  display: block;
  line-height: 1;
}

.app-lang-selector__select {
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 6px;
  padding: 0.2rem 1.4rem 0.2rem 0.45rem;
  font-size: 0.7rem;
  line-height: 1.2;
  color: #444;
  background: rgba(255, 255, 255, 0.95)
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5' viewBox='0 0 8 5'%3E%3Cpath fill='%23666' d='M0 0l4 5 4-5z'/%3E%3C/svg%3E")
    no-repeat right 0.35rem center;
  appearance: none;
  cursor: pointer;
  max-width: 5.5rem;
}

.app-lang-selector__select:focus {
  outline: 1px solid rgba(255, 255, 255, 0.8);
  outline-offset: 1px;
}
</style>
