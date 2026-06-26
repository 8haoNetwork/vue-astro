/** 洛书九宫屏显顺序（行优先） */
export const LUOSHU_GRID = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6]
]

/** 转盘类：含星门神干；金函仅神星+门 */
export function isJinhanVariant(panVariant) {
  return panVariant === 'rijia_jinhan'
}

/** 排盘结果是否为日家金函 */
export function isJinhanResult(data) {
  if (!data) return false
  if (data.ju_method === 'jinhan') return true
  return isJinhanVariant(data.pan_variant)
}

/** 十二时辰地支序（黄黑道） */
export const HUANG_HEI_BRANCH_ORDER = [
  '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'
]

const HUANG_HEI_BRANCH_INDEX = Object.fromEntries(
  HUANG_HEI_BRANCH_ORDER.map((b, i) => [b, i])
)

export function isZhuanpanLayout(panVariant) {
  return panVariant && !isJinhanVariant(panVariant)
}

/** 响应是否为飞盘（pai_method 或 pan_variant 推断） */
export function isFeipanResult(data) {
  if (!data) return false
  if (data.pai_method === 'feipan') return true
  const v = String(data.pan_variant || '')
  return v.includes('feipan')
}

/** 响应是否为括囊飞盘 */
export function isKuonangFeipan(data) {
  if (!data) return false
  if (data.feipan_style === 'kuonang') return true
  const v = String(data.pan_variant || '')
  return v.includes('kuonang')
}

/** 括囊三暗干支 [天盘, 地盘, 人盘] */
export function getAnGanLayers(cell) {
  if (!cell) return []

  const raw = cell.an_gan_layers ?? cell.anGanLayers
  if (raw == null) return []

  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      return getAnGanLayers({ an_gan_layers: parsed })
    } catch {
      return raw.trim() ? [raw.trim()] : []
    }
  }

  if (Array.isArray(raw)) {
    return raw
      .map(item => {
        if (item == null) return ''
        if (typeof item === 'string') return item.trim()
        if (typeof item === 'object') {
          const gan = item.gan ?? item.tian_gan ?? item.stem ?? ''
          const zhi = item.zhi ?? item.di_zhi ?? item.branch ?? ''
          const joined = `${gan}${zhi}`.trim()
          if (joined) return joined
          return Object.values(item).join('').trim()
        }
        return String(item).trim()
      })
      .filter(Boolean)
  }

  if (typeof raw === 'object') {
    const ordered = ['tian', 'di', 'ren', 'tian_pan', 'di_pan', 'ren_pan']
    const fromOrder = ordered
      .map(key => raw[key])
      .filter(v => v != null && String(v).trim() !== '')
      .map(v => String(v).trim())
    if (fromOrder.length) return fromOrder
    return Object.values(raw)
      .map(v => (v == null ? '' : String(v).trim()))
      .filter(Boolean)
  }

  return []
}

/** 吉门（展示用绿色，与参考图一致） */
const AUSPICIOUS_MEN = new Set(['生', '开', '休'])

export function isAuspiciousMen(men) {
  if (!men) return false
  const s = String(men).trim()
  return AUSPICIOUS_MEN.has(s) || AUSPICIOUS_MEN.has(s.charAt(0))
}

/** 天盘干/地盘干：后端为可空字符串数组，顺序拼接展示（兼容旧版单字符串） */
export function formatPanGanGan(value) {
  if (value == null) return ''
  const list = Array.isArray(value) ? value : [value]
  return list
    .map(s => (s == null ? '' : String(s).trim()))
    .filter(s => s !== '')
    .join('')
}

/** 宫位干支辅助：长生 + 旺衰 */
export function getPalaceGanAux(ganAux) {
  if (!ganAux) return { changsheng: '', wangShuai: '' }
  return {
    changsheng: ganAux.changsheng ? String(ganAux.changsheng).trim() : '',
    wangShuai: ganAux.wang_shuai ? String(ganAux.wang_shuai).trim() : ''
  }
}

