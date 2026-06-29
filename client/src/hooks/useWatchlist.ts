import { getWatchlist, postFetchMovies, type Movie } from '@/services/api'
import { onMounted, ref, type Ref } from 'vue'

export default function useWatchlist() {
  const watchlist: Ref<Movie[]> = ref([])

  // Show the loading text in the data table.
  const isLoading = ref(true)

  // Initialize watchlist table on load
  onMounted(() => {
    fetchWatchlist()
  })

  // Get all of the movies and update the data table.
  function fetchWatchlist() {
    getWatchlist().then(async (res) => {
      if (!res) {
        console.error('Error loading watchlist')
        return
      }
      if (res.watchlist) {
        // Only has the IDs, fetch the actual movie objects
        const fetchedMovies = await postFetchMovies({ movies: res.watchlist.movies })
        if (fetchedMovies) {
          watchlist.value = fetchedMovies.movies
        }
      }
      // Reset the loading state
      isLoading.value = false
    })
  }

  return {
    watchlist,
    isLoading,
  }
}
