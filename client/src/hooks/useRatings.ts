import { getRatings, postFetchMovies, type FullMovie } from '@/services/api'
import { onMounted, ref, type Ref } from 'vue'

export default function useRatings() {
  const ratings: Ref<FullMovie[]> = ref([])

  onMounted(() => {
    fetchRatings().then((movies) => {
      if (movies) ratings.value = Object.values(movies)
    })
  })

  async function fetchRatings() {
    return getRatings().then(async (res) => {
      if (!res) {
        console.error('Error loading ratings list')
      } else if (res.ratings) {
        // Only has the IDs, fetch the actual movie objects
        const fetchedMovies = await postFetchMovies({
          movies: Object.keys(res.ratings.ratings).map((key) => key),
        })
        if (fetchedMovies) {
          Object.values(fetchedMovies.movies).forEach((movie) => {
            if (res.ratings) {
              movie.rating = res.ratings.ratings[movie._id]
            }
            return movie
          })
          return fetchedMovies.movies
        }
      }
      return null
    })
  }

  return {
    fetchRatings,
  }
}
