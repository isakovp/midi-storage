<template>
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
          Uploaded by: {{file.createdBy.name}}
        </p>
        <figcaption class="blockquote-footer">
          {{ file.description }}
        </figcaption>
      </figure>
    </div>
  </div>
  <div class="row justify-content-center">
    <div class="col-md-10 col-11">
      <midi-player
        ref="player"
        sound-font>
      </midi-player>
      <midi-visualizer
        ref="visualizer"
        type="staff">
      </midi-visualizer>
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
    const file = ref(null)
    const player = ref(null)
    const visualizer = ref(null)
    const panel = ref(null)
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
        if (player.value) {
          player.value.src = response.data.url
          player.value.addVisualizer(visualizer.value)
          visualizer.value.src = response.data.url
          visualizer.value.config = {
            noteHeight: 15,
            pixelsPerTimeStep: 150,
            minPitch: 1300,
            noteRGB: '44,119,246,1',
            activeNoteRGB: '203,56,55,1',
            scrollType: 1
          }
        }
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

    watch(route, () => {
      player.value.stop()
    })

    getFile()

    const getTitle = () => {
      return file.value.name
    }

    return {
      file,
      panel,
      player,
      visualizer,
      loading,
      getTitle
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
