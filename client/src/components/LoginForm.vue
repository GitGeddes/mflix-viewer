<script setup lang="ts">
import router from '@/router'
import { postCreateUser, postLogin } from '@/services/api'
import { ref } from 'vue'

const email = ref('')
const password = ref('')

async function onClickLogin() {
  const response = await postLogin({ email: 'test', password: 'testpass' })
  if (response) {
    // Navigate to the User page
    router.push('/user')
  }
}

async function onClickCreate() {
  const response = await postCreateUser({
    email: 'test',
    password: 'testpass',
    username: 'username',
  })
  console.log('create user response', response)
}

async function onClickSubmit() {
  const response = await postLogin({
    email: email.value,
    password: password.value,
  })
  if (response) {
    // Navigate to the User page
    router.push('/user')
  }
}
</script>

<template>
  <p>Login form</p>
  <v-btn @click="onClickLogin">Test login</v-btn>
  <v-btn @click="onClickCreate">Test create user</v-btn>
  <v-form>
    <v-text-field v-model="email" type="email" label="Email"></v-text-field>
    <v-text-field v-model="password" type="password" label="Password"></v-text-field>
    <v-btn @click="onClickSubmit">Submit</v-btn>
  </v-form>
</template>
