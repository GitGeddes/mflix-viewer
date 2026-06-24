<script setup lang="ts">
import {
  getAllMovies,
  getDistinctGenres,
  getDistinctRateds,
  getImdbRatingRange,
  getRuntimeRange,
  getYearRange,
  type Movie,
} from '@/services/api'
import { onMounted, ref, type Ref } from 'vue'
import { VCard } from 'vuetify/components'
import TruncatedField from './TruncatedField.vue'
import PosterImage from './PosterImage.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Search query
const search = ref('')
// Year slider
const yearFilter = ref([0, 0])
const yearFilterOptions = ref([0, 0])
// Runtime slider
const runtimeFilter = ref([0, 0])
const runtimeFilterOptions = ref([0, 0])
// Rated array
const ratedFilter: Ref<string[]> = ref([])
const ratedFilterOptions: Ref<string[]> = ref([])
// Genre array
const genreFilter: Ref<string[]> = ref([])
const genreFilterOptions: Ref<string[]> = ref([])
// IMDB rating slider
const imdbFilter = ref([0, 0])
const imdbFilterOptions = ref([0, 0])

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
  getMovies()
})

onMounted(() => {
  // Populate all filter fields
  getYears()
  getAllRateds()
  getRuntimes()
  getIMDBRange()
  getAllGenres()
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

function searchFilter(value: string, query: string, item) {
  const genreIntersection = genreFilter.value.filter((el) => item.genres.includes(el)).length > 0
  return value.indexOf(query) !== -1 && genreIntersection
}

async function getYears() {
  const result = await getYearRange()
  if (result) {
    yearFilterOptions.value = [result.minYear, result.maxYear]
    yearFilter.value = yearFilterOptions.value
  }
}

async function getAllRateds() {
  const result = await getDistinctRateds()
  if (result) {
    ratedFilterOptions.value = result.sort()
  }
}

async function getRuntimes() {
  const result = await getRuntimeRange()
  if (result) {
    runtimeFilterOptions.value = [result.minRuntime, result.maxRuntime]
    runtimeFilter.value = runtimeFilterOptions.value
  }
}

async function getIMDBRange() {
  const result = await getImdbRatingRange()
  console.log('imdb', result)
  if (result) {
    imdbFilterOptions.value = [result.minIMDBRating, result.maxIMDBRating]
    imdbFilter.value = imdbFilterOptions.value
  }
}

async function getAllGenres() {
  const result = await getDistinctGenres()
  if (result) {
    genreFilterOptions.value = result.sort()
  }
}

function clickRow(event, row) {
  console.log('row clicked', row.item._id)
  // TODO: Pass the movie as parameters to the individual movie page
  // router.push({ path: '/movies/' + row.item._id, params: row.item })
  router.push('/movies/' + row.item._id)
}
</script>

<template>
  <!-- Year filter -->
  <v-card-text>
    <h4>Choose Year range</h4>
    <v-range-slider
      v-model="yearFilter"
      :max="yearFilterOptions[1]"
      :min="yearFilterOptions[0]"
      step="1"
      thumb-label="hover"
    ></v-range-slider>
  </v-card-text>
  <!-- Rated filter -->
  <v-card-text>
    <h4>Choose Rated options</h4>
    <v-chip-group v-model="ratedFilter" column multiple>
      <v-chip v-for="rated in ratedFilterOptions" :key="rated" :text="rated"></v-chip>
    </v-chip-group>
  </v-card-text>
  <!-- Runtime filter -->
  <v-card-text>
    <h4>Choose runtime range</h4>
    <v-range-slider
      v-model="runtimeFilter"
      :max="runtimeFilterOptions[1]"
      :min="runtimeFilterOptions[0]"
      step="1"
      thumb-label="hover"
    ></v-range-slider>
  </v-card-text>
  <!-- Genre filters -->
  <v-card-text>
    <h4>Choose genres</h4>
    <v-chip-group v-model="genreFilter" column multiple>
      <v-chip v-for="genre in genreFilterOptions" :key="genre" :text="genre"></v-chip>
    </v-chip-group>
  </v-card-text>
  <!-- IMDB Rating filter -->
  <v-card-text>
    <h4>Choose IMDB Rating range</h4>
    <v-range-slider
      v-model="imdbFilter"
      :max="imdbFilterOptions[1]"
      :min="imdbFilterOptions[0]"
      step="0.1"
      thumb-label="hover"
    ></v-range-slider>
  </v-card-text>
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
        <TruncatedField :text="item.genres?.join(', ')" width="200"></TruncatedField>
      </template>

      <template #[`item.poster`]="{ item }">
        <PosterImage :poster="item.poster"></PosterImage>
      </template>
    </v-data-table>
  </v-card>
</template>
