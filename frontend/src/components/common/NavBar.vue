<template>
  <nav class="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link :to="{name: 'Home', params: {filter: 'newest'}}" class="navbar-brand">MIDI Storage</router-link>
      <div class="" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        </ul>
        <div class="d-flex">
          <div class="btn-group" v-if="authenticated">
            <button class="btn btn-outline-primary dropdown-toggle" type="button" id="dropdownMenuButton1"
                    data-bs-toggle="dropdown" aria-expanded="false">
              <i class="bi-person-fill"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton1">
              <li><span class="dropdown-header">{{ name }}</span></li>
              <li>
                <router-link :to="{name: 'Profile'}" class="dropdown-item">Profile</router-link>
              </li>
              <li><a class="dropdown-item" href="#">Favorites</a></li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li><a class="dropdown-item" href="#" @click.prevent="signOut">Sign Out</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'NavBar',
  setup () {
    const store = useStore()

    const name = computed(() => {
      return store.state.user.me ? store.state.user.me.name : ''
    })
    const email = computed(() => {
      return store.state.user.me ? store.state.user.me.email : ''
    })
    const authenticated = computed(() => {
      return store.state.user.authenticated
    })

    const signOut = () => {
      store.commit('user/changeToken', null)
    }

    return {
      name,
      email,
      authenticated,
      signOut
    }
  }
}
</script>
