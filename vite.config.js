import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import fs from 'node:fs'
import path from 'node:path'

// Plugin personnalisé pour gérer le fichier JSON
const jsonDbPlugin = () => ({
  name: 'simple-json-db',
  configureServer(server) {
    server.middlewares.use('/api/users', (req, res, next) => {
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
    jsonDbPlugin() // On ajoute notre plugin ici
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
