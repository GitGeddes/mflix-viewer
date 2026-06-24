<script setup lang="ts">
import { RouterView } from 'vue-router'
import TitleBar from './components/TitleBar.vue'
</script>

<template>
  <v-app>
    <!-- Header -->
    <TitleBar></TitleBar>
    <!-- Body -->
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>
