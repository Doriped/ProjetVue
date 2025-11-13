<script setup>
import { ref, onMounted } from 'vue'

const restaurants = ref([])
const isLoading = ref(true)
const error = ref(null)
const randomRestaurant = ref(null)

// Charger le JSON depuis /public/restaurants.json
async function loadRestaurants() {
  try {
    const res = await fetch('/restaurants.json')
    if (!res.ok) {
      throw new Error('Failed to load restaurants.json')
    }
    restaurants.value = await res.json()
  } catch (e) {
    error.value = e.message
  } finally {
    isLoading.value = false
  }
}

// Tirage aléatoire
function spin() {
  if (!restaurants.value.length) return
  const index = Math.floor(Math.random() * restaurants.value.length)
  randomRestaurant.value = restaurants.value[index]
}

onMounted(loadRestaurants)
</script>

<template>
  <main class="app">
    <h1>LunchRoulette</h1>

    <!-- Bouton random -->
    <button @click="spin">
      🎲 Spin!
    </button>

    <!-- Chargement / erreur -->
    <p v-if="isLoading">Loading restaurants…</p>
    <p v-else-if="error">Error: {{ error }}</p>

    <!-- Restaurant tiré -->
    <section v-if="randomRestaurant" class="random-card">
      <h2>Today’s pick</h2>
      <h3>{{ randomRestaurant.name }}</h3>
      <p>
        {{ randomRestaurant.cuisine?.join(', ') }} · ⭐
        {{ randomRestaurant.rating }} · ₹ level: {{ randomRestaurant.price_level }}
      </p>
      <p>{{ randomRestaurant.address }}</p>
    </section>

    <!-- Liste de tous les restaurants -->
    <section v-if="!isLoading && !error">
      <h2>All restaurants ({{ restaurants.length }})</h2>

      <ul class="restaurant-list">
        <li v-for="r in restaurants" :key="r.id" class="restaurant-item">
          <strong>{{ r.name }}</strong>
          <span> — {{ r.cuisine?.join(', ') }}</span>
          <span> · ⭐ {{ r.rating }}</span>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

button {
  margin: 1rem 0;
  padding: 0.6rem 1.2rem;
  border-radius: 999px;
  border: none;
  cursor: pointer;
}

.random-card {
  margin: 1rem 0 2rem;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid #ddd;
}

.restaurant-list {
  list-style: none;
  padding: 0;
}

.restaurant-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}
</style>
