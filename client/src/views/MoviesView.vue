<script setup lang="ts">
import { getMoviesByPage, type Movie } from '@/services/api'
import { ref, type Ref } from 'vue'

const search = ref('')
const start: 'start' = 'start'
const headers = [
  {
    align: start,
    key: '_id',
    sortable: false,
    title: 'ID',
  },
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

getMoviesByPage(page.value).then((res) => {
  if (!res) {
    console.error('Error loading page')
    return
  }
  movies.value = res
})

function searchFilter(value: string | null, query: string | null) {
  return (
    value != null &&
    query != null &&
    typeof value === 'string' &&
    value.toString().indexOf(query) !== -1
  )
}

function onClickGetPage() {
  getMoviesByPage(page.value).then((res) => {
    if (!res) {
      console.error('Error loading page')
      return
    }
    movies.value = res
  })
}
</script>

<template>
  <!-- <h1>This is the movies page</h1> -->
  <v-btn @click="onClickGetPage">Click me</v-btn>

  <v-card title="Movies" flat>
    <v-data-table
      :headers="headers"
      :items="movies"
      :search="search"
      :custom-filter="searchFilter"
      :items-per-page="itemsPerPage"
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

      <template v-slot:item.poster="{ item }">
        <v-card class="my-2" elevation="1" rounded>
          <v-img :src="`${item.poster}`" height="64" cover></v-img>
        </v-card>
      </template>
    </v-data-table>
  </v-card>
</template>
