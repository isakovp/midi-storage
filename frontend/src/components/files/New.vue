<template>
  <button class="btn btn-outline-danger" data-bs-target="#newFileModal" data-bs-toggle="modal"
          type="button">
    Upload file
  </button>

  <!-- Modal -->
  <teleport to="body">
    <div id="newFileModal" ref="newFileModal" aria-hidden="true" aria-labelledby="newFileModalLabel" class="modal fade"
         data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 id="newFileModalLabel" class="modal-title">Upload file</h5>
            <button :disabled="uploading" aria-label="Close" class="btn-close" type="button" @click="handleClose"></button>
          </div>
          <div class="modal-body">
            <form id="form" ref="form" :disabled="uploading" @submit.prevent="handleFileUpload">
              <div class="mb-3">
                <label class="form-label" for="name">File name</label>
                <input id="name" v-model="fileName" :class="errors.name ? 'form-control is-invalid' : 'form-control'" :disabled="uploading" required type="text">
                <div v-if="errors.name" class="invalid-feedback">
                  {{errors.name.join(', ')}}
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label" for="description">File description</label>
                <textarea id="description" v-model="fileDescription" :class="errors.description ? 'form-control is-invalid' : 'form-control'" :disabled="uploading" required rows="5"></textarea>
                <div v-if="errors.description" class="invalid-feedback">
                  {{errors.description.join(', ')}}
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label" for="file">MIDI File</label>
                <input id="file" ref="upload" :class="errors.filename ? 'form-control is-invalid' : 'form-control'" :disabled="uploading" accept=".mid" required type="file" @change="handleFileChange">
                <div v-if="errors.filename" class="invalid-feedback">
                  {{errors.filename.join(', ')}}
                </div>
              </div>
              <div class="mb-3">
                <div class="progress">
                  <div :style="'width: ' + progress + '%'" class="progress-bar" role="progressbar">{{progress}}%</div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button :disabled="uploading" class="btn btn-secondary" type="button" @click="handleClose">Close</button>
            <button :disabled="uploading" class="btn btn-primary" form="form" type="submit">Upload</button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import FilesApi from '@/api/FilesApi'
import { Modal } from 'bootstrap'
import { ref } from 'vue'
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
        const name = upload.value.files[0].name
        fileName.value = name.substring(0, name.lastIndexOf('.'))
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
