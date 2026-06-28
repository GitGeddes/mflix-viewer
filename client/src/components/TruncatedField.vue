<script setup lang="ts">
defineProps<{
  text?: string
  width?: string
}>()
</script>

<template>
  <!-- Account for very long text -->
  <v-card-text class="text-truncate" :style="'width: ' + width + 'px'">{{ text }}</v-card-text>
</template>
