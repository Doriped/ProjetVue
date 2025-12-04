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
            <li><a href="#">Careers (We're Hiring!)</a></li>
            <li><a href="#">Become a Partner</a></li>
            <li><a href="#">Press & Media</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Trust & Safety</h4>
          <ul class="footer-links">
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Cookie Policy</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Certifications</h4>
          <div class="badges-grid">
            <div class="badge" title="ISO 27001 Certified">
              🛡️ <strong>ISO 27001</strong><br>Certified Security
            </div>
            <div class="badge" title="Voted Best Customer Service">
              🏆 <strong>Customer Service</strong><br>Voted Best 2024
            </div>
            <div class="badge" title="GDPR Compliant">
              🇪🇺 <strong>GDPR Ready</strong><br>Data Protected
            </div>
            <div class="badge" title="Secure Payment">
              💳 <strong>SSL Secure</strong><br>Verified Payment
            </div>
            <div class="badge eco" title="Eco-Friendly Company">
              🌿 <strong>Carbon Neutral</strong><br>Green Label
            </div>
          </div>
        </div>

      </div>

      <div class="footer-bottom">
        <p>&copy; 2024 LunchRoulette Ltd. All rights reserved. Randomness should be consumed responsibly.</p>
      </div>
    </footer>

  </div>
</template>

<style>
/* --- VARIABLES GLOBALES --- */
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

body.dark {
  --bg-body: #111827;
  --bg-card: #1f2937;
  --bg-header: #1f2937;
  --text-main: #f9fafb;
  --text-muted: #9ca3af;
  --border-color: #374151;
}

/* Reset & Base */
* { font-family: 'Inter', system-ui, sans-serif; box-sizing: border-box; }
body { margin: 0; padding: 0; background-color: var(--bg-body); color: var(--text-main); transition: background-color 0.3s, color 0.3s; }
a { text-decoration: none; color: inherit; }

/* Layout */
.layout-container { display: flex; flex-direction: column; min-height: 100vh; }
.main-content { flex: 1; display: flex; flex-direction: column; }

/* HEADER STYLES */
.site-header { background-color: var(--bg-header); border-bottom: 1px solid var(--border-color); padding: 0.8rem 0; position: sticky; top: 0; z-index: 100; transition: background-color 0.3s; }
.header-inner { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; display: flex; justify-content: space-between; align-items: center; }
.logo-area { display: flex; align-items: center; gap: 0.5rem; font-weight: 800; font-size: 1.2rem; color: var(--primary-color); }
.header-actions { display: flex; align-items: center; gap: 1.5rem; }

.theme-btn { background: none; border: 1px solid var(--border-color); padding: 0.4rem 0.6rem; border-radius: 8px; cursor: pointer; font-size: 1.1rem; color: var(--text-main); transition: 0.2s; }
.theme-btn:hover { background-color: var(--border-color); }

/* Auth links spacing fix */
.auth-links { display: flex; align-items: center; gap: 1rem; }

.nav-link { font-weight: 500; color: var(--text-muted); transition: 0.2s; }
.nav-link:hover { color: var(--primary-color); }
.nav-link.primary { background: var(--primary-color); color: white; padding: 0.4rem 0.8rem; border-radius: 6px; }
.nav-link.primary:hover { background: var(--accent-hover); }

.logout-btn { background: none; border: 1px solid var(--border-color); color: var(--text-main); padding: 0.3rem 0.6rem; border-radius: 6px; cursor: pointer; margin-left: 0.5rem; }
.logout-btn:hover { background-color: var(--border-color); }

/* FOOTER STYLES */
.site-footer { background-color: #0f172a; color: #9ca3af; border-top: 4px solid var(--primary-color); padding-top: 3rem; font-size: 0.95rem; }
.footer-inner { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2.5rem; }
.footer-col h3, .footer-col h4 { color: #f3f4f6; margin-bottom: 1rem; margin-top: 0; font-weight: 600; }
.footer-links { list-style: none; padding: 0; margin: 0; }
.footer-links li { margin-bottom: 0.8rem; }
.footer-links a:hover { color: var(--primary-color); padding-left: 5px; transition: 0.2s; }
.footer-bottom { margin-top: 3rem; border-top: 1px solid #334155; padding: 1.5rem; text-align: center; background-color: #020617; font-size: 0.85rem; }

/* BADGES STYLES (Restaurés) */
.badges-grid { display: flex; flex-wrap: wrap; gap: 0.8rem; }
.badge {
  background: #1f2937; border: 1px solid #374151; padding: 0.5rem; border-radius: 6px;
  font-size: 0.75rem; line-height: 1.3; color: #d1d5db; flex: 1 1 45%; min-width: 100px;
  transition: border-color 0.2s;
}
.badge:hover { border-color: var(--primary-color); }
.badge strong { color: white; display: block; margin-bottom: 2px; }
</style>
