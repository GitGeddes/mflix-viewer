import { createRouter, createWebHistory } from 'vue-router'
import MoviesView from '../views/MoviesView.vue'
import HomeView from '@/views/HomeView.vue'
import MovieView from '@/views/MovieView.vue'
import LoginForm from '@/components/LoginForm.vue'
import UserSettings from '@/views/UserSettings.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/movies',
      name: 'movies',
      component: MoviesView,
    },
    {
      path: '/movies/:movieId',
      component: MovieView,
    },
    {
      path: '/user',
      component: UserSettings,
    },
  ],
})

export default router
