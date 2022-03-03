<template>
    <div class="row justify-content-center mt-5 pt-5">
      <div class="col-xxl-3 col-xl-4 3 col-lg-4 col-md-6 col-12">
        <h1>Sign In</h1>
        <form :disabled="true" class="has-validation" @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label class="form-label" for="inputEmail">Email</label>
            <input id="inputEmail" v-model="username" :class="error ? 'form-control is-invalid' : 'form-control'"
                   :disabled="disabled" type="email">
          </div>
          <div class="mb-3">
            <label class="form-label" for="inputPassword">Password</label>
            <div class="input-group has-validation">
              <input id="inputPassword" v-model="password" :class="error ? 'form-control is-invalid' : 'form-control'"
                     :disabled="disabled" type="password">
              <div class="invalid-feedback">
                Invalid username or password
              </div>
            </div>
          </div>
          <div class="d-grid gap-2">
            <button :disabled="disabled" class="btn btn-primary btn-block" type="submit">Sign In</button>
            <router-link :to="{name: 'SignUp'}" class="btn btn-link">Sign Up</router-link>
          </div>
        </form>
      </div>
    </div>
</template>

<script>
import AuthenticationApi from '@/api/AuthenticationApi'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'SignIn',
  setup () {
    const username = ref(null)
    const password = ref(null)
    const error = ref(null)
    const disabled = ref(false)

    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const redirect = route.query.redirect || { name: 'Home' }

    const handleSubmit = async () => {
      error.value = null
      disabled.value = true
      try {
        const { data } = await AuthenticationApi.signIn(username.value, password.value)
        store.commit('user/changeToken', data.token)
        await router.replace(redirect)
      } catch (error) {
        if (error.response.status === 401) {
          error.value = true
        } else {
          throw error
        }
      } finally {
        password.value = null
        disabled.value = false
      }
    }

    return {
      username,
      password,
      error,
      disabled,
      handleSubmit
    }
  }
}
</script>

<style scoped>

</style>
