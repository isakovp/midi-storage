<template>
  <div class="row justify-content-center" v-if="parsing">
    <div class="col-auto">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
  <div class="row justify-content-center">
    <div class="col-md-3 col-11 mb-5">
      <div id="controls"></div>
    </div>
  </div>
  <div class="row justify-content-center">
    <div class="col-md-10 col-11 mb-5">
      <div id="abc"></div>
    </div>
  </div>
</template>

<script>
import ABCJS from 'abcjs'
import { watch, onMounted, toRefs, ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'AbcNotation',
  props: {
    abc: String
  },
  setup (props) {
    const { abc } = toRefs(props)
    const route = useRoute()
    const parsing = ref(true)

    const renderNotation = async () => {
      return new Promise((resolve, reject) => {
        setTimeout(async () => {
          const string = abc.value.split('\n').filter(line => !line.startsWith('T:')).join('\n')
          const visualObj = ABCJS.renderAbc('abc', string, {
            viewportHorizontal: true,
            scrollHorizontal: true,
            staffwidth: document.querySelector('#abc').clientWidth - 50,
            add_classes: true,
            scale: 1.5,
            paddingtop: 0
          })

          if (ABCJS.synth.supportsAudio()) {
            const controlOptions = {
              displayProgress: true,
              displayPlay: true,
              displayWarp: false,
              displayLoop: false,
              displayRestart: true
            }

            const CursorControl = function () {
              this.onStart = () => {
                this.clearHighlights()
              }
              this.onFinished = () => {
                this.clearHighlights()
              }
              this.onEvent = (event) => {
                this.clearHighlights()

                for (let i = 0; i < event.elements.length; i++) {
                  const note = event.elements[i]
                  for (let j = 0; j < note.length; j++) {
                    note[j].classList.add('highlight')
                  }
                }
              }

              this.clearHighlights = () => {
                const highlighted = document.querySelectorAll('#abc .highlight')
                for (let k = 0; k < highlighted.length; k++) {
                  highlighted[k].classList.remove('highlight')
                }
              }
            }

            const player = new ABCJS.synth.SynthController()
            await player.setTune(visualObj[0])
            await player.load('#controls', new CursorControl(), controlOptions)

            watch(route, player.destroy)
            resolve()
          } else {
            console.log('audio is not supported on this browser')
            reject(new Error('audio is not supported on this browser'))
          }
          parsing.value = false
        }, 1)
      })
    }

    watch(abc, renderNotation)
    onMounted(renderNotation)

    return {
      parsing
    }
  }
}
</script>

<style>
#abc {
  width: 100%;
}

.abcjs-v0 {
  fill: #2b2b2b;
}

.highlight {
  fill: var(--bs-primary);
}

.abcjs-inline-audio button {
  line-height: initial;
}

.abcjs-inline-audio button svg {
  vertical-align: initial;
}

.abcjs-inner {
  overflow-x: scroll !important;
}
</style>
