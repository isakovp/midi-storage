import { createRouter, createWebHistory } from 'vue-router'
import SignIn from '@/views/SignIn'
import Home from '@/views/Home.vue'
import FileShow from '@/views/files/Show'
import Profile from '@/views/Profile'
import store from '@/store'

// Use webpackChunkName for split pack files
const routes = [
  {
    path: '/login',
    name: 'SignIn',
    component: SignIn,
    meta: { requiresAuth: false }
  },
  {
    path: '/:filter?',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/files/:id',
    name: 'File',
    component: FileShow,
    meta: {
      breadcrumbs: [
        { name: 'Home', label: 'Home' }
      ],
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      breadcrumbs: [
        { name: 'Home', label: 'Home' }
      ],
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !store.state.user.authenticated) {
    return {
      name: 'SignIn',
      query: { redirect: to.fullPath }
    }
  } else if (!to.meta.requiresAuth && store.state.user.authenticated) {
    return {
      name: 'Home'
    }
  }
})

export default router
