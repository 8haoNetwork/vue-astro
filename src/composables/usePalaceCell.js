import { computed, isRef, ref, toRef } from 'vue'
import {
  isAuspiciousMen,
  formatPanGanGan,
  getPalaceGanAux,
  getAnGanLayers,
  formatPalaceYingQiLabel,
  formatShenTrail
} from './useQimen'
import {
  getMenClass,
  getStarClass,
  getShenClass
} from './useQimenColors'

/** 驿马：♘ 白棋马，单色线条，风格与空亡 ○ 接近 */
export const MA_MARKER_SYMBOL = '♘'

const MARKER_KONG_CODES = new Set(['kong_wang'])
const MARKER_MA_CODES = new Set(['yi_ma'])

/** 四害单字（按 code；无宫迫，门迫为 men_po） */
const HARM_LABEL_BY_CODE = {
  men_po: '迫',
  ji_xing: '刑',
  ru_mu: '墓'
}

function harmMarkerLabel(code, name) {
  if (HARM_LABEL_BY_CODE[code]) return HARM_LABEL_BY_CODE[code]
  const n = String(name ?? '').trim()
  if (!n) return ''
  return n.length === 1 ? n : n.charAt(n.length - 1)
}

/** 宫位标记：markers[] → 空○ / 马♘ / 四害单字 */
export function getPalaceMarkerItems(cell) {
  if (!cell || !Array.isArray(cell.markers) || !cell.markers.length) return []

  return cell.markers
    .map((raw) => {
      if (!raw || typeof raw !== 'object') return null
      const code = String(raw.code ?? '').trim()
      if (MARKER_KONG_CODES.has(code)) {
        return {
          kind: 'kong',
          code,
          symbol: '○',
          name: String(raw.name ?? '').trim(),
          brief: raw.brief ? String(raw.brief).trim() : ''
        }
      }
      if (MARKER_MA_CODES.has(code)) {
        return {
          kind: 'ma',
          code,
          symbol: MA_MARKER_SYMBOL,
          name: String(raw.name ?? '').trim(),
          brief: raw.brief ? String(raw.brief).trim() : ''
        }
      }
      const name = String(raw.name ?? '').trim()
      if (!name) return null
      return {
        kind: 'harm',
        code,
        name,
        label: harmMarkerLabel(code, name),
        brief: raw.brief ? String(raw.brief).trim() : ''
      }
    })
    .filter(Boolean)
}

/** 九宫单格共用 computed（markers、应期、旁注、天干 aux 等） */
export function usePalaceCell(cellSource, options = {}) {
  const cell = toRef(cellSource)
  const zhiShi = isRef(options.zhiShi) ? options.zhiShi : ref(options.zhiShi ?? '')

  const markerItems = computed(() => getPalaceMarkerItems(cell.value))

  const palaceAux = computed(() => cell.value?.palace_aux ?? null)

  const yingQiLabel = computed(() => formatPalaceYingQiLabel(cell.value))
  const shenTrailLabel = computed(() => formatShenTrail(cell.value?.shen_trail))
  const menTrailLabel = computed(() => {
    const v = cell.value?.men_trail
    return v == null ? '' : String(v).trim()
  })

  const anGanLayers = computed(() => getAnGanLayers(cell.value))

  const anGanDisplayLayers = computed(() => {
    if (anGanLayers.value.length) return anGanLayers.value
    const single = cell.value?.an_gan ?? cell.value?.anGan
    return single ? [String(single).trim()] : []
  })

  const isZhishiMen = computed(() => {
    const men = cell.value?.ba_men
    const zhi = zhiShi.value
    return men && zhi && men === zhi
  })

  const tianGanAux = computed(() => getPalaceGanAux(palaceAux.value?.gan?.tian))
  const diGanAux = computed(() => getPalaceGanAux(palaceAux.value?.gan?.di))

  const hasTianGanAux = computed(
    () => tianGanAux.value.changsheng || tianGanAux.value.wangShuai
  )
  const hasDiGanAux = computed(
    () => diGanAux.value.changsheng || diGanAux.value.wangShuai
  )

  const jinhanAuxLines = computed(() => {
    const aux = palaceAux.value
    if (!aux?.gan) return []
    const lines = []
    for (const [label, key] of [['天', 'tian'], ['地', 'di']]) {
      const item = getPalaceGanAux(aux.gan[key])
      const parts = []
      if (item.changsheng) parts.push(item.changsheng)
      if (item.wangShuai) parts.push(item.wangShuai)
      if (parts.length) lines.push(`${label}${parts.join('·')}`)
    }
    return lines
  })

  return {
    markerItems,
    menClass: computed(() => getMenClass(cell.value?.ba_men)),
    starClass: computed(() => getStarClass(cell.value?.jiu_xing)),
    shenClass: computed(() => getShenClass(cell.value?.ba_shen)),
    jinhanShenClass: computed(() => getStarClass(cell.value?.shen_xing)),
    palaceAux,
    yingQiLabel,
    shenTrailLabel,
    menTrailLabel,
    anGanDisplayLayers,
    isZhishiMen,
    tianGanAux,
    diGanAux,
    hasTianGanAux,
    hasDiGanAux,
    jinhanAuxLines,
    formatPanGanGan,
    isAuspiciousMen
  }
}
