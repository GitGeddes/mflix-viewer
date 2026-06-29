import {
  getAllMovies,
  getWatchlist,
  postFetchMovies,
  postRemoveFromWatchlist,
  putAddToWatchlist,
  type MoviesDictionary,
  type MovieWithWatchlist,
} from '@/services/api'
import { computed, onMounted, ref, type Ref } from 'vue'

export default function useMovies() {
  const moviesDict: Ref<MoviesDictionary> = ref({})

  const movies: Ref<MovieWithWatchlist[]> = computed(() => Object.values(moviesDict.value))

  // Show the loading text in the data table.
  const isLoading = ref(true)

  // Initialize movies table on load
  onMounted(() => {
    getMovies()
  })

  // Get all of the movies and update the data table.
  async function fetchWatchlist() {
    return getWatchlist().then(async (res) => {
      if (!res) {
        console.error('Error loading watchlist')
        return null
      }
      if (res.watchlist) {
        // Only has the IDs, fetch the actual movie objects
        const fetchedMovies = await postFetchMovies({ movies: res.watchlist.movies })
        if (fetchedMovies) {
          return fetchedMovies
        }
      }
      return null
    })
  }

  // Get all of the movies and update the data table.
  function getMovies() {
    getAllMovies().then((res) => {
      if (!res) {
        console.error('Error loading movies')
        return
      }
      moviesDict.value = res
      fetchWatchlist().then((res) => {
        if (!res) return
        Object.values(res.movies).forEach((movie) => {
          movie['isWatchlisted'] = true
          moviesDict.value[movie['_id']] = movie
        })
        // Reset the loading state
        isLoading.value = false
      })
    })
  }

  async function addToWatchlist(id: string) {
    console.log('add to watchlist', id)
    const result = await putAddToWatchlist({ movies: [id] })
    if (result && result.message === 'success') {
      const tempMovie = moviesDict.value[id]
      if (!tempMovie) return
      tempMovie.isWatchlisted = true
      moviesDict.value[id] = tempMovie
    }
  }

  async function removeFromWatchlist(id: string) {
    console.log('remove from watchlist', id)
    const result = await postRemoveFromWatchlist({ movies: [id] })
    if (result && result.message === 'success') {
      const tempMovie = moviesDict.value[id]
      if (!tempMovie) return
      tempMovie.isWatchlisted = false
      moviesDict.value[id] = tempMovie
    }
  }

  return {
    movies,
    isLoading,
    addToWatchlist,
    removeFromWatchlist,
  }
}
