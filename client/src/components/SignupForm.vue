<script setup lang="ts">
import useLogin from '@/hooks/useLogin'

const { username, displayname, email, password, onClickCreate } = useLogin()
</script>

<template>
  <h2>Signup!</h2>
  <v-form>
    <v-text-field v-model="username" type="text" label="Username"></v-text-field>
    <v-text-field v-model="displayname" type="text" label="Display Name (optional)"></v-text-field>
    <v-text-field v-model="email" type="email" label="Email"></v-text-field>
    <v-text-field v-model="password" type="password" label="Password"></v-text-field>
    <v-btn @click="onClickCreate">Create Account</v-btn>
  </v-form>
</template>
