<template>
  <router-view name="navbar"></router-view>
  <transition name="fade">
    <div class="alert alert-danger fixed-top alert-dismissible" v-if="error" role="alert">
      <i class="bi-exclamation-triangle-fill"></i>
      Oops. Something went wrong
      <button type="button" class="btn-close" aria-label="Close" @click="error = null"></button>
    </div>
  </transition>
  <div class="container-fluid">
    <router-view></router-view>
  </div>
  <div class="dev-screen-size" v-if="devMode">
    <div class="d-block d-sm-none">Screen: XS</div>
    <div class="d-none d-sm-block d-md-none">Screen: SM</div>
    <div class="d-none d-md-block d-lg-none">Screen: MD</div>
    <div class="d-none d-lg-block d-xl-none">Screen: LG</div>
    <div class="d-none d-xl-block d-xxl-none">Screen: XL</div>
    <div class="d-none d-xxl-block">Screen: XXL</div>
  </div>
</template>

<script>
import { computed, watch, onMounted, onUnmounted, onBeforeMount, onErrorCaptured, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import AuthenticationApi from '@/api/AuthenticationApi'
import Promise from 'promise-polyfill'

export default {
  name: 'App',
  setup () {
    const error = ref(null)
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    let alertTimer = null

    const authenticated = computed(() => {
      return store.state.user.authenticated
    })

    const token = computed(() => {
      return store.state.user.token
    })

    const updateMe = async () => {
      const { data } = await AuthenticationApi.me()
      store.commit('user/setMe', data)
    }

    watch([authenticated, token], () => {
      if (store.state.user.authenticated && store.state.user.token) {
        updateMe()
      } else {
        store.commit('user/changeToken', null)
        router.push({
          name: 'SignIn'
        })
      }
    })

    watch(error, () => {
      if (error.value) {
        if (alertTimer) {
          clearTimeout(alertTimer)
          alertTimer = null
        }
        alertTimer = setTimeout(() => {
          error.value = null
        }, 5000)
      } else if (alertTimer) {
        clearTimeout(alertTimer)
        alertTimer = null
      }
    })

    onMounted(() => {
      if (store.state.user.authenticated) {
        updateMe()
      }
    })

    onUnmounted(() => {
      if (alertTimer) {
        clearTimeout(alertTimer)
        alertTimer = null
      }
    })

    const errorHandler = (e) => {
      if (e && e.response && e.response.status === 403) {
        router.push({
          name: 'SignIn',
          query: { redirect: route.fullPath }
        })
        store.commit('user/changeToken', null)
      } else {
        error.value = e
      }
    }

    Promise._unhandledRejectionFn = errorHandler

    onBeforeMount(() => {
      window.onunhandledrejection = ({ reason }) => {
        errorHandler(reason)
      }
    })
    onErrorCaptured(errorHandler)

    const devMode = computed(() => {
      return process.env.NODE_ENV === 'development'
    })

    return {
      error,
      devMode,
      authenticated
    }
  }
}
</script>

<style lang="scss" scoped>

.navbar ~ .alert {
  margin-top: 3em;
  opacity: 1;
}

.navbar ~ .container-fluid {
  padding-top: 4em;
}

.navbar ~ .alert ~ .container-fluid {
  padding-top: 8em;
}

.dev-screen-size {
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #ff1e60;
  border-radius: 6px;
  padding: 10px;
  opacity: 0.7;
}

.fade-enter-active {
  animation: fade-in .3s;
}
.fade-leave-active {
  animation: fade-out .3s
}

@keyframes fade-in {
  0% {
    margin-top: -3em;
  }
  70% {
    margin-top: 1em;
  }
  100% {
    margin-top: 0em;
  }
}

@keyframes fade-out {
  0% {
    margin-top: 0em;
  }
  100% {
    margin-top: -3em;
  }
}

</style>
