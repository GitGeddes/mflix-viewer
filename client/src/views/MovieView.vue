<script setup lang="ts">
import { getMovieById, type Movie } from '@/services/api'
import { onMounted, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'

defineProps<Partial<Movie>>()

const route = useRoute()
const movieId: string = route.params.movieId as string
const movie: Ref<Movie | undefined> = ref()
onMounted(() => {
  getMovie()
})

// TODO: Pass the movie as a prop from the table
async function getMovie() {
  movie.value = (await getMovieById(movieId))!
}
</script>

<template>
  <h1>Title: {{ movie?.title }}</h1>
  <h2>Year: {{ movie?.year }}</h2>
  <h3>Runtime: {{ movie?.runtime }}</h3>
  <h3>Rated: {{ movie?.rated }}</h3>
  <h3>Genres: {{ movie?.genres?.join(', ') }}</h3>
  <h3>IMDB Rating: {{ movie?.imdb.rating }}</h3>
  <h3>Poster:</h3>
  <img :src="movie?.poster" />
</template>
