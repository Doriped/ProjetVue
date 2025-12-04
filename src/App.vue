<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isDark = ref(false)

// Initialiser le thème au chargement
onMounted(() => {
  const savedTheme = localStorage.getItem('lunchroulette_theme')
  if (savedTheme === 'dark') {
    enableDarkMode()
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Détecter la préférence système si aucune sauvegarde
    enableDarkMode()
  }
})

function toggleTheme() {
  if (isDark.value) {
    disableDarkMode()
  } else {
    enableDarkMode()
  }
}

function enableDarkMode() {
  isDark.value = true
  document.body.classList.add('dark')
  localStorage.setItem('lunchroulette_theme', 'dark')
}

function disableDarkMode() {
  isDark.value = false
  document.body.classList.remove('dark')
  localStorage.setItem('lunchroulette_theme', 'light')
}
</script>

<template>
  <div class="layout-container">

    <header class="site-header">
      <div class="header-inner">
        <div class="logo-area">
          <span class="logo-icon">🎰</span>
          <span class="logo-text">LunchRoulette</span>
        </div>

        <div class="header-actions">
          <button @click="toggleTheme" class="theme-btn" title="Changer le thème">
            {{ isDark ? '' : '' }}
             {{ isDark ? '☀️' : '🌙' }}
          </button>

          <div v-if="authStore.isAuthenticated" class="auth-info">
            <span>Hello, <strong>{{ authStore.currentUser.username }}</strong></span>
            <button class="logout-btn" @click="authStore.logout">Logout</button>
          </div>
          <div v-else class="auth-links">
            <router-link to="/login" class="nav-link">Log in</router-link>
            <router-link to="/signup" class="nav-link primary">Sign up</router-link>
          </div>
        </div>
      </div>
    </header>

    <div class="main-content">
      <RouterView />
    </div>

    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-col">
          <h3 class="footer-logo">LunchRoulette</h3>
          <p class="footer-desc">
            The leading platform for random lunch dining.
            Rediscover your city, one bite at a time.
          </p>
          <div class="address-block">
            <p>📍 35 Satkar Paradise</p>
            <p>📞 +91 70225 29060</p>
            <p>📧 support@lunchroulette.com</p>
          </div>
        </div>
        <div class="footer-col">
           <h4>Company</h4>
           <ul class="footer-links">
             <li><a href="#">About Us</a></li>
             <li><a href="#">Careers</a></li>
           </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 LunchRoulette Ltd. All rights reserved.</p>
      </div>
    </footer>

  </div>
</template>

<style>
/* --- VARIABLES GLOBALES (Mode Clair par défaut) --- */
:root {
  --bg-body: #fafafa;
  --bg-card: #ffffff;
  --bg-header: #ffffff;
  --text-main: #111827;
  --text-muted: #6b7280;
  --border-color: #e5e7eb;
  --primary-color: #f97316;
  --accent-hover: #ea580c;
}

/* --- MODE SOMBRE --- */
body.dark {
  --bg-body: #111827;       /* Fond très sombre */
  --bg-card: #1f2937;       /* Fond des cartes un peu plus clair */
  --bg-header: #1f2937;
  --text-main: #f9fafb;     /* Texte quasi blanc */
  --text-muted: #9ca3af;    /* Texte gris clair */
  --border-color: #374151;
}

/* Reset & Base */
* {
  font-family: 'Inter', system-ui, sans-serif;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-body);
  color: var(--text-main);
  transition: background-color 0.3s, color 0.3s;
}

a { text-decoration: none; color: inherit; }

/* Layout */
.layout-container { display: flex; flex-direction: column; min-height: 100vh; }
.main-content { flex: 1; display: flex; flex-direction: column; }

/* HEADER STYLES */
.site-header {
  background-color: var(--bg-header);
  border-bottom: 1px solid var(--border-color);
  padding: 0.8rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background-color 0.3s;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-area { display: flex; align-items: center; gap: 0.5rem; font-weight: 800; font-size: 1.2rem; color: var(--primary-color); }
.header-actions { display: flex; align-items: center; gap: 1rem; }

.theme-btn {
  background: none; border: 1px solid var(--border-color);
  padding: 0.4rem 0.6rem; border-radius: 8px; cursor: pointer; font-size: 1.1rem;
  color: var(--text-main);
  transition: 0.2s;
}
.theme-btn:hover { background-color: var(--border-color); }

.nav-link { font-weight: 500; color: var(--text-muted); transition: 0.2s; }
.nav-link:hover { color: var(--primary-color); }
.nav-link.primary { background: var(--primary-color); color: white; padding: 0.4rem 0.8rem; border-radius: 6px; }
.nav-link.primary:hover { background: var(--accent-hover); }

.logout-btn {
  background: none; border: 1px solid var(--border-color); color: var(--text-main);
  padding: 0.3rem 0.6rem; border-radius: 6px; cursor: pointer; margin-left: 0.5rem;
}
.logout-btn:hover { background-color: var(--border-color); }

/* FOOTER STYLES */
.site-footer {
  background-color: #0f172a; /* Toujours sombre pour le footer */
  color: #9ca3af;
  border-top: 4px solid var(--primary-color);
  padding-top: 3rem;
  font-size: 0.95rem;
}
.footer-inner {
  max-width: 1200px; margin: 0 auto; padding: 0 1.5rem;
  display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2.5rem;
}
.footer-col h3, .footer-col h4 { color: #f3f4f6; margin-bottom: 1rem; }
.footer-bottom { margin-top: 3rem; border-top: 1px solid #334155; padding: 1.5rem; text-align: center; background-color: #020617; }
</style>
