import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Constellation from '../views/Constellation.vue'
import Horoscope from '../views/Horoscope.vue'
import Ziwei from '../views/Ziwei.vue'
import Star from '../views/Star.vue'
import Birthday from '../views/Birthday.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/constellation',
      name: 'Constellation',
      component: Constellation
    },
    {
      path: '/horoscope',
      name: 'Horoscope',
      component: Horoscope
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
      path: '/birthday',
      name: 'Birthday',
      component: Birthday
    }
  ]
})

export default router
