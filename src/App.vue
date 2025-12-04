<script setup>
// RouterView is handled automatically
</script>

<template>
  <div class="layout-container">

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
/* Reset & Base */
* {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

/* Flex Layout for Sticky Footer */
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Footer Styles */
.site-footer {
  background-color: #111827;
  color: #9ca3af;
  border-top: 4px solid #f97316;
  padding-top: 3rem;
  font-size: 0.95rem;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2.5rem;
}

.footer-col h3.footer-logo {
  color: white;
  font-size: 1.5rem;
  font-weight: 800;
  margin-top: 0;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.footer-col h4 {
  color: #f3f4f6;
  font-size: 1.1rem;
  margin-top: 0;
  margin-bottom: 1.2rem;
  font-weight: 600;
}

.footer-desc {
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.address-block p {
  margin: 0.4rem 0;
  font-size: 0.9rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.8rem;
}

.footer-links a {
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.2s, padding-left 0.2s;
}

.footer-links a:hover {
  color: #f97316;
  padding-left: 5px;
}

/* Badges */
.badges-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.badge {
  background: #1f2937;
  border: 1px solid #374151;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  line-height: 1.3;
  color: #d1d5db;
  flex: 1 1 45%;
  min-width: 100px;
  transition: border-color 0.2s;
}

.badge:hover {
  border-color: #f97316;
}

.badge strong {
  color: white;
  display: block;
  margin-bottom: 2px;
}

/* Footer Bottom */
.footer-bottom {
  margin-top: 3rem;
  border-top: 1px solid #374151;
  padding: 1.5rem;
  text-align: center;
  background-color: #0f1522;
  font-size: 0.85rem;
}
</style>
