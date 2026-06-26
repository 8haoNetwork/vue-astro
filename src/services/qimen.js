import { apiClient } from './api'
import { resolveRequestLang } from '../utils/lang'

/** 后端已接入的 pan_variant（与 py-astro-cloud 一致） */
export const QIMEN_IMPLEMENTED_VARIANTS = [
  'shijia_chaibu',
  'shijia_zhirun',
  'shijia_maoshan',
  'shijia_yinpan',
  'rijia_jinhan',
  'rijia_traditional'
]

export const QIMEN_PAI_METHOD_OPTIONS = [
  { value: 'zhuanpan', label: '转盘' },
  { value: 'feipan', label: '飞盘' }
]

/** 山向：后端默认飞盘 + 默认(zhigui)（仅 UI 预填，未手动改时不传参） */
export const QIMEN_SHANXIANG_PAI_METHOD = 'feipan'
export const QIMEN_SHANXIANG_FEIPAN_STYLE = 'zhigui'

/** 飞盘子流派（仅 pai_method=feipan 时生效） */
export const QIMEN_FEIPAN_STYLE_DEFAULT = 'zhigui'

export const QIMEN_FEIPAN_STYLE_OPTIONS = [
  { value: 'zhigui', label: '默认' },
  { value: 'mingfa', label: '鸣法' },
  { value: 'kuonang', label: '括囊' },
  { value: 'faqiao', label: '法窍' },
  { value: 'yinpan', label: '阴盘' }
]

/** 二十四山坐山中心度数（正北 0°，顺时针） */
const SHAN_MOUNT_DEGREE_ROWS = [
  ['zi', '子山午向', 0],
  ['gui', '癸山丁向', 15],
  ['chou', '丑山未向', 30],
  ['gen', '艮山坤向', 45],
  ['yin', '寅山申向', 60],
  ['jia', '甲山庚向', 75],
  ['mao', '卯山酉向', 90],
  ['yi', '乙山辛向', 105],
  ['chen', '辰山戌向', 120],
  ['xun', '巽山乾向', 135],
  ['si', '巳山亥向', 150],
  ['bing', '丙山壬向', 165],
  ['wu', '午山子向', 180],
  ['ding', '丁山癸向', 195],
  ['wei', '未山丑向', 210],
  ['kun', '坤山艮向', 225],
  ['shen', '申山寅向', 240],
  ['geng', '庚山甲向', 255],
  ['you', '酉山卯向', 270],
  ['xin', '辛山乙向', 285],
  ['xu', '戌山辰向', 300],
  ['qian', '乾山巽向', 315],
  ['hai', '亥山巳向', 330],
  ['ren', '壬山丙向', 345]
]

function formatShanDegree(deg) {
  const n = ((deg % 360) + 360) % 360
  return Number.isInteger(n) ? `${n}°` : `${n.toFixed(1)}°`
}

export function formatShanDegreeDisplay(deg) {
  return formatShanDegree(deg)
}

function buildShanMountDegreeRange(centerDeg) {
  const half = 7.5
  const min = centerDeg - half
  const max = centerDeg + half
  if (centerDeg === 0) return '352.5°–7.5°'
  return `${formatShanDegree(min)}–${formatShanDegree(max)}`
}

function formatShanDegreeSpan(minDeg, maxDeg) {
  const minN = ((minDeg % 360) + 360) % 360
  const maxN = ((maxDeg % 360) + 360) % 360
  return `${formatShanDegree(minN)}–${formatShanDegree(maxN)}`
}

/** 每山 15° 拆为 3 元，每元 5°；下拉顺序：上 · 中 · 下 */
export const SHAN_MOUNT_SEGMENT_COUNT = 3
const SHAN_MOUNT_SEGMENT_SIZE = 5

/** segmentIndex: 0=低度端(下) … 2=高度端(上) */
export const SHAN_YUAN_OPTIONS = [
  { yuan: 'shang', label: '上', segmentIndex: 2 },
  { yuan: 'zhong', label: '中', segmentIndex: 1 },
  { yuan: 'xia', label: '下', segmentIndex: 0 }
]

export function buildShanMountSegments(mountDegree) {
  const rangeStart = mountDegree - 7.5
  return SHAN_YUAN_OPTIONS.map(({ yuan, label, segmentIndex }) => {
    const minDeg = rangeStart + segmentIndex * SHAN_MOUNT_SEGMENT_SIZE
    const maxDeg = minDeg + SHAN_MOUNT_SEGMENT_SIZE
    const degreeRange = formatShanDegreeSpan(minDeg, maxDeg)
    return {
      yuan,
      yuanLabel: label,
      minDeg,
      maxDeg,
      centerDeg: minDeg + SHAN_MOUNT_SEGMENT_SIZE / 2,
      degreeRange,
      displayLabel: `${label} · ${degreeRange}`
    }
  })
}

function buildShanMountOption(value, label, mountDegree) {
  const facingDegree = (mountDegree + 180) % 360
  const degreeRange = buildShanMountDegreeRange(mountDegree)
  const segments = buildShanMountSegments(mountDegree)
  return {
    value,
    label,
    mountDegree,
    facingDegree,
    degreeRange,
    segments
  }
}

/** 山向奇门：二十四山（shan_mount 为坐山拼音） */
export const QIMEN_SHAN_MOUNT_OPTIONS = SHAN_MOUNT_DEGREE_ROWS.map(
  ([value, label, mountDegree]) => buildShanMountOption(value, label, mountDegree)
)

export function findShanMountOption(value) {
  if (!value) return null
  return QIMEN_SHAN_MOUNT_OPTIONS.find(o => o.value === value) || null
}

export function getShanMountSegments(mountValue) {
  return findShanMountOption(mountValue)?.segments || []
}

