import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import fs from 'node:fs'
import path from 'node:path'

// On recrée __dirname car il n'existe pas en mode module
const __dirname = fileURLToPath(new URL('.', import.meta.url))

// Plugin personnalisé pour gérer le fichier JSON
const jsonDbPlugin = () => ({
  name: 'simple-json-db',
  configureServer(server) {
    server.middlewares.use('/api/users', (req, res, next) => {
      // On utilise le __dirname qu'on a défini plus haut
      const dbPath = path.resolve(__dirname, 'DONOTOPEN.json')

      if (req.method === 'GET') {
        // Lire le fichier
        if (fs.existsSync(dbPath)) {
          const data = fs.readFileSync(dbPath, 'utf-8')
          res.setHeader('Content-Type', 'application/json')
          res.end(data || '[]')
        } else {
          res.end('[]')
        }
      } else if (req.method === 'POST') {
        // Écrire dans le fichier
        let body = ''
        req.on('data', chunk => {
          body += chunk.toString()
        })
        req.on('end', () => {
          // Petit correctif : on vérifie que le dossier existe (au cas où)
          fs.writeFileSync(dbPath, body)
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: true }))
        })
      } else {
        next()
      }
    })
  }
})

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    jsonDbPlugin()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
