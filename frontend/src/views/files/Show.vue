<template>
  <div class="row">
    <div class="col">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link :to="{name: 'Home', params: {filter: 'newest'}}">Home</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">{{ file ? file.name : 'File info' }}</li>
        </ol>
      </nav>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <div id="boo"></div>
    </div>
  </div>
  <div class="row">
    <div class="col" v-if="!file && !loading">
      <h1>File not found</h1>
    </div>
  </div>
  <div class="row justify-content-center">
    <div class="col-md-10 col-11 text-center" v-if="file">
      <figure>
        <blockquote class="blockquote">
          <h1 class="header">
            {{ file.name }}
            <small class="text-muted">
              <i class="bi-eye"></i> {{ file.views }}
            </small>
          </h1>
        </blockquote>
        <p>
          Uploaded by: {{ file.createdBy.name }}
        </p>
        <figcaption class="blockquote-footer">
          {{ file.description }}
        </figcaption>
      </figure>
    </div>
  </div>
  <AbcNotation :abc="file.abc" v-if="file"/>
</template>

<script>

import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import AbcNotation from '@/components/common/AbcNotation'
import FilesApi from '@/api/FilesApi'

export default {
  name: 'Show',
  components: {
    AbcNotation
  },
  setup () {
    const file = ref(null)
    const loading = ref(false)
    const route = useRoute()
    const fileId = computed(() => {
      return route.params.id
    })

    const getFile = async function () {
      try {
        loading.value = true
        const response = await FilesApi.get(fileId.value)
        file.value = response.data
        document.title = `${file.value.name} - MIDI Storage`
      } catch (e) {
        if (e.response && e.response.status === 404) {
          file.value = null
        } else {
          throw e
        }
      } finally {
        loading.value = false
      }
    }

    getFile()

    return {
      file,
      loading
    }
  }
}
</script>
<style scoped>
small {
  font-size: 0.5em;
  vertical-align: middle;
}
</style>
