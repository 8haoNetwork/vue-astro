// 中文语言配置
export default {
  // 星宿名称翻译：英文简写 -> 中文名称
  starNames: {
    'Ash': '角木蛟',
    'Bha': '亢金龙',
    'Kri': '氐土貉',
    'Roh': '房日兔',
    'Mrig': '心月狐',
    'Ard': '尾火虎',
    'Pun': '箕水豹',
    'Push': '斗木獬',
    'Mag': '女土蝠',
    'P.Phal': '虚日鼠',
    'U.Phal': '危月燕',
    'Has': '室火猪',
    'Chit': '壁水貐',
    'Swat': '奎木狼',
    'Vish': '娄金狗',
    'Anur': '胃土雉',
    'Jyes': '昴日鸡',
    'Mul': '毕月乌',
    'P.Ash': '觜火猴',
    'U.Ash': '参水猿',
    'Shra': '井木犴',
    'Dhan': '鬼金羊',
    'Shat': '柳土獐',
    'P.Bhad': '星日马',
    'U.Bhad': '张月鹿',
    'Rev': '翼火蛇',
    'Abh': '轸水蚓'
  },
  // 星宿关系类型翻译
  relationTypes: {
    'enemy': '业胎关系',
    'friend': '友衰关系',
    'life': '命之星',
    'destiny': '荣亲关系',
    'companion': '危成关系',
    'soulmate': '安坏关系'
  },
  // 页面翻译
  star: {
    title: '星宿分析',
    form: {
      birthDate: '出生日期',
      birthTime: '出生时间',
      query: '查询星宿'
    },
    loading: '查询中...',
    error: {
      selectDateTime: '请选择出生日期和时间',
      queryFailed: '查询星宿失败，请稍后重试',
      fetchFailed: '获取星宿信息失败'
    },
    result: {
      header: '星宿分析结果',
      birthInfo: '出生日期：',
      analysisTime: '分析时间：',
      natal: {
        title: '本命星宿',
        id: '星宿ID',
        name: '星宿名称',
        interpretation: '本命解读'
      },
      daily: {
        title: '值日星宿',
        id: '星宿ID',
        name: '星宿名称',
        interpretation: '值日解读'
      },
      relation: {
        natalTitle: '与他人本命星宿关系',
        dailyTitle: '与他人值日星宿关系',
        reverse: '反向'
      }
    }
  },
  // 其他模块的翻译...
}
