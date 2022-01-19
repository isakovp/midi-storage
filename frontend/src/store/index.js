import { createStore } from 'vuex'
import AuthenticationApi from '@/api/AuthenticationApi'

const token = localStorage.getItem('token')
const authenticated = !!token

const user = {
  namespaced: true,
  state: {
    authenticated: authenticated,
    token: token,
    me: null
  },
  mutations: {
    changeToken (state, token) {
      state.token = token
      state.authenticated = !!token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },
    setMe (state, me) {
      state.me = me
    }
  },
  actions: {
    async updateMe (context) {
      const { data } = await AuthenticationApi.me()
      context.commit('setMe', data)
    }
  }
}

export default createStore({
  modules: {
    user
  }
})
