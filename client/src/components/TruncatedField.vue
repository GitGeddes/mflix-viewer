<script setup lang="ts">
defineProps<{
  text: string | string[]
  width?: string
}>()
</script>

<template>
  <v-card flat>
    <!-- Account for very long text -->
    <v-card-text class="text-truncate" :style="'width: ' + width + 'px'">{{ text }}</v-card-text>
  </v-card>
</template>
