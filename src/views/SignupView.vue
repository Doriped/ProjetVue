<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const error = ref('')

async function handleSignup() {
  try {
    await authStore.signup(username.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = e.message
  }
}
</script>

<template>
  <div class="auth-page">
    <h1>Join LunchRoulette 🚀</h1>

    <p class="auth-desc">
      Create an account to save your favorite restaurants
      and never worry about "where to eat" again!
    </p>

    <form @submit.prevent="handleSignup" class="auth-form">
      <input v-model="username" placeholder="Choose a Username" required />
      <input type="password" v-model="password" placeholder="Create a Password" required />

      <p v-if="error" class="error">{{ error }}</p>

      <button type="submit">Create Account</button>
    </form>

    <p class="switch-link">
      Already have an account? <router-link to="/login">Log in</router-link>
    </p>

    <router-link to="/" class="back-link">← Back to home</router-link>
  </div>
</template>

<style scoped>
/* Identique à LoginView pour la cohérence */
.auth-page { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh; padding: 2rem; }
h1 { margin-bottom: 0.5rem; color: #111827; }

.auth-desc {
  text-align: center;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.5;
  max-width: 320px;
}

.auth-form { display: flex; flex-direction: column; gap: 1rem; width: 300px; margin-bottom: 1rem; }
input { padding: 0.8rem; border: 1px solid #d1d5db; border-radius: 8px; font-size: 1rem; }
button { padding: 0.8rem; background: #f97316; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 1rem; transition: background 0.2s; }
button:hover { background: #ea580c; }
.error { color: #ef4444; font-size: 0.9rem; text-align: center; margin: 0; }
.switch-link { color: #4b5563; font-size: 0.95rem; }
.switch-link a { color: #f97316; text-decoration: none; font-weight: 600; }
.switch-link a:hover { text-decoration: underline; }
.back-link { margin-top: 1.5rem; color: #9ca3af; text-decoration: none; font-size: 0.9rem; }
.back-link:hover { color: #6b7280; }
</style>
