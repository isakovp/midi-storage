<template>
  <layout>
    <FilesCardView v-if="topFiles" :loading="topFilesLoading" :top-files="topFiles" @loadmore="loadMore"/>
  </layout>
</template>

<script>
import Layout from '@/components/common/Layout'
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import FilesCardView from '@/components/files/CardView'
import FilesApi from '@/api/FilesApi'

export default {
  name: 'Home',
  components: {
    Layout,
    FilesCardView
  },
  setup () {
    const router = useRouter()
    const route = useRoute()
    const page = ref(0)
    const topFiles = ref({})
    const topFilesLoading = ref(false)
    const filter = computed(() => {
      return route.params.filter
    })

    const appendFiles = async (p) => {
      topFilesLoading.value = true
      const response = await FilesApi.getTopFiles(p, 100, filter.value)
      const data = response.data
      if (data.files) {
        topFiles.value = {
          meta: data.meta,
          files: (topFiles.value.files || []).concat(data.files)
        }
        page.value = p
      }
      topFilesLoading.value = false
    }
    const loadMore = () => {
      if (topFiles.value.meta.nasNext && !topFilesLoading.value) {
        appendFiles(page.value + 1)
      }
    }

    onMounted(() => {
      appendFiles(0)
    })

    if (!filter.value) {
      router.push({ name: 'Home', params: { filter: 'newest' } })
    }

    watch([filter, route], () => {
      topFiles.value = {}
      appendFiles(0)
    })

    return {
      page,
      loadMore,
      topFiles,
      topFilesLoading,
      filter
    }
  }
}
</script>
