<template>
    <div class="row justify-content-center mt-5">
      <div class="col-xxl-3 col-xl-4 3 col-lg-4 col-md-6 col-12">
        <h1>Sign In</h1>
        <form @submit.prevent="handleSubmit" class="has-validation" :disabled="true">
          <div class="mb-3">
            <label for="inputEmail" class="form-label">Email</label>
            <input type="email" :class="error ? 'form-control is-invalid' : 'form-control'" id="inputEmail"
                   v-model="username" :disabled="disabled">
          </div>
          <div class="mb-3">
            <label for="inputPassword" class="form-label">Password</label>
            <div class="input-group has-validation">
              <input type="password" :class="error ? 'form-control is-invalid' : 'form-control'" id="inputPassword"
                     v-model="password" :disabled="disabled">
              <div class="invalid-feedback">
                Invalid username or password
              </div>
            </div>
          </div>
          <div class="d-grid gap-2">
            <button type="submit" class="btn btn-primary btn-block" :disabled="disabled">Sign In</button>
          </div>
        </form>
      </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import AuthenticationApi from '@/api/AuthenticationApi'

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
