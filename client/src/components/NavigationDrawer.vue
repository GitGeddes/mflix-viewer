/** TODO: Move Navigation Drawer to this component. Not sure how to bind the prop to the v-model. */

<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{
  drawer: boolean
}>()

const router = useRouter()

function navigateToHome() {
  router.push('/')
}

function navigateToMovies() {
  router.push('/movies')
}
</script>

<template>
  <v-navigation-drawer :drawer="props.drawer" @update:drawer="!props.drawer" temporary>
    <v-list>
      <v-list-item key="1" @click="navigateToHome">Home</v-list-item>
      <v-list-item key="2" @click="navigateToMovies">Movies</v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
