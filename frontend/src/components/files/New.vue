<template>
  <button type="button" class="btn btn-danger" data-bs-toggle="modal"
          data-bs-target="#newFileModal">
    Upload file
  </button>

  <!-- Modal -->
  <teleport to="body">
    <div class="modal fade" id="newFileModal" ref="newFileModal" tabindex="-1" data-bs-backdrop="static"
         data-bs-keyboard="false" aria-labelledby="newFileModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="newFileModalLabel">Upload file</h5>
            <button type="button" class="btn-close" @click="handleClose" :disabled="uploading" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="form" ref="form" @submit.prevent="handleFileUpload" :disabled="uploading">
              <div class="mb-3">
                <label for="name" class="form-label">File name</label>
                <input type="text" :class="errors.name ? 'form-control is-invalid' : 'form-control'" id="name" v-model="fileName" :disabled="uploading" required>
                <div class="invalid-feedback" v-if="errors.name">
                  {{errors.name.join(', ')}}
                </div>
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">File description</label>
                <textarea :class="errors.description ? 'form-control is-invalid' : 'form-control'" id="description" rows="5" v-model="fileDescription" :disabled="uploading" required></textarea>
                <div class="invalid-feedback" v-if="errors.description">
                  {{errors.description.join(', ')}}
                </div>
              </div>
              <div class="mb-3">
                <label for="file" class="form-label">MIDI File</label>
                <input type="file" :class="errors.filename ? 'form-control is-invalid' : 'form-control'" id="file" ref="upload" @change="handleFileChange" :disabled="uploading" accept=".mid" required>
                <div class="invalid-feedback" v-if="errors.filename">
                  {{errors.filename.join(', ')}}
                </div>
              </div>
              <div class="mb-3">
                <div class="progress">
                  <div class="progress-bar" role="progressbar" :style="'width: ' + progress + '%'">{{progress}}%</div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="handleClose" :disabled="uploading">Close</button>
            <button type="submit" class="btn btn-primary" form="form" :disabled="uploading">Upload</button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import { ref } from 'vue'
import FilesApi from '@/api/FilesApi'
import { Modal } from 'bootstrap'
import { useRouter } from 'vue-router'

export default {
  name: 'New',
  setup () {
    const fileName = ref('')
    const fileDescription = ref('')
    const fileIO = ref(null)
    const errors = ref({})
    const upload = ref(null)
    const progress = ref(0)
    const newFileModal = ref(null)
    const form = ref(null)
    const uploading = ref(false)
    const router = useRouter()

    const handleFileChange = () => {
      fileIO.value = upload.value.files[0]
      if (!fileName.value) {
        fileName.value = upload.value.files[0].name
      }
    }

    const handleFileUpload = async () => {
      uploading.value = true
      progress.value = 0
      try {
        const { data } = await FilesApi.create(fileName.value, fileDescription.value, fileIO.value, (event) => {
          progress.value = Math.round(event.loaded * 100 / event.total * 0.98)
        })
        progress.value = 100
        handleClose()
        router.push({
          name: 'File',
          params: { id: data.id }
        })
      } catch (error) {
        progress.value = 0
        if (error.response) {
          errors.value = error.response.data
        } else {
          throw error
        }
      } finally {
        uploading.value = false
      }
    }

    const handleClose = () => {
      Modal.getOrCreateInstance(newFileModal.value).hide()
      errors.value = {}
      fileName.value = ''
      fileDescription.value = ''
      fileIO.value = null
      upload.value = null
      progress.value = 0
      form.value.reset()
    }

    return {
      fileName,
      fileDescription,
      fileIO,
      errors,
      upload,
      progress,
      form,
      newFileModal,
      uploading,
      handleFileChange,
      handleFileUpload,
      handleClose
    }
  }
}
</script>
