/** 六壬盘面：地支固定宫位（南上） */
export const LIUREN_BRANCH_LAYOUT = [
  ['巳', '午', '未', '申'],
  ['辰', null, null, '酉'],
  ['卯', null, null, '戌'],
  ['寅', '丑', '子', '亥']
]

export function formatJieQi(item) {
  if (!item) return '--'
  const t = item.jiaojie_local ? ` ${item.jiaojie_local}` : ''
  return `${item.name || '--'}${t}`
}

function mapPillarVo(pillar) {
  return {
    label: pillar?.label ?? '--',
    kong_wang: pillar?.kong_wang != null ? String(pillar.kong_wang).trim() : ''
  }
}

/** 四柱列表（与 QimenPillarVo 结构一致） */
export function normalizeLiurenPillars(data) {
  if (!data) return []

  const slots = [
    { key: 'year', pillar: data.year_pillar },
    { key: 'month', pillar: data.month_pillar },
    { key: 'day', pillar: data.day_pillar },
    { key: 'hour', pillar: data.hour_pillar }
  ]
  return slots
    .filter(({ pillar }) => pillar != null)
    .map(({ key, pillar }) => ({ key, ...mapPillarVo(pillar) }))
}

export function pillarStemBranch(label) {
  if (!label) return ''
  return String(label).replace(/[年月日时]$/, '')
}

export function pillarSuffix(label) {
  if (!label) return ''
  const m = String(label).match(/[年月日时]$/)
  return m ? m[0] : ''
}

/** 地盘宫位单元格数据 */
export function isJinkoujueResult(data) {
  if (!data) return false
  return data.type === '金口诀'
}

export function getLiurenPanCell(data, earthBranch) {
  if (!data || !earthBranch) return null
  return {
    earth: earthBranch,
    sky: data.tian_pan?.[earthBranch] ?? '--',
    jiang: data.tian_jiang_on_earth?.[earthBranch] ?? '--',
    isShi: data.shi === earthBranch,
    isDiFen: data.di_fen === earthBranch
  }
}

export function normalizeInterpret(raw) {
  if (!raw) return null
  return {
    category: raw.category || '',
    name: raw.name || '',
    title: raw.title || '',
    summary: raw.summary || '',
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    scenarios: Array.isArray(raw.scenarios) ? raw.scenarios : [],
    desc: raw.desc || '',
    level: raw.level || null,
    level_cn: raw.level_cn || null,
    meta_lines: Array.isArray(raw.meta_lines) ? raw.meta_lines : []
  }
}

export function getGeJuDetailList(data) {
  const detail = data?.ge_ju_detail
  if (Array.isArray(detail) && detail.length) {
    return detail.map((item) => ({
      name: item.name,
      interpret: normalizeInterpret(item.interpret)
    }))
  }
  return (data?.ge_ju || []).map((name) => ({ name, interpret: null }))
}

export function resolveLiurenInterpret(data, selection) {
  if (!data || !selection) return null
  const { kind, key } = selection
  if (kind === 'geju') {
    const item = getGeJuDetailList(data).find((g) => g.name === key)
    return item?.interpret || null
  }
  if (kind === 'si_ke') {
    const ke = (data.si_ke || []).find((k) => k.name === key)
    return normalizeInterpret(ke?.interpret)
  }
  if (kind === 'san_chuan') {
    const ch = (data.san_chuan || []).find((c) => c.name === key)
    return normalizeInterpret(ch?.interpret)
  }
  if (kind === 'palace') {
    const note = data.palace_notes?.[key]
    return normalizeInterpret(note?.interpret)
  }
  return null
}

export function resolveLiurenSelectionLabel(_data, selection) {
  if (!selection) return ''
  const { kind, key } = selection
  if (kind === 'geju') return `课体 · ${key}`
  if (kind === 'si_ke') return key
  if (kind === 'san_chuan') return key
  if (kind === 'palace') return `${key}宫`
  return ''
}

export function hasLiurenInterpret(interp) {
  return !!(interp && (interp.title || interp.summary || interp.desc))
}

export function isLiurenSelectionActive(selection, kind, key) {
  return selection?.kind === kind && selection?.key === key
}

export function extractLiurenError(err, fallback = '排盘失败，请稍后重试') {
  if (!err) return fallback
  const res = err.response?.data
  if (typeof res === 'string') return res
  if (res?.msg) return res.msg
  const detail = res?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail) && detail.length) {
    return detail.map(d => d.msg || d.message || JSON.stringify(d)).join('；')
  }
  if (err.message) return err.message
  return fallback
}
