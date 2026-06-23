<script setup lang="ts">
import {
  getAllMovies,
  getDistinctRateds,
  getMaxRuntime,
  getMaxRuntimeByType,
  type Movie,
} from '@/services/api'
import { onMounted, ref, type Ref } from 'vue'
import { VCard } from 'vuetify/components'
import TruncatedField from './TruncatedField.vue'
import PosterImage from './PosterImage.vue'

// Search query
const search = ref('')
// Headers for the data table
const headers = [
  { key: 'title', title: 'Title' },
  { key: 'year', title: 'Year' },
  { key: 'runtime', title: 'Runtime' },
  { key: 'rated', title: 'Rated' },
  { key: 'genres', title: 'Genres' },
  { key: 'imdb.rating', title: 'IMDB Rating' },
  { key: 'poster', title: 'Poster' },
]

const movies: Ref<Movie[]> = ref([])

// Show the loading text in the data table.
const isLoading = ref(true)

// Initialize movies table on load
onMounted(() => {
  getMovies()
})
// Get all of the movies and update the data table.
function getMovies() {
  getAllMovies().then((res) => {
    if (!res) {
      console.error('Error loading movies')
      return
    }
    movies.value = res
    // Reset the loading state
    isLoading.value = false
  })
}

function searchFilter(value: string | null, query: string | null) {
  return (
    value != null &&
    query != null &&
    typeof value === 'string' &&
    value.toString().indexOf(query) !== -1
  )
}

function onClick() {
  getMaxRuntime()
}

function onClickByType() {
  getMaxRuntimeByType()
}

async function onClickDistinct() {
  const thingy = await getDistinctRateds()
  console.log('thingy', thingy)
}
</script>

<template>
  <v-btn @click="onClick">Get Max Runtime</v-btn>
  <v-btn @click="onClickByType">Get Max Runtime by Type</v-btn>
  <v-btn @click="onClickDistinct">Get distinct rateds</v-btn>
  <v-card title="Movies" flat data-testid="title">
    <v-data-table
      :headers="headers"
      :items="movies"
      :search="search"
      :loading="isLoading"
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

      <!-- TODO: Filtering options for each column -->
      <!-- Use min and max for number fields like release year, runtime and IMDB rating -->
      <!-- Use checkboxes of strings for genres -->
      <!-- Maybe use first letter for title? -->

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
        <TruncatedField :text="item.genres" width="200"></TruncatedField>
      </template>

      <template #[`item.poster`]="{ item }">
        <PosterImage :poster="item.poster"></PosterImage>
      </template>
    </v-data-table>
  </v-card>
</template>
