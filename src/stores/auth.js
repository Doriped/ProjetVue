// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // État
  const currentUser = ref(null)
  const users = ref([])

  // Charger les données depuis le localStorage au démarrage
  const savedUsers = localStorage.getItem('lunchroulette_users')
  if (savedUsers) {
    users.value = JSON.parse(savedUsers)
  }

  // Vérifier s'il y a une session active
  const savedSession = localStorage.getItem('lunchroulette_current_user')
  if (savedSession) {
    currentUser.value = JSON.parse(savedSession)
  }

  // Getters
  const isAuthenticated = computed(() => !!currentUser.value)
  const favorites = computed(() => currentUser.value ? currentUser.value.favorites : [])

  // Actions
  function saveToStorage() {
    localStorage.setItem('lunchroulette_users', JSON.stringify(users.value))
    if (currentUser.value) {
      localStorage.setItem('lunchroulette_current_user', JSON.stringify(currentUser.value))
    } else {
      localStorage.removeItem('lunchroulette_current_user')
    }
  }

  function signup(username, password) {
    if (users.value.find(u => u.username === username)) {
      throw new Error("Cet utilisateur existe déjà.")
    }
    const newUser = { username, password, favorites: [] }
    users.value.push(newUser)
    saveToStorage()
    // Connexion automatique après inscription
    login(username, password)
  }

  function login(username, password) {
    const user = users.value.find(u => u.username === username && u.password === password)
    if (!user) {
      throw new Error("Nom d'utilisateur ou mot de passe incorrect.")
    }
    currentUser.value = user
    saveToStorage()
  }

  function logout() {
    currentUser.value = null
    saveToStorage()
  }

  function toggleFavorite(restaurant) {
    if (!currentUser.value) return // Sécurité

    const index = currentUser.value.favorites.findIndex(f => f.id === restaurant.id)
    if (index !== -1) {
      currentUser.value.favorites.splice(index, 1) // Retirer
    } else {
      currentUser.value.favorites.push(restaurant) // Ajouter
    }

    // Mettre à jour la liste globale des utilisateurs pour la persistance
    const userIndex = users.value.findIndex(u => u.username === currentUser.value.username)
    if (userIndex !== -1) {
      users.value[userIndex] = currentUser.value
    }
    saveToStorage()
  }

  function isFav(id) {
    if (!currentUser.value) return false
    return currentUser.value.favorites.some(f => f.id === id)
  }

  return {
    currentUser,
    isAuthenticated,
    favorites,
    login,
    signup,
    logout,
    toggleFavorite,
    isFav
  }
})
