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
import useWatchlist from './useWatchlist'

export default function useMovies() {
  const { fetchWatchlist } = useWatchlist()

  const moviesDict: Ref<MoviesDictionary> = ref({})
  const movies: Ref<MovieWithWatchlist[]> = computed(() => Object.values(moviesDict.value))

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
      moviesDict.value = res
      fetchWatchlist()
        .then((res) => {
          if (!res) return
          Object.values(res).forEach((movie) => {
            // Set the watchlisted flag to true after loading the watchlist
            movie['isWatchlisted'] = true
            moviesDict.value[movie['_id']] = movie
          })
        })
        .finally(() => {
          // Reset the loading state
          isLoading.value = false
        })
    })
  }

  async function addToWatchlist(id: string) {
    const result = await putAddToWatchlist({ movies: [id] })
    if (result && result.message === 'success') {
      const tempMovie = moviesDict.value[id]
      if (!tempMovie) return
      tempMovie.isWatchlisted = true
      moviesDict.value[id] = tempMovie
    }
  }

  async function removeFromWatchlist(id: string) {
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
