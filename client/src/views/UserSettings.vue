<script setup lang="ts">
import WatchlistTable from '@/components/WatchlistTable.vue'
import useGenres from '@/hooks/useGenres'
import useUser from '@/hooks/useUser'

const { user, onClickLogout } = useUser()
const { genreFilter, genreFilterOptions, onClickGetFavoriteGenres, onClickSaveFavoriteGenres } =
  useGenres()
</script>

<template>
  <v-card>
    <h1>User settings</h1>
    <v-divider></v-divider>
    <div v-if="user !== undefined">
      <h2>Name: {{ user.displayname ? user.displayname : user.username }}</h2>
      <v-btn @click="onClickLogout" elevation="5">Log out</v-btn>
    </div>
  </v-card>
  <v-card>
    <h2>Choose favorite genres</h2>
    <v-divider></v-divider>
    <v-chip-group v-model="genreFilter" column multiple>
      <v-chip v-for="genre in genreFilterOptions" :key="genre" :text="genre" filter></v-chip>
    </v-chip-group>
    <v-btn @click="onClickSaveFavoriteGenres">Save genres</v-btn>
    <v-btn @click="onClickGetFavoriteGenres">Get genres</v-btn>
  </v-card>
  <v-card>
    <h2>Watchlist</h2>
    <v-divider></v-divider>
    <WatchlistTable></WatchlistTable>
  </v-card>
</template>
