<script setup lang="ts">
import router from '@/router'
import { postLogin } from '@/services/api'
import { ref } from 'vue'
import SignupForm from './SignupForm.vue'

const signup = ref(false)

function onClickToggleSignup() {
  signup.value = !signup.value
}

const email = ref('')
const password = ref('')

// TODO: Remove this testing function
async function onClickLogin() {
  const response = await postLogin({ email: 'test', password: 'testpass' })
  if (response) {
    // Navigate to the User page
    router.push('/user')
  }
}

async function onClickSubmit() {
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
  <div v-if="signup">
    <SignupForm></SignupForm>
    <v-btn @click="onClickToggleSignup">Go Back</v-btn>
  </div>
  <div v-else>
    <h2>Log In!</h2>
    <!-- TODO: Remove this testing button -->
    <v-btn @click="onClickLogin">Test login</v-btn>
    <v-form>
      <v-text-field v-model="email" type="email" label="Email"></v-text-field>
      <v-text-field v-model="password" type="password" label="Password"></v-text-field>
      <v-btn @click="onClickSubmit">Log In</v-btn>
    </v-form>
    <v-btn @click="onClickToggleSignup">Create Account</v-btn>
  </div>
</template>
