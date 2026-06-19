<script setup lang="ts">
import { getAllMovies, type Movie } from '@/services/api'
import { ref, type Ref } from 'vue'
import { VCard } from 'vuetify/components'

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
getMovies()
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

      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.title="{ item }">
        <v-card flat>
          <!-- Account for very long titles -->
          <v-card-text class="text-truncate" style="width: 300px">{{ item.title }}</v-card-text>
        </v-card>
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
        <v-card flat>
          <!-- Account for the genre lists being long -->
          <v-card-text class="text-truncate" style="max-width: 200px">{{
            item.genres
          }}</v-card-text>
        </v-card>
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
