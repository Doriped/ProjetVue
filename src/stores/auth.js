// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // État
  const currentUser = ref(null)
  const users = ref([])

  // On garde la session active en localStorage (juste l'utilisateur courant) pour ne pas être déconnecté au refresh
  const savedSession = localStorage.getItem('lunchroulette_current_user')
  if (savedSession) {
    currentUser.value = JSON.parse(savedSession)
  }

  // Getters
  const isAuthenticated = computed(() => !!currentUser.value)
  const favorites = computed(() => currentUser.value ? currentUser.value.favorites : [])

  // Actions internes (API)
  async function fetchUsers() {
    try {
      const res = await fetch('/api/users')
      if (res.ok) {
        users.value = await res.json()
      }
    } catch (e) {
      console.error("Erreur chargement users", e)
    }
  }

  async function saveUsersToDisk() {
    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(users.value)
      })
    } catch (e) {
      console.error("Erreur sauvegarde users", e)
    }
  }

  function saveSession() {
    if (currentUser.value) {
      localStorage.setItem('lunchroulette_current_user', JSON.stringify(currentUser.value))
    } else {
      localStorage.removeItem('lunchroulette_current_user')
    }
  }

  // Actions publiques
  async function signup(username, password) {
    // On s'assure d'avoir la dernière version du fichier
    await fetchUsers()

    if (users.value.find(u => u.username === username)) {
      throw new Error("Cet utilisateur existe déjà.")
    }

    const newUser = { username, password, favorites: [] }
    users.value.push(newUser)

    // On sauvegarde dans le fichier
    await saveUsersToDisk()

    // Connexion automatique
    await login(username, password)
  }

  async function login(username, password) {
    await fetchUsers()

    const user = users.value.find(u => u.username === username && u.password === password)
    if (!user) {
      throw new Error("Nom d'utilisateur ou mot de passe incorrect.")
    }

    currentUser.value = user
    saveSession()
  }

  function logout() {
    currentUser.value = null
    saveSession()
  }

  async function toggleFavorite(restaurant) {
    if (!currentUser.value) return

    // On recharge les users pour être sûr de ne pas écraser les données d'un autre
    await fetchUsers()

    // On retrouve l'utilisateur courant dans la liste globale
    const userIndex = users.value.findIndex(u => u.username === currentUser.value.username)
    if (userIndex === -1) return

    // On met à jour l'utilisateur dans la liste globale
    const targetUser = users.value[userIndex]

    const index = targetUser.favorites.findIndex(f => f.id === restaurant.id)
    if (index !== -1) {
      targetUser.favorites.splice(index, 1)
    } else {
      targetUser.favorites.push(restaurant)
    }

    // Mise à jour de l'état local
    currentUser.value = targetUser
    users.value[userIndex] = targetUser

    saveSession() // Met à jour le localStorage session
    await saveUsersToDisk() // Met à jour le fichier JSON
  }

  function isFav(id) {
    if (!currentUser.value) return false
    return currentUser.value.favorites.some(f => f.id === id)
  }

  // Initialisation : charger les users au démarrage
  fetchUsers()

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
