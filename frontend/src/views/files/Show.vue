<template>
  <div class="row">
    <div class="col" v-if="!file">
      <h1>File not found</h1>
    </div>
  </div>
  <div class="row justify-content-center">
    <div class="col-md-10 col-11 text-center" v-if="file">
      <figure>
        <blockquote class="blockquote">
          <h1 class="header">{{ file.name }}</h1>
          <small class="views">
            <i class="bi-eye"></i> {{ file.views }}
          </small>
        </blockquote>
        <figcaption class="blockquote-footer">
          {{ file.description }}
        </figcaption>
      </figure>
    </div>
  </div>
  <div class="row justify-content-center">
    <div class="col-md-10 col-11" v-if="file">
      <midi-player
        ref="player"
        :src="file.url"
        sound-font
        :visualizer="'#player-' + file.id">
      </midi-player>
      <midi-visualizer type="staff" :id="'player-' + file.id" :src="file.url"></midi-visualizer>
    </div>
  </div>
</template>

<script>

import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import FilesApi from '@/api/FilesApi'

export default {
  name: 'Show',
  setup () {
    const file = ref({})
    const player = ref(null)
    const panel = ref(null)
    const route = useRoute()
    const fileId = computed(() => {
      return route.params.id
    })

    const getFile = async function () {
      try {
        const response = await FilesApi.get(fileId.value)
        file.value = response.data
      } catch (e) {
        if (e.response && e.response.status === 404) {
          file.value = null
        } else {
          throw e
        }
      }
    }

    watch(route, () => {
      player.value.stop()
    })

    getFile()

    return {
      file,
      panel,
      player
    }
  }
}
</script>

<style scoped>
.header:after {
  content: "123"
}
</style>
