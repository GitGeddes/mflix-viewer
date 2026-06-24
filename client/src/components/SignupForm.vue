<script setup lang="ts">
import router from '@/router'
import { postCreateUser, postLogin } from '@/services/api'
import { ref, type Ref } from 'vue'

const displayname: Ref<string | undefined> = ref(undefined)
const username = ref('')
const email = ref('')
const password = ref('')

async function onClickCreate() {
  const response = await postCreateUser({
    email: email.value,
    password: password.value,
    username: username.value,
    displayname: displayname.value,
  })
  console.log('create user response', response)
}

async function onClickSubmit() {
  await onClickCreate()
  const response = await postLogin({
    email: email.value,
    password: password.value,
  })
  if (response) {
    // Navigate to the User page after logging in
    router.push('/user')
  }
}
</script>

<template>
  <h2>Signup!</h2>
  <v-form>
    <v-text-field v-model="username" type="text" label="Username"></v-text-field>
    <v-text-field v-model="displayname" type="text" label="Display Name (optional)"></v-text-field>
    <v-text-field v-model="email" type="email" label="Email"></v-text-field>
    <v-text-field v-model="password" type="password" label="Password"></v-text-field>
    <v-btn @click="onClickSubmit">Create Account</v-btn>
  </v-form>
</template>
