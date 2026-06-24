<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const drawer = ref(false)

const router = useRouter()

function navigateToHome() {
  router.push('/')
}

function navigateToMovies() {
  router.push('/movies')
}

function navigateToUser() {
  router.push('/user')
}
</script>

<template>
  <!-- Header bar -->
  <v-app-bar :elevation="2">
    <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    <v-app-bar-title>Mflix Viewer</v-app-bar-title>
    <slot></slot>
  </v-app-bar>
  <!-- Navigation sidebar -->
  <!-- TODO: Move this to a component -->
  <v-navigation-drawer v-model="drawer" temporary>
    <v-list>
      <v-list-item key="1" @click="navigateToHome">Home</v-list-item>
      <v-list-item key="2" @click="navigateToMovies">Movies</v-list-item>
      <v-list-item key="2" @click="navigateToUser">User Settings</v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
