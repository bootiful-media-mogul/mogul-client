import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './HomeView.vue'
import PodcastsSearchView from '@/podcasts/PodcastsSearchView.vue'
import SettingsView from '@/settings/SettingsView.vue'
import AboutView from '@/AboutView.vue'
import PodcastsEpisodesSearchView from '@/podcasts/PodcastsEpisodesSearchView.vue'
import BlogsSearchView from '@/blogs/BlogsSearchView.vue'
import TestView from '@/test/TestView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/test',
      name: 'test',
      component: TestView
    },
    {
      path: '/podcasts',
      name: 'podcasts',
      component: PodcastsSearchView
    },
    {
      path: '/blogs',
      name: 'blogs',
      component: BlogsSearchView
    },

    {
      path: '/settings',
      name: 'settings',
      component: SettingsView
    },

    {
      path: '/podcasts/:id/episodes',
      name: 'podcasts/episodes',
      component: PodcastsEpisodesSearchView,
      props: true
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      props: true
    }
  ]
})

export default router
