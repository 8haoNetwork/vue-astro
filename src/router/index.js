import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Sign from '../views/Sign.vue'
import Scope from '../views/Scope.vue'
import Ziwei from '../views/Ziwei.vue'
import Star from '../views/Star.vue'
import Bazi from '../views/bazi/index.vue'
import BaziMatch from '../views/bazi/BaziMatch.vue'
import ChartIndex from '../views/chart/index.vue'
import ChartPreview from '../views/chart/ChartPreview.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/sign',
      name: 'Sign',
      component: Sign
    },
    {
      path: '/scope',
      name: 'Scope',
      component: Scope
    },
    {
      path: '/ziwei',
      name: 'Ziwei',
      component: Ziwei
    },
    {
      path: '/star',
      name: 'Star',
      component: Star
    },
    {
      path: '/bazi',
      name: 'Bazi',
      component: Bazi
    },
    {
      path: '/bazi/match',
      name: 'BaziMatch',
      component: BaziMatch
    },
    {
      path: '/chart',
      name: 'Chart',
      component: ChartIndex
    },
    {
      path: '/chart/preview',
      name: 'ChartPreview',
      component: ChartPreview
    }
  ]
})

export default router
