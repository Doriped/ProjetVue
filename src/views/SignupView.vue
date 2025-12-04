<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const error = ref('')

function handleSignup() {
  try {
    // Tente l'inscription (vérifie si l'utilisateur existe déjà dans le store)
    authStore.signup(username.value, password.value)
    // Redirige vers l'accueil après succès
    router.push('/')
  } catch (e) {
    error.value = e.message
  }
}
</script>

<template>
  <div class="auth-page">
    <h1>Sign Up</h1>
    <form @submit.prevent="handleSignup" class="auth-form">
      <input v-model="username" placeholder="Username" required />
      <input type="password" v-model="password" placeholder="Password" required />

      <p v-if="error" class="error">{{ error }}</p>

      <button type="submit">Create Account</button>
    </form>

    <p>Already have an account? <router-link to="/login">Log in</router-link></p>

    <router-link to="/" class="back-link">← Back to home</router-link>
  </div>
</template>

<style scoped>
/* Même style que LoginView pour la cohérence */
.auth-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #fafafa;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 300px;
  margin-bottom: 1rem;
}

input {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

button {
  padding: 0.8rem;
  background: #f97316;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: background 0.2s;
}

button:hover {
  background: #ea580c;
}

.error {
  color: #ef4444;
  font-size: 0.9rem;
  text-align: center;
  margin: 0;
}

p {
  color: #4b5563;
}

a {
  color: #f97316;
  text-decoration: none;
  font-weight: 500;
}

a:hover {
  text-decoration: underline;
}

.back-link {
  margin-top: 1.5rem;
  color: #6b7280;
  font-size: 0.9rem;
}

.back-link:hover {
  color: #111827;
  text-decoration: none;
}
</style>
