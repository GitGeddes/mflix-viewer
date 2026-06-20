<script setup lang="ts">
defineProps<{
  poster?: string // URL of the poster image
}>()
</script>

<template>
  <v-card class="my-2" elevation="1" rounded>
    <v-img :src="`${poster}`" height="64" cover></v-img>
  </v-card>
</template>
