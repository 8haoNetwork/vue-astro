import { formatDeg, formatPalaceDegree, palaceNameByIndex, xiuDisplayByKey } from '../utils/qizhengChart'

export function extractQizhengError(err, fallback = '排盘失败，请稍后重试') {
  if (!err) return fallback
  const data = err.response?.data
  if (typeof data === 'string') return data
  if (data?.msg) return data.msg
  const detail = data?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail) && detail.length) {
    return detail.map((d) => d.msg || d.message || JSON.stringify(d)).join('；')
  }
  if (err.message) return err.message
  return fallback
}

export function isApiSuccess(res) {
  return res?.code === 0 && res?.data
}

export function genderLabel(gender, t) {
  if (gender === 'female') return t('qizheng.female')
  if (gender === 'male') return t('qizheng.male')
  return gender || ''
}

export function patternTypeLabel(type, t) {
  if (type === 'warning') return t('qizheng.patternWarning')
  return t('qizheng.patternLucky')
}

/**
 * 基础解读：命度 + 度主/恩用仇难 + 垣殿 + 会合 + 喜忌格。
 * 不拼西式性格稿；语料空时只陈盘上已有事实。
 * 恩/用/仇/难、喜格/忌格栏名由前端传入（VO 不再返回）。
 */
export function buildBasicInterpretation(vo, labels = {}) {
  if (!vo?.ming) return []
  const graceName = labels.grace || '恩'
  const usefulName = labels.useful || '用'
  const foeName = labels.foe || '仇'
  const hardshipName = labels.hardship || '难'
  const luckyName = labels.patternLucky || '喜格'
  const warningName = labels.patternWarning || '忌格'
  const blocks = []
  const ming = vo.ming
  const mingPalace = vo.palaces?.[0]
  const mingDeg = formatPalaceDegree(mingPalace?.earthly_branch_label, ming.palace_degree)
  const xiuDeg = formatDeg(ming.xiu_degree)
  const xiuName = `${ming.xiu_label || ''}${ming.lord_label || ''}`
  blocks.push({
    key: 'ming',
    title: '命度',
    body: [
      `命宫在${mingPalace?.earthly_branch_label || ''}，宫度 ${mingDeg}，宿度 ${xiuName} ${xiuDeg}。`,
      ming.lord_type_label ? `${ming.lord_type_label}（度主${ming.lord_label}）。` : '',
      '立命：时加太阳，顺数至卯；命度与日同络。'
    ].filter(Boolean).join('')
  })

  if (vo.grace) {
    const g = vo.grace
    blocks.push({
      key: 'grace',
      title: '恩用仇难',
      body: `度主按${g.self_wx_label}论。${graceName}（生我）${g.grace_label}，${usefulName}（我生）${g.useful_label}，${foeName}（我克）${g.foe_label}，${hardshipName}（克我）${g.hardship_label}。此为相对命度主五行，非子平用神。`
    })
  }

  const dignities = (vo.stars || []).filter((s) => s.dignity)
  if (dignities.length) {
    blocks.push({
      key: 'dignity',
      title: '垣殿',
      body: `${dignities.map((s) => `${s.label}${s.dignity_label}（${palaceNameByIndex(vo.palaces, s.palace_index)}）`).join('、')}。`
    })
  }

  const ownXiu = (vo.stars || []).filter((s) => s.in_own_xiu)
  if (ownXiu.length) {
    blocks.push({
      key: 'ownXiu',
      title: '得度',
      body: `${ownXiu.map((s) => `${s.label}得度（${xiuDisplayByKey(vo.xiu_spans, s.xiu_degree?.xiu)}）`).join('、')}。`
    })
  }

  if (vo.aspects?.length) {
    blocks.push({
      key: 'aspects',
      title: '会合',
      body: `${vo.aspects.map((a) => {
        const from = (vo.stars || []).find((s) => s.key === a.from_star)?.label || a.from_star
        const to = (vo.stars || []).find((s) => s.key === a.to_star)?.label || a.to_star
        return `${from}${a.type_label}${to}`
      }).join('、')}。`
    })
  }

  const patterns = vo.patterns || []
  if (patterns.length) {
    const lucky = patterns.filter((p) => p.type === 'lucky')
    const warning = patterns.filter((p) => p.type === 'warning')
    const parts = []
    if (lucky.length) parts.push(`${luckyName}：${lucky.map((p) => p.name || p.key).join('、')}`)
    if (warning.length) parts.push(`${warningName}：${warning.map((p) => p.name || p.key).join('、')}`)
    blocks.push({
      key: 'patterns',
      title: '格局',
      body: `${parts.join('。')}。`
    })
  }

  return blocks
}

export function todayNoon() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day} 12:00:00`
}
