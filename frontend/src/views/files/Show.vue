<template>
  <div class="row">
    <div class="col">
      <div id="boo"></div>
    </div>
  </div>
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

import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import FilesApi from '@/api/FilesApi'
import Vex from 'vexflow'

export default {
  name: 'Show',
  setup () {
    const file = ref(null)
    const player = ref(null)
    const visualizer = ref(null)
    const panel = ref(null)
    const route = useRoute()
    const fileId = computed(() => {
      return route.params.id
    })

    const getFile = async function () {
      try {
        const response = await FilesApi.get(fileId.value)
        player.value.src = response.data.url
        player.value.addVisualizer(visualizer.value)
        visualizer.value.src = response.data.url
        file.value = response.data
        visualizer.value.config = {
          noteHeight: 15,
          pixelsPerTimeStep: 150,
          minPitch: 1300,
          noteRGB: '44,119,246,1',
          activeNoteRGB: '203,56,55,1',
          scrollType: 1
        }
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

    onMounted(() => {
      const vf = new Vex.Flow.Factory({
        renderer: {
          elementId: 'boo',
          width: 500,
          height: 500
        }
      })

      const score = vf.EasyScore()
      const system = vf.System()

      // system.addStave({
      //   voices: [
      //     score.voice(score.notes('C#5/q, B4, A4, G#4', { stem: 'up' })),
      //     score.voice(score.notes('C#4/h, C#4', { stem: 'down' }))
      //   ]
      // }).addClef('treble').addTimeSignature('4/4')

      system.addStave({
        voices: [
          score.voice(score.notes('C#3/2, D4', { clef: 'bass', stem: 'up' })),
          score.voice(score.notes('C#4/2, D3', { clef: 'bass', stem: 'up' }))
        ]
      }).addClef('bass').addTimeSignature('4/4')

      // system.addConnector()

      vf.draw()
    })

    return {
      file,
      panel,
      player,
      visualizer
    }
  }
}
</script>

<style scoped>
</style>
