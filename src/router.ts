import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@views/HomeView.vue'
import BoardView from '@views/BoardView.vue'
import CardsView from '@views/CardsView.vue'
import AboutView from '@views/AboutView.vue'
import TermsView from '@views/TermsView.vue'
import AttributionsView from '@views/AttributionsView.vue'
import NotFoundView from '@views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/cartelle',
      name: 'cartelle',
      props: route => ({ amount: parseInt(route.hash.replace("#", "")) }),
      component: CardsView
    },
    {
      path: '/tabellone',
      name: 'tabellone',
      component: BoardView
    },
    {
      path: '/riguardo',
      name: 'riguardo',
      component: AboutView
    },
    {
      path: '/termini',
      name: 'termini',
      component: TermsView
    },
    {
      path: '/attribuzioni',
      name: 'attribuzioni',
      component: AttributionsView
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: NotFoundView
    }
  ]
})

export default router
