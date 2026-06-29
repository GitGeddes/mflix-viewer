<script setup lang="ts">
import { getAllAggregates, getAllMovies, type Movie } from '@/services/api'
import { computed, onMounted, ref, type Ref } from 'vue'
import { VCard } from 'vuetify/components'
import TruncatedField from './TruncatedField.vue'
import PosterImage from './PosterImage.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Search query
const search = ref('')

//#region Filters
// Filter enable/disable toggles
const enableYearFilter = ref(false)
const enableRuntimeFilter = ref(false)
const enableRatedFilter = ref(false)
const enableGenreFilter = ref(false)
const enableIMDBFilter = ref(false)

// Year slider
const yearFilter: Ref<[number, number]> = ref([0, 0])
const yearFilterOptions: Ref<[number, number]> = ref([0, 0])
// Runtime slider
const runtimeFilter: Ref<[number, number]> = ref([0, 0])
const runtimeFilterOptions: Ref<[number, number]> = ref([0, 0])
// Rated array
const ratedFilter: Ref<number[]> = ref([])
const ratedFilterOptions: Ref<string[]> = ref([])
// Genre array
const genreFilter: Ref<number[]> = ref([])
const genreFilterOptions: Ref<string[]> = ref([])
// IMDB rating slider
const imdbFilter: Ref<[number, number]> = ref([0, 0])
const imdbFilterOptions: Ref<[number, number]> = ref([0, 0])
//#endregion Filters

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

function boolToString(bool: boolean) {
  if (bool) return 'true'
  else return ''
}

const filterChanged = computed(() => {
  return (
    search.value +
    boolToString(enableGenreFilter.value) +
    boolToString(enableIMDBFilter.value) +
    boolToString(enableRatedFilter.value) +
    boolToString(enableRuntimeFilter.value) +
    boolToString(enableYearFilter.value)
  )
})

// Show the loading text in the data table.
const isLoading = ref(true)

// Initialize movies table on load
onMounted(() => {
  getMovies()
})

// Populate all filter fields
onMounted(() => {
  getAggregates()
})

async function getAggregates() {
  const result = await getAllAggregates()
  if (result) {
    const { yearsAggregate, runtimeAggregate, ratedAggregate, genreAggregate, imdbAggregate } =
      result

    yearFilterOptions.value = [yearsAggregate.minYear, yearsAggregate.maxYear]
    yearFilter.value = yearFilterOptions.value

    runtimeFilterOptions.value = [runtimeAggregate.minRuntime, runtimeAggregate.maxRuntime]
    runtimeFilter.value = runtimeFilterOptions.value

    ratedFilterOptions.value = ratedAggregate.sort()

    genreFilterOptions.value = genreAggregate.sort()

    // Some entries don't parse correctly into a number, force the range to be 0-10
    // imdbFilterOptions.value = [result.minIMDBRating, result.maxIMDBRating]
    imdbFilterOptions.value = [0, 10]
    imdbFilter.value = imdbFilterOptions.value
  }
}

// Column filter functions written by AI
// Custom filter functions for each column
function yearColumnFilter(item: Movie): boolean {
  if (!enableYearFilter.value) return true // Skip filter if disabled

  const itemYear = parseInt(item.year?.toString() || '0', 10)
  return itemYear >= yearFilter.value[0] && itemYear <= yearFilter.value[1]
}

function runtimeColumnFilter(item: Movie): boolean {
  if (!enableRuntimeFilter.value) return true

  const itemRuntime = parseInt(item.runtime?.toString() || '0', 10)
  return itemRuntime >= runtimeFilter.value[0] && itemRuntime <= runtimeFilter.value[1]
}

function ratedColumnFilter(item: Movie, rateds: string[]): boolean {
  if (!enableRatedFilter.value) return true

  // Check if the item's rated value is in the enabled ratings list
  const itemRated = item.rated?.toString() || ''
  return rateds.includes(itemRated)
}

function genreColumnFilter(item: Movie, genres: string[]): boolean {
  if (!enableGenreFilter.value) return true

  // Check if any of the item's genres are in the enabled genres list
  const itemGenres = item.genres || []

  return genres.every((genre: string) => itemGenres.some((g) => g.includes(genre)))
}

