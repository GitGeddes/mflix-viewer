<script setup lang="ts">
import TruncatedField from './TruncatedField.vue'
import PosterImage from './PosterImage.vue'
import { useRouter } from 'vue-router'
import useMovies from '@/hooks/useMovies.ts'
import useFilters from '@/hooks/useFilters.ts'
import useGenres from '@/hooks/useGenres.ts'
import type { Movie } from '@/services/api.ts'

const router = useRouter()

const {
  filterChanged,
  search,
  searchFilter,
  genreFilter,
  genreFilterOptions,
  enableGenreFilter,
  imdbFilter,
  imdbFilterOptions,
  enableIMDBFilter,
  ratedFilter,
  ratedFilterOptions,
  enableRatedFilter,
  runtimeFilter,
  runtimeFilterOptions,
  enableRuntimeFilter,
  yearFilter,
  yearFilterOptions,
  enableYearFilter,
} = useFilters()
const { movies, isLoading, addToWatchlist, removeFromWatchlist } = useMovies()

const { favoriteGenres } = useGenres()

// Helper function to check if movie has any favorite genres
function hasFavoriteGenres(movie: Movie): boolean {
  if (!movie.genres) return false
  return movie.genres.some((genre) => favoriteGenres.value.includes(genre))
}

// Headers for the data table
const headers = [
  { key: 'watchlist', title: 'Watchlist' },
  { key: 'title', title: 'Title' },
  { key: 'year', title: 'Year' },
  { key: 'runtime', title: 'Runtime' },
  { key: 'rated', title: 'Rated' },
  { key: 'type', title: 'Type' },
  { key: 'genres', title: 'Genres' },
  { key: 'imdb.rating', title: 'IMDB Rating' },
  { key: 'poster', title: 'Poster' },
]

function clickRow(event, row) {
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

      <!-- Add row class for favorite genres -->
      <template v-slot:item="{ item }">
        <tr :key="`$${item._id}`" :class="[{ 'bg-blue-grey-darken-3': hasFavoriteGenres(item) }]">
          <td>
            <div class="d-flex justify-center" @click.stop="">
              <v-icon
                v-if="item.isWatchlisted"
                color="medium-emphasis"
                icon="mdi-playlist-remove"
                @click="removeFromWatchlist(item._id)"
              ></v-icon>

              <v-icon
                v-else
                color="medium-emphasis"
                icon="mdi-playlist-plus"
                @click="addToWatchlist(item._id)"
              ></v-icon>
            </div>
          </td>
          <td>
            <TruncatedField :text="item.title" width="300"></TruncatedField>
          </td>
          <td>{{ item.year }}</td>
          <td>{{ item.runtime }}</td>
          <td>
            <TruncatedField :text="item.rated" width="110"></TruncatedField>
          </td>
          <td>{{ item.type }}</td>
          <td>
            <TruncatedField :text="item.genres?.join(', ')" width="200"></TruncatedField>
          </td>
          <td>{{ item.imdb.rating }}</td>
          <td>
            <PosterImage :poster="item.poster"></PosterImage>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>
