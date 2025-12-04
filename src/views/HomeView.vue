<script setup>
import { ref, onMounted, computed } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const restaurants = ref([])
const randomRestaurant = ref(null)
const loading = ref(true)

// --- Filters ---
const selectedCuisine = ref('all')
const selectedPrice = ref('all')
const selectedRating = ref('all')
const onlyDelivery = ref(false)

// Load restaurants
onMounted(async () => {
  const res = await fetch('/restaurants.json')
  restaurants.value = await res.json()
  loading.value = false
})

// Unique cuisines
const cuisines = computed(() => {
  const set = new Set()
  restaurants.value.forEach(r => {
    if (r.cuisine) r.cuisine.forEach(c => set.add(c))
  })
  return [...set]
})

// Filtered restaurants
const filteredRestaurants = computed(() => {
  return restaurants.value.filter(r => {
    if (selectedCuisine.value !== 'all' && !r.cuisine?.includes(selectedCuisine.value)) return false
    if (selectedPrice.value !== 'all' && r.price_level !== Number(selectedPrice.value)) return false
    if (selectedRating.value !== 'all' && r.rating < Number(selectedRating.value)) return false
    if (onlyDelivery.value && !r.delivery) return false
    return true
  })
})

// Spin Logic
function spin() {
  if (!filteredRestaurants.value.length) return
  const index = Math.floor(Math.random() * filteredRestaurants.value.length)
  randomRestaurant.value = filteredRestaurants.value[index]

  initMap(
    randomRestaurant.value.coordinates.lat,
    randomRestaurant.value.coordinates.lng
  )
}

// --- Favorites ---
function toggleFavorite(restaurant) {
  if (!authStore.isAuthenticated) {
    alert("Please log in to add favorites!")
    return
  }
  authStore.toggleFavorite(restaurant)
}

// --- Favorites Panel ---
const isFavoritesOpen = ref(false)

function openFavorites() {
  if (!authStore.isAuthenticated) {
     alert("Log in to see your favorites.")
     return
  }
  isFavoritesOpen.value = true
}

function closeFavorites() {
  isFavoritesOpen.value = false
}

// Map Logic
let map = null
let marker = null

const customIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
})

function initMap(lat, lng) {
  if (!map) {
    map = L.map('map').setView([lat, lng], 16)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map)
    marker = L.marker([lat, lng], { icon: customIcon }).addTo(map)
  } else {
    map.setView([lat, lng], 16)
    marker.setLatLng([lat, lng])
  }
}
</script>

<template>
  <div class="page">

    <div class="user-bar">
      <div v-if="authStore.isAuthenticated">
        <span>Hello, <strong>{{ authStore.currentUser.username }}</strong>!</span>
        <button class="logout-btn" @click="authStore.logout">Logout</button>
      </div>
      <div v-else>
        <router-link to="/login" class="auth-link">Log in</router-link>
        <router-link to="/signup" class="auth-link primary">Sign up</router-link>
      </div>
    </div>

    <h1 class="title">LunchRoulette</h1>

    <div class="filter-bar" v-if="!loading">

      <select v-model="selectedCuisine">
        <option value="all">All cuisines</option>
        <option v-for="c in cuisines" :key="c" :value="c">{{ c }}</option>
      </select>

      <select v-model="selectedPrice">
        <option value="all">Any price</option>
        <option value="1">₹ (cheap)</option>
        <option value="2">₹₹ (medium)</option>
        <option value="3">₹₹₹ (expensive)</option>
        <option value="4">₹₹₹₹ (very expensive)</option>
      </select>

      <select v-model="selectedRating">
        <option value="all">Any rating</option>
        <option value="3.5">≥ 3.5⭐</option>
        <option value="4">≥ 4.0⭐</option>
        <option value="4.5">≥ 4.5⭐</option>
      </select>

      <label class="checkbox-filter">
        <input type="checkbox" v-model="onlyDelivery">
        🛵 Delivery only
      </label>

    </div>

    <button class="spin-btn" @click="spin" :disabled="loading || !filteredRestaurants.length">
      Spin
    </button>

    <div v-if="randomRestaurant" class="result-card">

        <button
            class="fav-btn"
            @click="toggleFavorite(randomRestaurant)"
            :title="authStore.isAuthenticated ? 'Add to favorites' : 'Log in to add'"
        >
            {{ authStore.isFav(randomRestaurant.id) ? '❤️' : '🤍' }}
        </button>

        <p class="label">Today's pick</p>
        <h2 class="name">{{ randomRestaurant.name }}</h2>
        <p class="meta">
            {{ randomRestaurant.cuisine?.join(', ') }} · ⭐ {{ randomRestaurant.rating }}
        </p>
        <p class="address">{{ randomRestaurant.address }}</p>
        <p class="delivery-badge" v-if="randomRestaurant.delivery">🛵 Delivery available</p>
    </div>

    <div v-if="randomRestaurant" id="map" class="map"></div>

    <button class="favorites-btn" @click="openFavorites" v-if="authStore.isAuthenticated">
        ❤️ My Favorites ({{ authStore.favorites.length }})
    </button>
    <p v-else class="login-hint">Log in to view your favorites</p>

  </div>

  <div v-if="isFavoritesOpen" class="drawer-overlay" @click="closeFavorites"></div>

  <div :class="['drawer', isFavoritesOpen ? 'open' : '']">

      <div class="drawer-header">
          <h2>Your Favorites ❤️</h2>
          <button class="drawer-close" @click="closeFavorites">✕</button>
      </div>

      <div class="drawer-content">
          <div v-if="!authStore.favorites.length" class="empty-msg">
            No favorites yet.
          </div>

          <div v-for="f in authStore.favorites" :key="f.id" class="drawer-item">
              <div>
                  <strong>{{ f.name }}</strong>
                  <p class="small">{{ f.cuisine?.join(', ') }}</p>
              </div>

              <button class="remove-btn" @click="authStore.toggleFavorite(f)">🗑️</button>
          </div>
      </div>
  </div>
