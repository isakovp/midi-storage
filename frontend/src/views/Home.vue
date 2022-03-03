<template>
  <div class="row">
    <div class="col">
      <div class="d-md-flex">
        <div class="sidebar">
          <div class="d-grid gap-2">
            <div class="btn-group-vertical">
              <router-link v-for="(label, key) in navLabels" :key="key"
                           :to="{name: 'Home', params: {filter: key}}" active-class="active"
                           aria-current="page" class="btn btn-outline-primary"
                           exact-active-class="">{{label}}
              </router-link>
            </div>
            <div class="btn-group" role="group">
              <input id="btnList" :checked="viewMode === 'list'" autocomplete="off" class="btn-check" name="options"
                     type="radio" @change="toggleCardView">
              <label class="btn btn-sm btn-outline-primary" for="btnList"><i class="bi bi-card-list"></i></label>
              <input id="btnCards" :checked="viewMode === 'card'" autocomplete="off" class="btn-check" name="btn"
                     type="radio" @change="toggleCardView">
              <label class="btn btn-sm btn-outline-primary" for="btnCards"><i class="bi bi-grid"></i></label>
            </div>
            <NewFile/>
          </div>
        </div>
        <div class="flex-grow-1 ms-md-3 mt-3 mt-md-0">
          <h1 v-if="query">Search result for "{{ query.length > 20 ? `${query.substring(0, 20)}...` : query }}"</h1>
          <FilesCardsView v-if="topFiles && viewMode === 'card'" :loading="topFilesLoading" :top-files="topFiles"/>
          <FilesListView v-if="topFiles && viewMode === 'list'" :loading="topFilesLoading" :top-files="topFiles"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FilesApi from '@/api/FilesApi'
import FilesCardsView from '@/components/files/CardsView'
import FilesListView from '@/components/files/ListView'
import NewFile from '@/components/files/New'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'Home',
  components: {
    FilesCardsView,
    FilesListView,
    NewFile
  },
  setup () {
    const viewMode = ref(localStorage.getItem('viewMode') || 'list')
    const route = useRoute()
    const page = ref(0)
    const topFiles = ref({})
    const topFilesLoading = ref(false)
    const navLabels = ref({
      newest: 'Newest files',
      top: 'Most viewed',
      favs: 'Most favorited'
    })
    const filter = computed(() => {
      return route.params.filter
    })
    const query = computed(() => {
      return route.query.q
    })

    const appendFiles = async (p) => {
      if (query.value) {
        document.title = `Search result for "${query.value.length > 20 ? query.value.substring(0, 20) + '...' : query.value}" - MIDI Storage`
      } else {
        document.title = `${navLabels.value[filter.value]} - MIDI Storage`
      }
      topFilesLoading.value = true
      const response = await FilesApi.getTopFiles(p, 60, filter.value, query.value)
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
      if (topFiles.value && topFiles.value.meta.nasNext && !topFilesLoading.value) {
        appendFiles(page.value + 1)
      }
    }

    onMounted(() => {
      appendFiles(0)
    })

    const handleScroll = () => {
      const bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight
      if (bottomOfWindow) {
        loadMore()
      }
    }

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    watch([filter], () => {
      if (filter.value) {
        topFiles.value = {}
        appendFiles(0)
      }
    })

    const toggleCardView = () => {
      if (viewMode.value === 'card') {
        viewMode.value = 'list'
      } else {
        viewMode.value = 'card'
      }
      localStorage.setItem('viewMode', viewMode.value)
    }

    return {
      navLabels,
      viewMode,
      page,
      topFiles,
      topFilesLoading,
      filter,
      query,
      toggleCardView
    }
  }
}
</script>

<style scoped>
.sidebar {
  min-width: 200px;
}

li:has(> a) {
  background-color: #f00 !important;
}
</style>
