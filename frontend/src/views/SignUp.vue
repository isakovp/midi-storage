<template>
    <div class="row justify-content-center mt-5 pt-5">
      <div class="col-xxl-3 col-xl-4 3 col-lg-4 col-md-6 col-12">
        <h1>Sign Up</h1>
        <form :disabled="true" class="has-validation" @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label class="form-label" for="inputEmail">Email</label>
            <input id="inputEmail" v-model="username" :class="errors.email ? 'form-control is-invalid' : 'form-control'"
                   :disabled="disabled" type="email" >
            <div v-if="errors.email" class="invalid-feedback">
              {{errors.email.join(', ')}}
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label" for="inputName">Name</label>
            <input id="inputName" v-model="name" :class="errors.name ? 'form-control is-invalid' : 'form-control'"
                   :disabled="disabled" type="text" >
            <div v-if="errors.name" class="invalid-feedback">
              {{errors.name.join(', ')}}
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label" for="inputPassword">Password</label>
            <div class="input-group has-validation">
              <input id="inputPassword" v-model="password" :class="errors.password ? 'form-control is-invalid' : 'form-control'"
                     :disabled="disabled" type="password" >
              <div v-if="errors.password" class="invalid-feedback">
                {{errors.password.join(', ')}}
              </div>
            </div>
          </div>
          <div class="d-grid gap-2">
            <button :disabled="disabled" class="btn btn-primary btn-block" type="submit">Sign Up</button>
            <router-link :to="{name: 'SignIn'}" class="btn btn-link">Sign In</router-link>
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
