<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const error = ref('')

async function handleLogin() {
  try {
    await authStore.login(username.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = "Invalid username or password."
  }
}
</script>

<template>
  <div class="auth-page">
    <h1>Welcome Back! 👋</h1>

    <p class="auth-desc">
      Ready for your next culinary adventure? <br>
      Log in to access your saved favorites and spin the wheel!
    </p>

    <form @submit.prevent="handleLogin" class="auth-form">
      <input v-model="username" placeholder="Username" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <p v-if="error" class="error">{{ error }}</p>
      <button type="submit">Log In</button>
    </form>

    <p class="switch-link">
      No account? <router-link to="/signup">Sign up here</router-link>
    </p>
    <router-link to="/" class="back-link">← Back to home</router-link>
  </div>
</template>

<style scoped>
.auth-page { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh; padding: 2rem; }
h1 { margin-bottom: 0.5rem; color: #111827; }

/* Nouveau style pour le texte de description */
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
