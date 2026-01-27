import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './HomeView.vue'
import PodcastsSearchView from '@/podcasts/PodcastsSearchView.vue'
import SettingsView from '@/settings/SettingsView.vue'
import AboutView from '@/AboutView.vue'
import PodcastsEpisodesSearchView from '@/podcasts/PodcastsEpisodesSearchView.vue'
import BlogsSearchView from '@/blogs/BlogsSearchView.vue'
import TestView from '@/test/TestView.vue'
import PodcastsEpisodesEditor from '@/podcasts/PodcastsEpisodesEditor.vue'
import SearchView from '@/search/SearchView.vue'
import JobsView from '@/jobs/JobsView.vue'
import {
  entityNavigationContexts,
  NavigationContext,
  resetNotesForNotable,
  results
} from '@/services'
import BlogsPostEditor from '@/blogs/BlogsPostEditor.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: JobsView
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
      path: '/search',
      name: 'search',
      component: SearchView
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView
    },

    /* new entities route */
    {
      path: '/entities/:type/:id',
      name: 'entity',
      beforeEnter: async (to) => {
        /**
         * todo:
         * - request comes in with just type and id
         * - we exchange for full context from server
         * - we send full context to local handlers which provide full routing.
         */
        const type: string = to.params.type as string
        const id: number = Number(to.params.id) as number
        const context = await entityNavigationContexts.buildEntityContextFor(type, id)
        const navigationContext: NavigationContext = results.navigation(context.resolvedType)(
          context.context
        )
        const entries = Object.fromEntries(navigationContext.params)
        return {
          name: navigationContext.name,
          params: entries
        }
      },
      // i don't need the component, technically, but the TypeScript fails to validate if it's not
      // there. it needs <em>either</em> template or component. so we're going with component.
      component: { template: '<div>Redirecting...</div>' }
    },

    /* blogs route */
    {
      props(to) {
        return {
          blogId: Number(to.params.blogId ),
          postId: Number(to.params.postId)
        }
      },
      path: '/blogs/:blogId/posts/:postId',
      name: 'blogs/posts/post',
      component: BlogsPostEditor
    },

    /* podcasts route */

    {
      props(to) {
        return {
          podcastId: Number(to.params.podcastId),
          episodeId: Number(to.params.episodeId)
        }
      },
      path: '/podcasts/:podcastId/episodes/:episodeId',
      name: 'podcasts/episodes/episode',
      component: PodcastsEpisodesEditor
    },
    {
      path: '/podcasts/:podcastId/episodes',
      name: 'podcasts/episodes',
      component: PodcastsEpisodesSearchView,
      props(route) {
        return {
          podcastId: Number(route.params.podcastId)
        }
      }
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      props: true
    }
  ]
})
router.beforeEach(async (to, from, next) => {
  await resetNotesForNotable()
  next()
})
export default router
