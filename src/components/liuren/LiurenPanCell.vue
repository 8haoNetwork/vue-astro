<template>
  <button
    v-if="cell"
    type="button"
    class="liuren-pan-cell"
    :class="{
      'is-shi': cell.isShi,
      'is-difen': cell.isDiFen,
      'is-selected': selected
    }"
    @click="$emit('select', cell.earth)"
  >
    <div v-if="cell.isShi || cell.isDiFen" class="cell-flags">
      <span v-if="cell.isShi" class="cell-flag cell-flag--shi">时</span>
      <span v-if="cell.isDiFen" class="cell-flag cell-flag--difen">分</span>
    </div>
    <div class="cell-jiang">{{ cell.jiang || '—' }}</div>
    <div class="cell-tian">{{ cell.sky }}</div>
    <div class="cell-di">{{ cell.earth }}</div>
  </button>
</template>

<script setup>
defineProps({
  cell: { type: Object, required: true },
  selected: { type: Boolean, default: false }
})

defineEmits(['select'])
</script>

<style scoped>
.liuren-pan-cell {
  position: relative;
  height: 100%;
  width: 100%;
  padding: 4px 5px 4px 18px;
  border: 1px solid #e5dcd3;
  border-radius: 5px;
  background: #fff;
  box-sizing: border-box;
  cursor: pointer;
  text-align: inherit;
  font: inherit;
  appearance: none;
}

.liuren-pan-cell.is-selected {
  border-color: #6b5b4f;
  box-shadow: inset 0 0 0 1px rgba(107, 91, 79, 0.35);
  background: #faf6f2;
}

.liuren-pan-cell.is-shi {
  border-color: #d4b88a;
  background: #fffcf7;
  box-shadow: inset 0 0 0 1px rgba(212, 184, 138, 0.45);
}

.liuren-pan-cell.is-difen {
  border-color: #9cb890;
  background: #f9fcf8;
  box-shadow: inset 0 0 0 1px rgba(156, 184, 144, 0.45);
}

.liuren-pan-cell.is-shi.is-difen {
  border-color: #a8a070;
  background: linear-gradient(160deg, #fffcf7 0%, #f9fcf8 100%);
}

.liuren-pan-cell.is-selected.is-shi,
.liuren-pan-cell.is-selected.is-difen {
  box-shadow: inset 0 0 0 2px rgba(107, 91, 79, 0.4);
}

.cell-flags {
  position: absolute;
  top: 2px;
  right: 3px;
  display: flex;
  gap: 2px;
  z-index: 1;
}

.cell-flag {
  font-size: 8px;
  line-height: 1.2;
  padding: 0 2px;
  border-radius: 2px;
  font-weight: 700;
}

.cell-flag--shi {
  color: #7a5c38;
  background: #f0e0c8;
}

.cell-flag--difen {
  color: #3d5236;
  background: #dcebd6;
}

.cell-jiang {
  position: absolute;
  top: 4px;
  left: 4px;
  max-height: calc(100% - 14px);
  font-size: 10px;
  line-height: 1.05;
  letter-spacing: 0;
  color: #9a7b28;
  font-weight: 600;
  writing-mode: vertical-rl;
  text-orientation: upright;
  overflow: hidden;
}

.cell-tian {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 36px;
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
  color: #2a4a6b;
}

.cell-di {
  position: absolute;
  right: 4px;
  bottom: 3px;
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
  color: #a09890;
}
</style>
