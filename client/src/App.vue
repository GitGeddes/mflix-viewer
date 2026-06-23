<script setup lang="ts">
import { RouterView } from 'vue-router'
import TitleBar from './components/TitleBar.vue'
</script>

<template>
  <!-- Header -->
  <TitleBar></TitleBar>
  <!-- Body -->
  <main>
    <RouterView />
  </main>
</template>
