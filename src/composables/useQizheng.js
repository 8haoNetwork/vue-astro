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

export function todayNoon() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day} 12:00:00`
}
