import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'map',
    component: () => import('@/views/MapView')
  },
  {
    path: '/memages',
    name: 'memages',
    component: () => import('@/views/MemView')
  },
  {
    path: '/:id',
    name: 'memage-detail',
    component: () => import('@/views/MemageDetailView'),
    props: true,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
