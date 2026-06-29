<script setup lang="ts">
import { getSelfUser, LOCAL_STORAGE_UPDATE_KEY, TOKEN_LOCAL_STORAGE_KEY } from '@/services/api'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const drawer = ref(false)
const isLoggedIn = ref(false)

// TODO: Watch the localStorage to track login state
const tokenRef = ref(localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY))
let storageHandler: ((e: CustomEvent<{ storage: string | null }>) => void) | null = null

watch(tokenRef, (curr, prev) => {
  console.debug('login state changed', curr !== null, 'from previous', prev !== null)
  if (curr !== null && prev === null) {
    isLoggedIn.value = true
  } else if (curr === null && prev !== null) {
    isLoggedIn.value = false
  }
})

onMounted(() => {
  getIsLoggedIn().then((res) => (isLoggedIn.value = res))

  // Listen to storage events for cross-tab updates
  storageHandler = (event: CustomEvent<{ storage: string | null }>) => {
    if (event.detail.storage === TOKEN_LOCAL_STORAGE_KEY) {
      tokenRef.value = localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY)
    } else if (event.detail.storage === null) {
      // Storage cleared, reset the token ref to null
      tokenRef.value = null
    }
  }

  window.addEventListener(LOCAL_STORAGE_UPDATE_KEY, storageHandler as EventListener)
})

onUnmounted(() => {
  // Cleanup the event listener
  if (window && storageHandler) {
    window.removeEventListener(LOCAL_STORAGE_UPDATE_KEY, storageHandler as EventListener)
  }
})

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

async function getIsLoggedIn() {
  const result = await getSelfUser()
  return result !== null
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
    <v-list v-if="isLoggedIn">
      <v-list-item key="2" @click="navigateToMovies">Movies</v-list-item>
      <v-list-item key="2" @click="navigateToUser">User Settings</v-list-item>
    </v-list>
    <v-list v-else>
      <v-list-item key="1" @click="navigateToHome">Home</v-list-item>
      <v-list-item key="2" @click="navigateToMovies">Movies</v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
