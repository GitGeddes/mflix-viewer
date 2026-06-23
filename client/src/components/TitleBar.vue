<template>
  <v-layout>
    <v-app-bar collapse>
      <template #prepend>
        <v-speed-dial location="bottom center" transition="slide-y-transition">
          <template v-slot:activator="{ props: activatorProps }">
            <v-fab v-bind="activatorProps" size="large" icon="$vuetify"></v-fab>
          </template>

          <v-btn key="1"> <RouterLink to="/">Home</RouterLink></v-btn>
          <v-btn key="2"> <RouterLink to="/movies">Movies</RouterLink></v-btn>
        </v-speed-dial>
      </template>
      <v-app-bar-title>App Bar</v-app-bar-title>
      <slot></slot>
    </v-app-bar>
  </v-layout>
</template>
