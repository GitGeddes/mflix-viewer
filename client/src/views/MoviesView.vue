<script setup lang="ts">
import { getAllMovies, getMoviesByPage, type Movie } from '@/services/api'
import { ref, type Ref } from 'vue'
import { VCard } from 'vuetify/components'

const search = ref('')
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
const page = ref(1)
const itemsPerPage = ref(10)

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

// Get the next page of movies.
function onClickGetPage() {
  getPage(page.value + 1)
}

// Get the current or a given page of movies and update the page number.
function getPage(pageNum: number = page.value) {
  getMoviesByPage(pageNum).then((res) => {
    if (!res) {
      console.error('Error loading page')
      return
    }
    movies.value = res
  })
  page.value = pageNum
}
</script>

<template>
  <main>
    <v-btn @click="onClickGetPage">Get Next Page</v-btn>

    <v-card title="Movies" flat>
      <v-data-table
        :headers="headers"
        :items="movies"
        :search="search"
        :custom-filter="searchFilter"
        :items-per-page="itemsPerPage"
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
        <template v-slot:item.poster="{ item }">
          <v-card class="my-2" elevation="1" rounded>
            <v-img :src="`${item.poster}`" height="64" cover></v-img>
          </v-card>
        </template>

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template v-slot:item.title="{ item }">
          <v-card flat>
            <v-card-text class="text-truncate" style="width: 300px">{{ item.title }}</v-card-text>
          </v-card>
        </template>

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template v-slot:item.genres="{ item }">
          <v-card class="max-h-[64px]" flat>
            <v-card-text class="text-truncate" style="max-width: 200px">{{
              item.genres
            }}</v-card-text>
          </v-card>
        </template>
      </v-data-table>
    </v-card>
  </main>
</template>
