import { getDistinctGenres, getFavoriteGenres, postSaveFavoriteGenres } from '@/services/api'
import { computed, onMounted, ref, type Ref } from 'vue'

export default function useGenres() {
  // Indexes of the favorited genres in the Options array
  const genreFilter: Ref<number[]> = ref([])
  // All possible options for genres
  const genreFilterOptions: Ref<string[]> = ref([])
  // Favorite genres by their names
  const favoriteGenres = computed(() => {
    return genreFilter.value.map((val) => genreFilterOptions.value[val]!)
  })

  onMounted(() => {
    // Populate all filter fields
    getAllGenres().then(() => {
      onClickGetFavoriteGenres()
    })
  })

  async function getAllGenres() {
    const result = await getDistinctGenres()
    if (result) {
      genreFilterOptions.value = result.sort()
    }
  }

  // Save the selected genres to a doc in the database
  async function onClickSaveFavoriteGenres() {
    const filtered = genreFilter.value.map((val) => genreFilterOptions.value[val]!)
    await postSaveFavoriteGenres({ genres: filtered })
  }

  // Load the existing favorite genres doc if it exists and populate the user settings
  async function onClickGetFavoriteGenres() {
    const genres = await getFavoriteGenres()
    if (genres) {
      const indexes = genres.genres.map((val) => genreFilterOptions.value.indexOf(val))
      genreFilter.value = indexes
    }
  }

  return {
    favoriteGenres,
    genreFilter,
    genreFilterOptions,
    onClickGetFavoriteGenres,
    onClickSaveFavoriteGenres,
  }
}
