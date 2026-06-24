<script setup lang="ts">
import { postCreateUser, postGetUser, postLogin } from '@/services/api'

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
</script>

<template>
  <p>Login form</p>
  <v-btn @click="onClickLogin">Test login</v-btn>
  <v-btn @click="onClickCreate">Test create user</v-btn>
  <v-btn @click="onClickGetUser">Get user with auth</v-btn>
</template>
