import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import BuscadorView from '../views/BuscadorView.vue'
import DetalleView from '../views/DetalleView.vue'
import FavoritosView from '../views/FavoritosView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path:'/buscador',
      name: 'buscador',
      component: BuscadorView
    },
    {
      path: '/detalle/:id',
      name: 'detalle',
      component: DetalleView
    },
    {
      path: '/favoritos',
      name: 'favoritos',
      component: FavoritosView
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView
    }
  ]
})

export default router
