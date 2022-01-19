<template>
  <div class="row row-cols-1 row-cols-md-3 g-4" v-if="topFiles" ref="scrollComponent">
    <div class="col" v-for="file in topFiles.files" :key="file.id">
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">
            <router-link :to="{name: 'File', params: { id: file.id }}">{{ file.name }}</router-link>
          </h5>
          <p class="card-text">{{ file.description }}</p>
        </div>
        <div class="card-footer">
          <small class="text-muted">Uploaded {{ $timeAgo.format(new Date(file.created_at)) }}</small>
          <small class="text-muted float-end">
            <i class="bi-eye"></i>
            {{ file.views.toLocaleString() }}
          </small>
          <small class="text-muted float-end me-1">
            <i class="bi-bookmark"></i>
            {{ file.favorites.toLocaleString() }}
          </small>
        </div>
      </div>
    </div>
  </div>
  <div class="row my-2" v-if="loading">
    <div class="col">
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'CardView',
  props: {
    topFiles: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    }
  },
  emits: ['loadmore', 'select'],
  setup (props, { emit }) {
    const scrollComponent = ref(null)

    const handleScroll = () => {
      if (scrollComponent.value.getBoundingClientRect().bottom <= window.innerHeight) {
        emit('loadmore')
      }
    }

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      scrollComponent,
      handleScroll
    }
  }
}
</script>

<style scoped>

</style>
