<script setup lang="ts">
import WatchlistTable from '@/components/WatchlistTable.vue'
import router from '@/router'
import {
  getDistinctGenres,
  getFavoriteGenres,
  getSelfUser,
  postLogout,
  postSaveFavoriteGenres,
  TOKEN_LOCAL_STORAGE_KEY,
  type UserInterface,
} from '@/services/api'
import { onMounted, ref, type Ref } from 'vue'

const user: Ref<UserInterface | undefined> = ref()

onMounted(() => {
  fetchSelfUser()
})

async function fetchSelfUser() {
  const response = await getSelfUser()
  if (response) {
    user.value = response.user
  }
}

// Genre array
const genreFilter: Ref<number[]> = ref([])
const genreFilterOptions: Ref<string[]> = ref([])

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

async function onClickLogout() {
  postLogout().then((res) => {
    if (res.ok) {
      // Delete the saved token because it is now invalid
      localStorage.removeItem(TOKEN_LOCAL_STORAGE_KEY)
      user.value = undefined
      // Navigate back to the home page
      router.push('/')
    }
  })
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
</script>

<template>
  <v-card-text>
    <h1>User settings</h1>
    <v-btn v-if="user !== undefined" @click="onClickLogout">Log out</v-btn>
  </v-card-text>
  <v-card-text>
    <h2>Choose favorite genres</h2>
    <v-chip-group v-model="genreFilter" column multiple>
      <v-chip v-for="genre in genreFilterOptions" :key="genre" :text="genre" filter></v-chip>
    </v-chip-group>
    <v-btn @click="onClickSaveFavoriteGenres">Save genres</v-btn>
    <v-btn @click="onClickGetFavoriteGenres">Get genres</v-btn>
  </v-card-text>
  <v-card-text>
    <h2>Watchlist</h2>
    <WatchlistTable></WatchlistTable>
  </v-card-text>
</template>
