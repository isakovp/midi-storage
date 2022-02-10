import { createRouter, createWebHistory } from 'vue-router'
import NavBar from '@/components/common/NavBar'
import SignIn from '@/views/SignIn'
import SignUp from '@/views/SignUp'
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
    path: '/signup',
    name: 'SignUp',
    component: SignUp,
    meta: { requiresAuth: false }
  },
  {
    path: '/:filter?',
    name: 'Home',
    components: {
      default: Home,
      navbar: NavBar
    },
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/files/:id',
    name: 'File',
    components: {
      default: FileShow,
      navbar: NavBar
    },
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
    components: {
      default: Profile,
      navbar: NavBar
    },
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
