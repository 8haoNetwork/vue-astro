/** 天干 → 五行 class */
const GAN_WUXING_CLASS = {
  甲: 'gan--mu',
  乙: 'gan--mu',
  丙: 'gan--huo',
  丁: 'gan--huo-ding',
  戊: 'gan--tu',
  己: 'gan--tu',
  庚: 'gan--jin',
  辛: 'gan--jin',
  壬: 'gan--shui',
  癸: 'gan--shui'
}

/** 地支 → 五行 class（干支合写时支用淡色） */
const ZHI_WUXING_CLASS = {
  寅: 'zhi--mu',
  卯: 'zhi--mu',
  巳: 'zhi--huo',
  午: 'zhi--huo',
  辰: 'zhi--tu',
  戌: 'zhi--tu',
  丑: 'zhi--tu',
  未: 'zhi--tu',
  申: 'zhi--jin',
  酉: 'zhi--jin',
  亥: 'zhi--shui',
  子: 'zhi--shui'
}

const MEN_JI = new Set(['开', '休', '生'])
const MEN_XIONG = new Set(['伤', '杜', '死', '惊'])
const MEN_ZHONG = new Set(['景'])

const STAR_CLASS = {
  天蓬: 'star--shui',
  蓬: 'star--shui',
  天芮: 'star--tu',
  芮: 'star--tu',
  天冲: 'star--mu',
  冲: 'star--mu',
  天辅: 'star--mu-light',
  辅: 'star--mu-light',
  天禽: 'star--tu-deep',
  禽: 'star--tu-deep',
  天心: 'star--jin',
  心: 'star--jin',
  天柱: 'star--jin-light',
  柱: 'star--jin-light',
  天任: 'star--tu-light',
  任: 'star--tu-light',
  天英: 'star--huo',
  英: 'star--huo'
}

const SHEN_CLASS = {
  值符: 'shen--zhifu',
  螣蛇: 'shen--tengshe',
  蛇: 'shen--tengshe',
  太阴: 'shen--taiyin',
  六合: 'shen--liuhe',
  合: 'shen--liuhe',
  白虎: 'shen--baihu',
  虎: 'shen--baihu',
  玄武: 'shen--xuanwu',
  武: 'shen--xuanwu',
  九地: 'shen--jiudi',
  地: 'shen--jiudi',
  九天: 'shen--jiutian',
  天: 'shen--jiutian'
}

export function getGanCharClass(char) {
  if (!char) return ''
  return GAN_WUXING_CLASS[char] || ZHI_WUXING_CLASS[char] || ''
}

/** 拆分干支串为带 class 的字符列表 */
export function splitGanColoredChars(text) {
  const s = String(text ?? '').trim()
  if (!s) return []
  return [...s].map(ch => ({ ch, class: getGanCharClass(ch) }))
}

function normalizeMenName(men) {
  if (!men) return ''
  const s = String(men).trim()
  return s.endsWith('门') ? s.charAt(0) : s.charAt(0)
}

export function getMenClass(men) {
  const key = normalizeMenName(men)
  if (!key) return ''
  if (MEN_JI.has(key)) return 'men--ji'
  if (MEN_XIONG.has(key)) return 'men--xiong'
  if (MEN_ZHONG.has(key)) return 'men--zhong'
  return ''
}

function lookupNamedClass(map, name) {
  if (!name) return ''
  const s = String(name).trim()
  if (map[s]) return map[s]
  const noTian = s.startsWith('天') ? s.slice(1) : s
  return map[noTian] || map[s.replace(/星|神|门/g, '')] || ''
}

export function getStarClass(star) {
  return lookupNamedClass(STAR_CLASS, star)
}

export function getShenClass(shen) {
  return lookupNamedClass(SHEN_CLASS, shen)
}

/** 阴阳遁：yin_yang */
export function parseYinYangDun(data) {
  if (!data?.yin_yang) return null
  const s = String(data.yin_yang).trim().toLowerCase()
  if (s === 'yang' || s === '阳') return 'yang'
  if (s === 'yin' || s === '阴') return 'yin'
  return null
}

/** 局数：ju_num */
export function parseJuNum(data) {
  if (data?.ju_num == null || data.ju_num === '') return null
  const n = Number(data.ju_num)
  return Number.isFinite(n) ? n : null
}

export function getJuDisplayClass(data) {
  const yy = parseYinYangDun(data)
  if (yy === 'yang') return 'ju--yang'
  if (yy === 'yin') return 'ju--yin'
  return ''
}

/** 格局吉凶 level → CSS class */
export function getGeJuLevelClass(level) {
  const s = String(level ?? '').trim().toLowerCase()
  if (s === 'auspicious' || s === 'ji' || s === '吉') return 'geju--ji'
  if (s === 'inauspicious' || s === 'xiong' || s === '凶') return 'geju--xiong'
  if (s === 'neutral' || s === 'ping' || s === '平') return 'geju--ping'
  return ''
}

export function getGeJuLevelClassFromGeJu(geJu) {
  if (!geJu) return ''
  return getGeJuLevelClass(geJu.level) || getGeJuLevelClass(geJu.level_cn)
}
