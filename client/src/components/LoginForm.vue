<script setup lang="ts">
import { postCreateUser, postGetUser, postLogin } from '@/services/api'
import { ref } from 'vue'

const email = ref('')
const password = ref('')

async function onClickLogin() {
  const response = await postLogin({ email: 'test', password: 'testpass' })
  console.log('login response', response)
}

async function onClickCreate() {
  const response = await postCreateUser({
    email: 'test',
    password: 'testpass',
    username: 'username',
  })
  console.log('create user response', response)
}

async function onClickGetUser() {
  const response = await postGetUser({
    userID: '6a3b64ead43f3eedf7609400',
  })
  console.log('get user responseeeee', response)
}

async function onClickSubmit() {
  const response = await postLogin({
    email: email.value,
    password: password.value,
  })
  console.log('login response', response)
}
</script>

<template>
  <p>Login form</p>
  <v-btn @click="onClickLogin">Test login</v-btn>
  <v-btn @click="onClickCreate">Test create user</v-btn>
  <v-btn @click="onClickGetUser">Get user with auth</v-btn>
  <v-form>
    <v-text-field v-model="email" type="email" label="Email"></v-text-field>
    <v-text-field v-model="password" type="password" label="Password"></v-text-field>
    <v-btn @click="onClickSubmit">Submit</v-btn>
  </v-form>
</template>