function imdbColumnFilter(item: Movie): boolean {
  if (!enableIMDBFilter.value) return true

  const imdbRating = parseFloat(item['imdb.rating'].toString() || '0')
  return imdbRating >= imdbFilter.value[0] && imdbRating <= imdbFilter.value[1]
}

function customFilter(item: Movie): boolean {
  const namedGenres = genreFilterOptions.value.filter((val, index) =>
    genreFilter.value.includes(index),
  )
  const namedRateds = ratedFilterOptions.value.filter((val, index) =>
    ratedFilter.value.includes(index),
  )

  return (
    yearColumnFilter(item) &&
    runtimeColumnFilter(item) &&
    ratedColumnFilter(item, namedRateds) &&
    genreColumnFilter(item, namedGenres) &&
    imdbColumnFilter(item)
  )
}

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
  const tempValue = search.value
  if (!tempValue || tempValue.trim() === '') return customFilter(item.columns)

  return (
    value != null &&
    tempValue != null &&
    typeof value === 'string' &&
    value.indexOf(tempValue) !== -1 &&
    customFilter(item.columns)
  )
}

function clickRow(event, row) {
  console.log('row clicked', row.item._id)
  // TODO: Pass the movie as parameters to the individual movie page
  // router.push({ path: '/movies/' + row.item._id, params: row.item })
  router.push('/movies/' + row.item._id)
}
</script>

<template>
  <v-row>
    <!-- Year filter -->
    <v-col cols="4" class="px-4">
      <h4>Choose Year range</h4>
      <v-range-slider
        v-model="yearFilter"
        :max="yearFilterOptions[1]"
        :min="yearFilterOptions[0]"
        step="1"
        thumb-label="hover"
      ></v-range-slider>
    </v-col>
    <!-- Runtime filter -->
    <v-col cols="4" class="px-4">
      <h4>Choose runtime range</h4>
      <v-range-slider
        v-model="runtimeFilter"
        :max="runtimeFilterOptions[1]"
        :min="runtimeFilterOptions[0]"
        step="1"
        thumb-label="hover"
      ></v-range-slider>
    </v-col>
    <!-- IMDB Rating filter -->
    <v-col cols="4" class="px-4">
      <h4>Choose IMDB Rating range</h4>
      <v-range-slider
        v-model="imdbFilter"
        :max="imdbFilterOptions[1]"
        :min="imdbFilterOptions[0]"
        step="0.1"
        thumb-label="hover"
      ></v-range-slider>
    </v-col>
  </v-row>
  <!-- Rated filter -->
  <v-card>
    <h4>Choose Rated options</h4>
    <v-chip-group v-model="ratedFilter" column multiple>
      <v-chip v-for="rated in ratedFilterOptions" :key="rated" :text="rated" filter></v-chip>
    </v-chip-group>
  </v-card>
  <!-- Genre filters -->
  <v-card>
    <h4>Choose genres</h4>
    <v-chip-group v-model="genreFilter" column multiple>
      <v-chip v-for="genre in genreFilterOptions" :key="genre" :text="genre" filter></v-chip>
    </v-chip-group>
  </v-card>
  <v-card title="Movies" flat data-testid="title">
    <v-data-table
      :headers="headers"
      :items="movies"
      :search="filterChanged"
      :loading="isLoading"
      :filter-keys="['title']"
      :custom-filter-keys="['year', 'runtime', 'rated', 'genres', 'imdb.rating']"
      :custom-filter="searchFilter"
      @click:row="clickRow"
      loading-text="Loading Movies"
      striped="odd"
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

        <!-- Filter toggle controls (AI) -->
        <div class="mt-4 d-flex gap-4">
          <v-checkbox v-model="enableYearFilter" label="Year Range Filter"></v-checkbox>
          <v-checkbox v-model="enableRuntimeFilter" label="Runtime Range Filter"></v-checkbox>
          <v-checkbox v-model="enableRatedFilter" label="Rated Filter"></v-checkbox>
          <v-checkbox v-model="enableGenreFilter" label="Genre Filter"></v-checkbox>
          <v-checkbox v-model="enableIMDBFilter" label="IMDB Rating Filter"></v-checkbox>
        </div>
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
