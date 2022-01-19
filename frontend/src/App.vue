<template>
  <router-view></router-view>
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
import { computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'App',
  setup () {
    const store = useStore()
    const router = useRouter()

    const authenticated = computed(() => {
      return store.state.user.authenticated
    })

    const token = computed(() => {
      return store.state.user.token
    })

    const updateMe = () => {
      store.dispatch('user/updateMe')
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

    onMounted(() => {
      if (store.state.user.authenticated) {
        updateMe()
      }
    })

    const devMode = computed(() => {
      return process.env.NODE_ENV === 'development'
    })
    return {
      devMode,
      authenticated
    }
  }
}
</script>

<style lang="scss" scoped>

.dev-screen-size {
  position: fixed;
  bottom: 0;
  right: 0;
  background-color: #ff1e60;
  border-radius: 6px;
  padding: 10px;
  opacity: 0.7;
}

</style>
