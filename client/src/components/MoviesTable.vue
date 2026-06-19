<script setup lang="ts">
import { getAllMovies, type Movie } from '@/services/api'
import { onMounted, ref, type Ref } from 'vue'
import { VCard } from 'vuetify/components'
import TruncatedField from './TruncatedField.vue'

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

// Search the data table by the title.
function searchFilter(value: string | null, query: string | null) {
  return (
    value != null &&
    query != null &&
    typeof value === 'string' &&
    value.toString().indexOf(query) !== -1
  )
}
</script>

<template>
  <v-card title="Movies" flat data-testid="title">
    <v-data-table
      :headers="headers"
      :items="movies"
      :search="search"
      :custom-filter="searchFilter"
      :loading="isLoading"
      loading-text="Loading Movies"
      sort-asc-icon="mdi-sort-ascending"
      sort-desc-icon="mdi-sort-descending"
      sort-icon="mdi-swap-vertical"
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

      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.title="{ item }">
        <!-- Account for very long titles -->
        <TruncatedField :text="item.title" width="300"></TruncatedField>
      </template>

      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.rated="{ item }">
        <v-card flat>
          <!-- Account for "APPROVED" ratings being wide -->
          <v-card-text style="width: 110px">{{ item.rated }}</v-card-text>
        </v-card>
      </template>

      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.genres="{ item }">
        <!-- Account for the genre lists being long -->
        <TruncatedField :text="item.genres" width="200"></TruncatedField>
      </template>

      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.poster="{ item }">
        <v-card class="my-2" elevation="1" rounded>
          <v-img :src="`${item.poster}`" height="64" cover></v-img>
        </v-card>
      </template>
    </v-data-table>
  </v-card>
</template>