/** 左下角应期：如「内 875,10」——单位数连写，≥10 前加逗号 */
export function formatPalaceYingQiLabel(cell) {
  if (!cell) return ''
  const neiWai = cell.nei_wai != null ? String(cell.nei_wai).trim() : ''
  const pool = cell.ying_qi?.pool
  const numPart = Array.isArray(pool)
    ? pool.map(n => {
        const s = String(n)
        return s.length >= 2 ? `,${s}` : s
      }).join('')
    : (pool != null && pool !== '' ? String(pool) : '')

  if (!neiWai && !numPart) return ''
  if (!numPart) return neiWai
  if (!neiWai) return numPart
  return `${neiWai} ${numPart}`
}

/** 神迹轨迹：字符串或字符串数组 */
export function formatShenTrail(value) {
  if (value == null) return ''
  if (Array.isArray(value)) {
    return value.map(s => String(s).trim()).filter(Boolean).join(' ')
  }
  return String(value).trim()
}

export function getPalaceCell(data, luoshu) {
  if (!data?.jiu_gong) return null
  return data.jiu_gong[String(luoshu)] || null
}

/** 宫位展示名，如「巽四宫」 */
export function formatPalaceLabel(luoshu, cell) {
  const bagua = String(cell?.bagua ?? cell?.gong ?? '').trim()
  if (bagua && luoshu != null) return `${bagua}${luoshu}宫`
  if (bagua) return `${bagua}宫`
  if (luoshu != null) return `${luoshu}宫`
  return '宫位'
}

function normalizeGeJuList(value) {
  if (!Array.isArray(value)) return []
  return value.map(item => String(item ?? '').trim()).filter(Boolean)
}

/** 宫位 ge_ju 对象（字段归一化） */
export function getPalaceGeJu(cell) {
  if (!cell?.ge_ju || typeof cell.ge_ju !== 'object') return null

  const g = cell.ge_ju
  return {
    name: String(g.name ?? '').trim(),
    level: String(g.level ?? '').trim(),
    level_cn: String(g.level_cn ?? '').trim(),
    title: String(g.title ?? '').trim(),
    summary: String(g.summary ?? '').trim(),
    tags: normalizeGeJuList(g.tags),
    scenarios: normalizeGeJuList(g.scenarios),
    desc: String(g.desc ?? '').trim(),
    tian_gan: String(g.tian_gan ?? '').trim(),
    di_gan: String(g.di_gan ?? '').trim(),
    door_hint: String(g.door_hint ?? '').trim()
  }
}

export function hasPalaceGeJu(cell) {
  const g = getPalaceGeJu(cell)
  if (!g) return false
  return !!(
    g.name
    || g.title
    || g.summary
    || g.desc
    || g.tags.length
    || g.scenarios.length
    || g.tian_gan
    || g.di_gan
    || g.door_hint
  )
}

export function formatJieQi(item) {
  if (!item) return '--'
  const t = item.jiaojie_local ? ` ${item.jiaojie_local}` : ''
  return `${item.name || '--'}${t}`
}

/** 单柱 QimenPillarVo → 展示项 */
function mapQimenPillarVo(pillar) {
  return {
    label: pillar?.label ?? '--',
    kong_wang: pillar?.kong_wang != null ? String(pillar.kong_wang).trim() : ''
  }
}

/**
 * 四柱列表：后端 QimenResultVo 为 year/month/day/hour_pillar（非 pillars 数组）。
 * label=干支与单位（如丙午年），kong_wang=旬空（如寅卯，无则空串）；日家无 hour_pillar。
 */
export function normalizeQimenPillars(data) {
  if (!data) return []

  if (Array.isArray(data.pillars) && data.pillars.length) {
    return data.pillars.map((p, i) => ({
      key: p?.key ?? `p${i}`,
      ...mapQimenPillarVo(p)
    }))
  }

  const slots = [
    { key: 'year', pillar: data.year_pillar },
    { key: 'month', pillar: data.month_pillar },
    { key: 'day', pillar: data.day_pillar },
    { key: 'hour', pillar: data.hour_pillar }
  ]
  return slots
    .filter(({ pillar }) => pillar != null)
    .map(({ key, pillar }) => ({ key, ...mapQimenPillarVo(pillar) }))
}

