<template>
  <slot name="header">
    <nav-bar/>
  </slot>
  <div class="alert alert-danger fixed-top alert-dismissible fade show" v-if="error" role="alert">
    <i class="bi-exclamation-triangle-fill"></i>
    Oops. Something went wrong
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" @click="error = null"></button>
  </div>
  <div class="container-fluid">
    <nav aria-label="breadcrumb" v-if="breadcrumbs">
      <ol class="breadcrumb">
        <li class="breadcrumb-item" v-for="(breadcrumb, index) in breadcrumbs" :key="index">
          <router-link :to="{name: breadcrumb.name}">{{breadcrumb.label}}</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          <slot name="breadcrumb">
            Unknown
          </slot>
        </li>
      </ol>
    </nav>
    <slot></slot>
  </div>
</template>

<script>
import { ref, onErrorCaptured, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import NavBar from '@/components/common/NavBar'

export default {
  name: 'Layout',
  components: {
    NavBar
  },
  setup () {
    const error = ref(null)
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    const breadcrumbs = route.meta.breadcrumbs

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

    onBeforeMount(() => {
      window.onunhandledrejection = ({ reason }) => {
        errorHandler(reason)
      }
    })
    onErrorCaptured(errorHandler)
    return {
      error,
      breadcrumbs
    }
  }
}
</script>

<style scoped>
.navbar ~ .alert {
  margin-top: 3em;
}

.navbar ~ .container-fluid {
  padding-top: 4em;
}

.navbar ~ .alert ~ .container-fluid {
  padding-top: 8em;
}
</style>
