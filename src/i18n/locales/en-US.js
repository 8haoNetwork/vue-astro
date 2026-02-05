// English language configuration
export default {
  // Star name translations: English abbreviation -> English name
  starNames: {
    'Ash': 'Ashwini',
    'Bha': 'Bharani',
    'Kri': 'Krittika',
    'Roh': 'Rohini',
    'Mrig': 'Mrigashira',
    'Ard': 'Ardra',
    'Pun': 'Punarvasu',
    'Push': 'Pushya',
    'Mag': 'Magha',
    'P.Phal': 'Purva Phalguni',
    'U.Phal': 'Uttara Phalguni',
    'Has': 'Hasta',
    'Chit': 'Chitra',
    'Swat': 'Swati',
    'Vish': 'Vishakha',
    'Anur': 'Anuradha',
    'Jyes': 'Jyeshtha',
    'Mul': 'Mula',
    'P.Ash': 'Purva Ashadha',
    'U.Ash': 'Uttara Ashadha',
    'Shra': 'Shravana',
    'Dhan': 'Dhanishta',
    'Shat': 'Shatabhisha',
    'P.Bhad': 'Purva Bhadrapada',
    'U.Bhad': 'Uttara Bhadrapada',
    'Rev': 'Revati',
    'Abh': 'Abhijit'
  },
  // Star relationship type translations
  relationTypes: {
    'enemy': 'Enemy Relationship',
    'friend': 'Friend Relationship',
    'life': 'Life Star',
    'destiny': 'Destiny Relationship',
    'companion': 'Companion Relationship',
    'soulmate': 'Soulmate Relationship'
  },
  // Page translations
  star: {
    title: 'Star Analysis',
    form: {
      birthDate: 'Birth Date',
      birthTime: 'Birth Time',
      query: 'Query Star'
    },
    loading: 'Querying...',
    error: {
      selectDateTime: 'Please select birth date and time',
      queryFailed: 'Failed to query star, please try again later',
      fetchFailed: 'Failed to get star information'
    },
    result: {
      header: 'Star Analysis Result',
      birthInfo: 'Birth Date: ',
      analysisTime: 'Analysis Time: ',
      natal: {
        title: 'Natal Star',
        id: 'Star ID',
        name: 'Star Name',
        interpretation: 'Natal Interpretation'
      },
      daily: {
        title: 'Daily Star',
        id: 'Star ID',
        name: 'Star Name',
        interpretation: 'Daily Interpretation'
      },
      relation: {
        natalTitle: 'Relationship with Others\' Natal Stars',
        dailyTitle: 'Relationship with Others\' Daily Stars',
        reverse: 'Reverse'
      }
    }
  },
  // Other module translations...
}
