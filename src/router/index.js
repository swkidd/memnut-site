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
    path: '/:id',
    name: 'marker-detail',
    component: () => import('@/views/MarkerDetailView'),
    props: true
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
