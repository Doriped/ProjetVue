<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const error = ref('')

function handleLogin() {
  try {
    authStore.login(username.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = "Invalid username or password."
  }
}
</script>

<template>
  <div class="auth-page">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin" class="auth-form">
      <input v-model="username" placeholder="Username" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <p v-if="error" class="error">{{ error }}</p>
      <button type="submit">Log In</button>
    </form>
    <p>No account? <router-link to="/signup">Sign up</router-link></p>
    <router-link to="/" class="back-link">← Back to home</router-link>
  </div>
</template>

<style scoped>
.auth-page { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #fafafa; }
.auth-form { display: flex; flex-direction: column; gap: 1rem; width: 300px; margin-bottom: 1rem; }
input { padding: 0.8rem; border: 1px solid #ddd; border-radius: 8px; }
button { padding: 0.8rem; background: #f97316; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; }
.error { color: red; font-size: 0.9rem; }
.back-link { margin-top: 1rem; color: #666; text-decoration: none; }
</style>
