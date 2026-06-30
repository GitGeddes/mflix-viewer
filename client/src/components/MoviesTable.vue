<script setup lang="ts">
import { useRouter } from 'vue-router'
import TruncatedField from './TruncatedField.vue'
import PosterImage from './PosterImage.vue'
import useMovies from '@/hooks/useMovies.ts'
import useFilters from '@/hooks/useFilters.ts'
import useGenres from '@/hooks/useGenres.ts'
import { ref } from 'vue'
import type { FullMovie } from '@/services/api.ts'

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
  enablePersonalRatingFilter,
} = useFilters()

const { movies, isLoading, addToWatchlist, removeFromWatchlist, addRating } = useMovies()

const { hasFavoriteGenres } = useGenres()

function sortWatchlists(a: FullMovie, b: FullMovie) {
  if (a.isWatchlisted && !b.isWatchlisted) return -1
  else if (!a.isWatchlisted && b.isWatchlisted) return 1
  else return 0
}

const sortBy = ref([{ key: 'watchlist', order: 'asc' as const, sortRaw: sortWatchlists }])

// Dialog state for filters
const showFilterDialog = ref(false)

function toggleFilters() {
  showFilterDialog.value = !showFilterDialog.value
}

function closeFilterDialog() {
  showFilterDialog.value = false
}

// Headers for the data table
const headers = [
  { key: 'watchlist', title: 'Watchlist', sortRaw: sortWatchlists },
  { key: 'title', title: 'Title' },
  { key: 'year', title: 'Year' },
  { key: 'runtime', title: 'Runtime' },
  { key: 'rated', title: 'Rated' },
  { key: 'type', title: 'Type' },
  { key: 'genres', title: 'Genres' },
  { key: 'imdb.rating', title: 'IMDB Rating' },
  { key: 'poster', title: 'Poster', sortable: false },
  { key: 'rating', title: 'Rating' },
]

// Open the individual movie page whenever the user clicks the row
function clickRow(row: FullMovie) {
  router.push('/movies/' + row._id)
}

// Update the rating when it is changed
function onClickRating(movie: FullMovie) {
  addRating(movie._id, movie.rating ? movie.rating : 0)
}
</script>

<template>
  <v-card>
    <!-- Table -->
    <v-card-title class="font-weight-bold text-h5 my-2">Movies</v-card-title>

    <v-data-table
      :headers="headers"
      :sort-by="sortBy"
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
        <!-- Search text field -->
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
        ></v-text-field>

        <!-- Dialog Filter Controls (AI written then cleaned up) -->
        <v-dialog v-model="showFilterDialog" max-width="700px" data-testid="filter-dialog">
          <template #activator="{ props: {} }">
            <!-- Filters Toggle Button -->
            <v-btn class="mt-4" variant="outlined" rounded="lg" @click="toggleFilters()">
              <template v-slot:prepend>
                <v-icon start>{{ showFilterDialog ? 'mdi-filter-remove' : 'mdi-filter' }}</v-icon>
              </template>
              {{ showFilterDialog ? 'Close Filters' : 'Show Filters' }}
            </v-btn>
          </template>

          <v-card style="max-height: 90vh; overflow-y: auto">
            <v-card-title class="d-flex justify-space-between align-center">
              <span class="text-h6 font-weight-bold">Filter Options</span>
              <v-btn
                icon="mdi-close"
                variant="plain"
                size="small"
                @click="closeFilterDialog()"
              ></v-btn>
            </v-card-title>
            <v-divider></v-divider>

            <v-card-text>
              <!-- Hide personal ratings -->
              <div class="py-4 px-2">
                <v-checkbox
                  v-model="enablePersonalRatingFilter"
                  label="Hide movies you've already rated"
                ></v-checkbox>
              </div>
              <v-divider></v-divider>

              <!-- Year filter -->
              <div class="py-4 px-2">
                <v-checkbox v-model="enableYearFilter" label="Year filter"></v-checkbox>
                <v-range-slider
                  :disabled="!enableYearFilter"
                  v-model="yearFilter"
                  :max="yearFilterOptions[1]"
                  :min="yearFilterOptions[0]"
                  step="1"
                  thumb-label="hover"
                ></v-range-slider>
              </div>
              <v-divider></v-divider>

              <!-- Runtime filter -->
              <div class="py-4 px-2">
                <v-checkbox v-model="enableRuntimeFilter" label="Runtime filter"></v-checkbox>
                <v-range-slider
                  :disabled="!enableRuntimeFilter"
                  v-model="runtimeFilter"
                  :max="runtimeFilterOptions[1]"
                  :min="runtimeFilterOptions[0]"
                  step="1"
                  thumb-label="hover"
                ></v-range-slider>
              </div>
              <v-divider></v-divider>

              <!-- IMDB Rating filter -->
              <div class="py-4 px-2">
                <v-checkbox v-model="enableIMDBFilter" label="IMDB Rating filter"></v-checkbox>
                <v-range-slider
                  :disabled="!enableIMDBFilter"
                  v-model="imdbFilter"
                  :max="imdbFilterOptions[1]"
                  :min="imdbFilterOptions[0]"
                  step="0.1"
                  thumb-label="hover"
                ></v-range-slider>
              </div>
              <v-divider></v-divider>

              <!-- Rated filter -->
              <div class="py-4 px-2">
                <v-checkbox
                  v-model="enableRatedFilter"
                  label="Choose Age Rating filters"
                ></v-checkbox>
                <v-chip-group v-model="ratedFilter" column multiple :disabled="!enableRatedFilter">
                  <v-chip
                    v-for="rated in ratedFilterOptions"
                    :key="rated"
                    :text="rated"
                    filter
                  ></v-chip>
                </v-chip-group>
              </div>
              <v-divider></v-divider>

              <!-- Genre filters -->
              <div class="py-4 px-2">
                <v-checkbox v-model="enableGenreFilter" label="Choose Genre filters"></v-checkbox>
                <v-chip-group v-model="genreFilter" column multiple :disabled="!enableGenreFilter">
                  <v-chip
                    v-for="genre in genreFilterOptions"
                    :key="genre"
                    :text="genre"
                    filter
                  ></v-chip>
                </v-chip-group>
              </div>
            </v-card-text>
            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                block
                color="primary"
                variant="tonal"
                :disabled="showFilterDialog === false"
                @click="closeFilterDialog()"
              >
                Close dialog
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>

      <!-- Specific row -->
      <template v-slot:item="{ item }">
        <tr :key="`$${item._id}`" @click="clickRow(item)">
          <td :class="[{ 'bg-green-darken-2': item.isWatchlisted }]">
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
            <div class="d-flex flex-row align-center">
              <!-- Add a heart when a favorite genre exists -->
              <v-icon
                v-if="hasFavoriteGenres(item)"
                color="pink-lighten-2"
                icon="mdi-heart"
              ></v-icon>
              <TruncatedField :text="item.genres?.join(', ')" width="200"></TruncatedField>
            </div>
          </td>
          <td>{{ item.imdb.rating }}</td>
          <td>
            <PosterImage :poster="item.poster"></PosterImage>
          </td>
          <td>
            <div @click.stop="">
              <v-rating
                v-model="item.rating"
                half-increments
                hover
                :length="5"
                :size="32"
                active-color="primary"
                @update:model-value="onClickRating(item)"
              />
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>