/** special_patterns：name + brief */
export function getQimenSpecialPatterns(data) {
  const raw = data?.special_patterns
  if (!Array.isArray(raw) || !raw.length) return []

  return raw
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const name = String(item.name ?? '').trim()
      if (!name) return null
      return {
        code: String(item.code ?? name).trim(),
        name,
        brief: item.brief ? String(item.brief).trim() : ''
      }
    })
    .filter(Boolean)
}

function extractHourBranchFromPillar(pillar) {
  if (!pillar) return ''
  if (pillar.hour_branch) return String(pillar.hour_branch).trim()
  if (pillar.branch) return String(pillar.branch).trim()
  const label = String(pillar.label ?? '').trim()
  const stemBranch = label.replace(/[年月日时]$/, '')
  if (stemBranch.length >= 2) return stemBranch.slice(-1)
  return ''
}

/** 查询时刻地支（用于黄黑道高亮） */
export function getQueryHourBranch(data) {
  if (!data) return ''
  const direct = data.current_hour_branch ?? data.hour_branch ?? data.query_hour_branch
  if (direct) return String(direct).trim()
  return extractHourBranchFromPillar(data.hour_pillar)
}

function resolveHuangHeiDaoRaw(data) {
  if (!data) return null
  const raw = data.huang_hei_dao ?? data.huanghei_dao ?? data.huang_hei_dao_list
  if (Array.isArray(raw)) return raw
  if (raw && Array.isArray(raw.items)) return raw.items
  return null
}

function normalizeHuangHeiDaoItem(raw) {
  if (!raw || typeof raw !== 'object') return null

  const hourBranch = String(raw.hour_branch ?? '').trim()
  const hourLabel = String(raw.hour_label ?? '').trim()
  const godCode = String(raw.god_code ?? '').trim()
  const godName = String(raw.god_name ?? '').trim()
  const daoType = String(raw.dao_type ?? '').trim().toLowerCase()
  const brief = raw.brief ? String(raw.brief).trim() : ''

  if (!hourBranch && !hourLabel && !godName) return null

  const isHuang = daoType === 'huang' || raw.auspicious === true
  const isHei = daoType === 'hei' || raw.auspicious === false

  return {
    hour_branch: hourBranch,
    hour_label: hourLabel || (hourBranch ? `${hourBranch}时` : ''),
    god_code: godCode || `${hourBranch}-${godName}`,
    god_name: godName,
    dao_type: isHei ? 'hei' : isHuang ? 'huang' : daoType,
    auspicious: isHuang,
    isHuang,
    dao_label: isHei ? '黑道' : isHuang ? '黄道' : '',
    brief
  }
}

/** 日家金函：黄黑道 12 时辰，按子→亥排序 */
export function normalizeHuangHeiDao(data) {
  const raw = resolveHuangHeiDaoRaw(data)
  if (!raw?.length) return []

  return raw
    .map(normalizeHuangHeiDaoItem)
    .filter(Boolean)
    .sort((a, b) => {
      const ai = HUANG_HEI_BRANCH_INDEX[a.hour_branch] ?? 99
      const bi = HUANG_HEI_BRANCH_INDEX[b.hour_branch] ?? 99
      return ai - bi
    })
}

/**
 * 从 axios / ApiResp 提取错误文案
 */
export function extractQimenError(err, fallback = '排盘失败，请稍后重试') {
  if (!err) return fallback
  const data = err.response?.data
  if (typeof data === 'string') return data
  if (data?.msg) return data.msg
  const detail = data?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail) && detail.length) {
    return detail.map(d => d.msg || d.message || JSON.stringify(d)).join('；')
  }
  if (err.message) return err.message
  return fallback
}
