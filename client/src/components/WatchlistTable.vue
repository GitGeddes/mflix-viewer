<script setup lang="ts">
import { getWatchlist, postAddToWatchlist, postFetchMovies, type Movie } from '@/services/api'
import { onMounted, ref, type Ref } from 'vue'
import { VCard } from 'vuetify/components'
import TruncatedField from './TruncatedField.vue'
import PosterImage from './PosterImage.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Search query
const search = ref('')
// Headers for the data table
const headers = [
  { key: 'title', title: 'Title' },
  { key: 'year', title: 'Year' },
  { key: 'runtime', title: 'Runtime' },
  { key: 'rated', title: 'Rated' },
  { key: 'type', title: 'Type' },
  { key: 'genres', title: 'Genres' },
  { key: 'imdb.rating', title: 'IMDB Rating' },
  { key: 'poster', title: 'Poster' },
]

const movies: Ref<Movie[]> = ref([])

// Show the loading text in the data table.
const isLoading = ref(true)

// Initialize movies table on load
onMounted(() => {
  fetchWatchlist()
})

// Get all of the movies and update the data table.
function fetchWatchlist() {
  getWatchlist().then((res) => {
    if (!res) {
      console.error('Error loading movies')
      return
    }
    console.log('result', res)
    if (res.watchlist) {
      movies.value = res.watchlist.movies
    }
    // Reset the loading state
    isLoading.value = false
  })
}

function addToWatchlist() {
  postAddToWatchlist({
    movies: ['573a1390f29313caabcd42e8', '573a1390f29313caabcd446f', '573a1390f29313caabcd4803'],
  }).then((res) => {
    console.log('watchlist result', res)
  })
}

function fetchABunch() {
  postFetchMovies({
    movies: ['573a1390f29313caabcd42e8', '573a1390f29313caabcd446f', '573a1390f29313caabcd4803'],
  }).then((result) => {
    console.log('in watchlist', result)
  })
}

function clickRow(event, row) {
  console.log('row clicked', row.item._id)
  // TODO: Pass the movie as parameters to the individual movie page
  // router.push({ path: '/movies/' + row.item._id, params: row.item })
  router.push('/movies/' + row.item._id)
}
</script>

<template>
  <v-btn @click="fetchWatchlist">Fetch watchlist</v-btn>
  <v-btn @click="fetchABunch">Fetch movies</v-btn>
  <v-btn @click="addToWatchlist">Add movies</v-btn>
  <v-card title="Movies" flat data-testid="title">
    <v-data-table
      :headers="headers"
      :items="movies"
      :search="search"
      :loading="isLoading"
      :filter-keys="['title']"
      @click:row="clickRow"
      loading-text="Loading Movies"
    >
      <template v-slot:top>
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
        ></v-text-field>
      </template>

      <template #[`item.title`]="{ item }">
        <!-- Account for very long titles -->
        <TruncatedField :text="item.title" width="300"></TruncatedField>
      </template>

      <template #[`item.rated`]="{ item }">
        <!-- Account for "APPROVED" ratings being very wide -->
        <TruncatedField :text="item.rated" width="110"></TruncatedField>
      </template>

      <template #[`item.genres`]="{ item }">
        <!-- Account for the genre lists being long -->
        <TruncatedField :text="item.genres?.join(', ')" width="200"></TruncatedField>
      </template>

      <template #[`item.poster`]="{ item }">
        <PosterImage :poster="item.poster"></PosterImage>
      </template>
    </v-data-table>
  </v-card>
</template>
