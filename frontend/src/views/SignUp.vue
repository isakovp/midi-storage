<template>
    <div class="row justify-content-center mt-5 pt-5">
      <div class="col-xxl-3 col-xl-4 3 col-lg-4 col-md-6 col-12">
        <h1>Sign Up</h1>
        <form @submit.prevent="handleSubmit" class="has-validation" :disabled="true">
          <div class="mb-3">
            <label for="inputEmail" class="form-label">Email</label>
            <input type="email" :class="errors.email ? 'form-control is-invalid' : 'form-control'" id="inputEmail"
                   v-model="username" :disabled="disabled" >
            <div class="invalid-feedback" v-if="errors.email">
              {{errors.email.join(', ')}}
            </div>
          </div>
          <div class="mb-3">
            <label for="inputName" class="form-label">Name</label>
            <input type="text" :class="errors.name ? 'form-control is-invalid' : 'form-control'" id="inputName"
                   v-model="name" :disabled="disabled" >
            <div class="invalid-feedback" v-if="errors.name">
              {{errors.name.join(', ')}}
            </div>
          </div>
          <div class="mb-3">
            <label for="inputPassword" class="form-label">Password</label>
            <div class="input-group has-validation">
              <input type="password" :class="errors.password ? 'form-control is-invalid' : 'form-control'" id="inputPassword"
                     v-model="password" :disabled="disabled" >
              <div class="invalid-feedback" v-if="errors.password">
                {{errors.password.join(', ')}}
              </div>
            </div>
          </div>
          <div class="d-grid gap-2">
            <button type="submit" class="btn btn-primary btn-block" :disabled="disabled">Sign Up</button>
            <router-link :to="{name: 'SignIn'}" class="btn btn-link">Sign In</router-link>
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
    const name = ref(null)
    const password = ref(null)
    const disabled = ref(false)
    const errors = ref({})

    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const redirect = route.query.redirect || { name: 'Home' }

    const handleSubmit = async () => {
      errors.value = {}
      disabled.value = true
      try {
        const { data } = await AuthenticationApi.signUp(username.value, name.value, password.value)
        store.commit('user/changeToken', data.token)
        await router.replace(redirect)
      } catch (error) {
        if (error.response) {
          errors.value = error.response.data
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
      name,
      password,
      errors,
      disabled,
      handleSubmit
    }
  }
}
</script>

<style scoped>

</style>
