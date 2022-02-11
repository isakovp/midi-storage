<template>
  <ol class="list-group list-group-numbered">
    <li class="list-group-item d-flex justify-content-between align-items-start" v-for="file in topFiles.files"
        :key="file.id">
      <div class="ms-2 me-auto">
        <div class="fw-bold">
          <router-link :to="{name: 'File', params: { id: file.id }}">{{ file.name }}</router-link>
        </div>
        <span class="badge rounded-pill bg-light text-dark" title="views">
          <i class="bi-eye"></i>
          {{ file.views.toLocaleString() }}
        </span>
        <span class="badge rounded-pill bg-light text-dark ms-1" title="bookmarks">
          <i class="bi-bookmark"></i>
          {{ file.favorites.toLocaleString() }}
        </span>
      </div>
      <div class="text-end col-3">
        <small class="d-block">
          {{ $timeAgo.format(new Date(file.createdAt)) }}
        </small>
        <small class="d-block">
          by {{ file.createdBy.name }}
        </small>
      </div>
    </li>
  </ol>
</template>

<script>
export default {
  name: 'ListView',
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
  emits: ['loadmore']
}
</script>

<style scoped>

</style>