</template>

<style scoped>
/* Vos styles existants */
.page { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background: #fafafa; padding: 2rem; position: relative; }
.title { font-size: 3rem; font-weight: 800; margin-bottom: 1.5rem; letter-spacing: 0.05em; }
.user-bar { position: absolute; top: 1rem; right: 2rem; display: flex; gap: 1rem; align-items: center; font-size: 0.9rem; }
.auth-link { text-decoration: none; color: #4b5563; margin-left: 10px; font-weight: 500; }
.auth-link.primary { background: #f97316; color: white; padding: 0.4rem 0.8rem; border-radius: 6px; }
.logout-btn { margin-left: 10px; background: none; border: 1px solid #d1d5db; padding: 0.3rem 0.6rem; border-radius: 6px; cursor: pointer; }
.filter-bar { display: flex; gap: 0.8rem; margin-bottom: 1.5rem; flex-wrap: wrap; justify-content: center; }
.filter-bar select { padding: 0.5rem 0.8rem; font-size: 0.9rem; border-radius: 999px; border: 1px solid #d1d5db; background: white; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
.checkbox-filter { display: flex; align-items: center; gap: 0.4rem; background: white; padding: 0.5rem 0.8rem; border-radius: 999px; border: 1px solid #d1d5db; font-size: 0.9rem; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
.spin-btn { background: #f97316; color: white; font-size: 1.2rem; padding: 0.8rem 2rem; border: none; border-radius: 999px; cursor: pointer; margin-bottom: 2rem; box-shadow: 0 8px 16px rgba(0,0,0,0.15); transition: 0.15s; }
.spin-btn:hover { transform: translateY(-2px); }
.spin-btn:disabled { opacity: 0.4; cursor: default; }
.result-card { margin-top: 1rem; padding: 1.5rem 2rem; background: white; border-radius: 1rem; width: 90%; max-width: 420px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); position: relative; }
.label { color: #6b7280; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.4rem; }
.name { margin: 0; font-size: 1.5rem; font-weight: 700; }
.meta { margin: 0.3rem 0; color: #4b5563; }
.address { color: #6b7280; font-size: 0.9rem; }
.delivery-badge { display: inline-block; background: #dcfce7; color: #166534; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.8rem; margin-top: 0.5rem; font-weight: 600; }
.fav-btn { position: absolute; top: 12px; right: 12px; background: none; border: none; font-size: 1.6rem; cursor: pointer; transition: 0.2s; }
.fav-btn:hover { transform: scale(1.15); }
.login-hint { margin-top: 1rem; color: #9ca3af; font-size: 0.9rem; }
.drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.25); z-index: 8; }
.drawer { position: fixed; top: 0; right: -350px; width: 300px; height: 100vh; background: white; box-shadow: -4px 0 15px rgba(0,0,0,0.15); z-index: 9; padding: 1.2rem; display: flex; flex-direction: column; transition: right 0.3s ease; border-radius: 0 0 0 12px; }
.drawer.open { right: 0; }
.drawer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.drawer-close { font-size: 1.4rem; background: none; border: none; cursor: pointer; }
.drawer-content { display: flex; flex-direction: column; gap: 0.8rem; overflow-y: auto; }
.drawer-item { background: #f8fafc; padding: 0.9rem 1rem; border-radius: 0.6rem; display: flex; justify-content: space-between; align-items: center; }
.small { color: #6b7280; font-size: 0.85rem; }
.remove-btn { background: none; border: none; cursor: pointer; font-size: 1.1rem; }
.empty-msg { color: #6b7280; text-align: center; margin-top: 2rem; }
.favorites-btn { background: #ef4444; color: white; border: none; padding: 0.6rem 1.4rem; border-radius: 999px; cursor: pointer; box-shadow: 0 6px 15px rgba(239, 68, 68, 0.3); font-size: 1rem; margin-top: 1.5rem; display: block; margin-left: auto; margin-right: auto; }
.favorites-btn:hover { transform: translateY(-2px); }
.map { height: 300px; width: 90%; max-width: 450px; margin: 1rem auto; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
</style>
