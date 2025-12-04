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
  try {
    const res = await fetch('/restaurants.json')
    restaurants.value = await res.json()
  } catch(e) { console.error(e) }
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

  // Petit timeout pour laisser le DOM se mettre à jour
  setTimeout(() => {
      initMap(
        randomRestaurant.value.coordinates.lat,
        randomRestaurant.value.coordinates.lng
      )
  }, 100)
}

// --- Favorites ---
async function toggleFavorite(restaurant) {
  if (!authStore.isAuthenticated) {
    alert("Please log in to add favorites!")
    return
  }
  await authStore.toggleFavorite(restaurant)
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
  // Reset map container if needed
  if(map) {
      map.remove();
      map = null;
  }

  map = L.map('map').setView([lat, lng], 16)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
  }).addTo(map)
  marker = L.marker([lat, lng], { icon: customIcon }).addTo(map)
}
</script>

<template>
  <div class="page">
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

        <a
          :href="`https://www.google.com/maps/dir/?api=1&destination=${randomRestaurant.coordinates.lat},${randomRestaurant.coordinates.lng}`"
          target="_blank"
          class="route-btn"
        >
          📍 Itinerary
        </a>
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
/* Page layout */
.page {
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  text-align: center; padding: 2rem; position: relative;
  /* Plus de background fixe, il hérite du body */
}

.title { font-size: 3rem; font-weight: 800; margin-bottom: 1.5rem; letter-spacing: 0.05em; color: var(--text-main); }

/* Filtres */
.filter-bar { display: flex; gap: 0.8rem; margin-bottom: 1.5rem; flex-wrap: wrap; justify-content: center; }

/* Utilisation des variables pour les inputs */
.filter-bar select, .checkbox-filter {
  padding: 0.5rem 0.8rem; font-size: 0.9rem; border-radius: 999px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-main);
  cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}
.checkbox-filter { display: flex; align-items: center; gap: 0.4rem; }

.spin-btn {
  background: var(--primary-color); color: white; font-size: 1.2rem;
  padding: 0.8rem 2rem; border: none; border-radius: 999px; cursor: pointer;
  margin-bottom: 2rem; box-shadow: 0 8px 16px rgba(0,0,0,0.15); transition: 0.15s;
}
.spin-btn:hover { transform: translateY(-2px); background: var(--accent-hover); }
.spin-btn:disabled { opacity: 0.4; cursor: default; }

/* Result Card */
.result-card {
  margin-top: 1rem; padding: 1.5rem 2rem; border-radius: 1rem; width: 90%; max-width: 420px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1); position: relative;
  background: var(--bg-card); /* Fond dynamique */
  color: var(--text-main);    /* Texte dynamique */
  border: 1px solid var(--border-color);
}

.label { color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.4rem; }
.name { margin: 0; font-size: 1.5rem; font-weight: 700; color: var(--text-main); }
.meta { margin: 0.3rem 0; color: var(--text-muted); }
.address { color: var(--text-muted); font-size: 0.9rem; }
.delivery-badge { display: inline-block; background: #dcfce7; color: #166534; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.8rem; margin-top: 0.5rem; font-weight: 600; }
.fav-btn { position: absolute; top: 12px; right: 12px; background: none; border: none; font-size: 1.6rem; cursor: pointer; transition: 0.2s; }
.fav-btn:hover { transform: scale(1.15); }
.route-btn { display: block; margin-top: 1rem; background-color: #3b82f6; color: white; text-decoration: none; padding: 0.8rem; border-radius: 8px; font-weight: 600; transition: background-color 0.2s; }
.route-btn:hover { background-color: #2563eb; }

/* Drawer / Favorites */
.favorites-btn { background: #ef4444; color: white; border: none; padding: 0.6rem 1.4rem; border-radius: 999px; cursor: pointer; box-shadow: 0 6px 15px rgba(239, 68, 68, 0.3); font-size: 1rem; margin-top: 1.5rem; display: block; margin-left: auto; margin-right: auto; }
.login-hint { margin-top: 1rem; color: var(--text-muted); font-size: 0.9rem; }

.drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200; }
.drawer {
  position: fixed; top: 0; right: -350px; width: 300px; height: 100vh;
  background: var(--bg-card); /* Fond dynamique */
  color: var(--text-main);
  box-shadow: -4px 0 15px rgba(0,0,0,0.15); z-index: 201;
  padding: 1.2rem; display: flex; flex-direction: column; transition: right 0.3s ease;
}
.drawer.open { right: 0; }
.drawer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.drawer-close { font-size: 1.4rem; background: none; border: none; cursor: pointer; color: var(--text-main); }
.drawer-content { display: flex; flex-direction: column; gap: 0.8rem; overflow-y: auto; }

.drawer-item {
  background: var(--bg-body); /* Contraste léger */
  padding: 0.9rem 1rem; border-radius: 0.6rem; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--border-color);
}
.small { color: var(--text-muted); font-size: 0.85rem; }
.remove-btn { background: none; border: none; cursor: pointer; font-size: 1.1rem; }
.empty-msg { color: var(--text-muted); text-align: center; margin-top: 2rem; }
.map { height: 300px; width: 90%; max-width: 450px; margin: 1rem auto; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
</style>
