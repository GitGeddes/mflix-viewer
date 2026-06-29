<script setup lang="ts">
import { ref } from 'vue'
import SignupForm from './SignupForm.vue'
import useLogin from '@/hooks/useLogin.ts'

const signup = ref(false)

function onClickToggleSignup() {
  signup.value = !signup.value
}

const { email, password, onClickLogin, onClickSubmit } = useLogin()
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
