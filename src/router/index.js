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
    path: '/mems',
    name: 'mems',
    component: () => import('@/views/MemView')
  },
  {
    path: '/:id/:imageIndex',
    name: 'marker-detail',
    component: () => import('@/views/MarkerDetailView'),
    props: (route) => {
      const imageIndex = Number.parseInt(route.params.imageIndex)
      if (Number.isNaN(imageIndex)) {
        return 0
      }
      const id = route.params.id
      return { id, imageIndex }
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
