<template>
  <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4" v-if="topFiles">
    <div class="col" v-for="file in topFiles.files" :key="file.id">
      <div class="card h-100">
        <div class="card-header">
          <router-link :to="{name: 'File', params: { id: file.id }}">{{ file.name }}</router-link>
        </div>
        <div class="card-body">
          <pre class="card-text">{{ file.description }}</pre>
        </div>
        <div class="card-footer">
          <small class="text-muted">Uploaded {{ $timeAgo.format(new Date(file.createdAt)) }} by {{file.createdBy.name}}</small>
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
export default {
  name: 'CardsView',
  props: {
    topFiles: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style scoped>
  .card-text {
    white-space: pre-wrap;
  }
</style>