export function findShanMountSegment(mountValue, yuan) {
  const segments = getShanMountSegments(mountValue)
  return segments.find(seg => seg.yuan === yuan) || null
}

export function formatShanMountSegmentLabel(segment) {
  if (!segment) return ''
  return segment.displayLabel || segment.degreeRange || ''
}

export function defaultShanYuan() {
  return 'zhong'
}

/** 起局类型 × 定局法（与 QimenQry 一致） */
export const QIMEN_QIJU_OPTIONS = [
  {
    type: 'shijia',
    label: '时家',
    juMethods: [
      { value: 'chaibu', label: '拆补', panVariant: 'shijia_chaibu' },
      { value: 'zhirun', label: '置闰', panVariant: 'shijia_zhirun' },
      { value: 'maoshan', label: '茅山', panVariant: 'shijia_maoshan' },
      { value: 'yinpan', label: '阴盘', panVariant: 'shijia_yinpan' }
    ],
    paiMethods: 'all'
  },
  {
    type: 'rijia',
    label: '日家',
    juMethods: [
      { value: 'jinhan', label: '金函', panVariant: 'rijia_jinhan' },
      { value: 'traditional', label: '传统定局', panVariant: 'rijia_traditional' }
    ],
    paiMethods: ['zhuanpan']
  },
  {
    type: 'shanxiang',
    label: '山向',
    juMethods: [],
    paiMethods: 'all'
  }
]

function normalizeTimeToSeconds(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return '00:00:00'
  const t = timeStr.trim()
  const parts = t.split(':')
  const h = parts[0]?.padStart(2, '0') || '00'
  const m = parts[1]?.padStart(2, '0') || '00'
  const s = parts[2] != null ? String(parts[2]).padStart(2, '0') : '00'
  return `${h}:${m}:${s}`
}

/**
 * 各起局类型 UI 只填部分字段时，补齐 qry_dt 的日期与时间
 * - 时家：日期 + 时间
 * - 日家：日期，时间默认 00:00:00
 * - 山向：年份，默认当年 1 月 1 日 00:00:00
 */
export function resolveQimenQueryDateTime(type, { date, time, year } = {}) {
  if (type === 'shanxiang') {
    const y = Number(year) || new Date().getFullYear()
    return { date: `${y}-01-01`, time: '00:00:00' }
  }
  if (type === 'rijia') {
    return { date: String(date ?? '').trim(), time: '00:00:00' }
  }
  return {
    date: String(date ?? '').trim(),
    time: normalizeTimeToSeconds(time)
  }
}

/**
 * 构建奇门请求体（QimenQry）
 * @param {Object} form
 */
export function buildQimenBody(form) {
  const type = form.type || 'shijia'
  const lang = resolveRequestLang(form.lang)
  const { date, time } = resolveQimenQueryDateTime(type, {
    date: form.date || form.birthDate,
    time: form.time || form.birthTime,
    year: form.year
  })
  if (type === 'shanxiang') {
    const body = {
      qry_dt: `${date} ${normalizeTimeToSeconds(time)}`,
      type,
      lang,
      with_liuren: false
    }
    if (form.shanMount) {
      body.shan_mount = form.shanMount
    }
    if (form.yuan) {
      body.yuan = form.yuan
    }
    if (form.paiMethodTouched && form.paiMethod) {
      body.pai_method = form.paiMethod
    }
    if (
      form.feipanStyleTouched
      && form.paiMethod === 'feipan'
      && form.feipanStyle
    ) {
      body.feipan_style = form.feipanStyle
    }
    return body
  }

  const body = {
    qry_dt: `${date} ${normalizeTimeToSeconds(time)}`,
    tz: form.tz ?? 8,
    dst_auto: form.dstAuto !== false,
    type,
    lang,
    with_liuren: form.withLiuren === true
  }

  if (form.longitude != null && form.longitude !== '') {
    body.longitude = Number(form.longitude)
  }
  if (form.isSolarTime != null) {
    body.is_solar_time = form.isSolarTime !== false
  }

  if (form.juMethod) {
    body.ju_method = form.juMethod
  }

  body.pai_method = form.paiMethod || 'zhuanpan'

  if (
    body.pai_method === 'feipan'
    && form.feipanStyle
    && form.feipanStyle !== QIMEN_FEIPAN_STYLE_DEFAULT
  ) {
    body.feipan_style = form.feipanStyle
  }

  return body
}

/**
 * POST /sanshi/qimen
 * @returns {Promise<{ code: number, msg?: string, data?: object, exe_time?: number }>}
 */
export async function fetchQimen(form) {
  const body = buildQimenBody(form)
  return apiClient.post('/sanshi/qimen', body)
}

export function getJuMethodOptions(type) {
  const item = QIMEN_QIJU_OPTIONS.find(o => o.type === type)
  return item?.juMethods || []
}

export function getPaiMethodOptions(type) {
  const item = QIMEN_QIJU_OPTIONS.find(o => o.type === type)
  if (!item || item.paiMethods === 'all') return QIMEN_PAI_METHOD_OPTIONS
  return QIMEN_PAI_METHOD_OPTIONS.filter(p => item.paiMethods.includes(p.value))
}

export function needsJuMethod(type) {
  return type !== 'shanxiang'
}

export function defaultJuMethodForType(type) {
  const methods = getJuMethodOptions(type)
  return methods[0]?.value || null
}

export function defaultPaiMethodForType(type) {
  const methods = getPaiMethodOptions(type)
  return methods[0]?.value || 'zhuanpan'
}

export function defaultShanMount() {
  return QIMEN_SHAN_MOUNT_OPTIONS[0]?.value || 'zi'
}
