import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './HomeView.vue'
import EpisodesView from '@/podcasts/EpisodesView.vue'
import PodcastsSearchView from '@/podcasts/PodcastsSearchView.vue'
import SettingsView from '@/settings/SettingsView.vue'
import About from '@/About.vue'
import PodcastsEpisodesSearchView from '@/podcasts/PodcastsEpisodesSearchView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/podcasts',
      name: 'podcasts',
      component: PodcastsSearchView
    },

    {
      path: '/settings',
      name: 'settings',
      component: SettingsView
    },

    {
      path: '/podcast-episodes/:id',
      name: 'podcast-episodes',
      component: PodcastsEpisodesSearchView,
      props: true
    },
    {
      path: '/about',
      name: 'about',
      component: About,
      props: true
    }
  ]
})

export default router
