import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Database from 'better-sqlite3'
import path from 'node:path'

// On recrée __dirname
const __dirname = fileURLToPath(new URL('.', import.meta.url))

// Plugin personnalisé SQL
const sqlDbPlugin = () => ({
  name: 'sqlite-db-middleware',
  configureServer(server) {
    // Initialisation de la BDD
    const dbPath = path.resolve(__dirname, 'database.sqlite')
    const db = new Database(dbPath)

    // Création de la table si elle n'existe pas
    // On stocke les favoris sous forme de texte JSON car SQLite n'a pas de type ARRAY natif simple
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        favorites TEXT
      )
    `)

    server.middlewares.use('/api/users', (req, res, next) => {

      if (req.method === 'GET') {
        try {
          // LECTURE : SELECT SQL
          const stmt = db.prepare('SELECT username, password, favorites FROM users')
          const rows = stmt.all()

          // On doit "parser" les favoris qui sont stockés en string dans la BDD
          const usersFormatted = rows.map(user => ({
            username: user.username,
            password: user.password,
            favorites: JSON.parse(user.favorites || '[]')
          }))

          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(usersFormatted))
        } catch (error) {
          console.error('Erreur SQL (GET):', error)
          res.statusCode = 500
          res.end(JSON.stringify({ error: error.message }))
        }

      } else if (req.method === 'POST') {
        let body = ''
        req.on('data', chunk => { body += chunk.toString() })
        req.on('end', () => {
          try {
            const usersList = JSON.parse(body)

            // ÉCRITURE : Transaction SQL
            // Comme le front envoie TOUTE la liste, on vide et on remplit (méthode simple pour dev)
            const insert = db.prepare('INSERT INTO users (username, password, favorites) VALUES (?, ?, ?)')
            const deleteAll = db.prepare('DELETE FROM users')

            // On exécute tout dans une transaction pour la sécurité des données
            const transaction = db.transaction((users) => {
              deleteAll.run()
              for (const user of users) {
                insert.run(user.username, user.password, JSON.stringify(user.favorites))
              }
            })

            transaction(usersList)

            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true }))
          } catch (error) {
            console.error('Erreur SQL (POST):', error)
            res.statusCode = 500
            res.end(JSON.stringify({ error: error.message }))
          }
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
    sqlDbPlugin() // On active le nouveau plugin SQL
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
