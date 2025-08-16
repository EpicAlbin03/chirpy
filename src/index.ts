import express from "express"
import { handlerReadiness } from "./app/api/readiness.js"
import { middlewareLogResponses } from "./app/middleware/logging.js"
import { handlerMetrics } from "./app/admin/metrics.js"
import { middlewareMetricsInc } from "./app/middleware/metrics.js"
import { handlerReset } from "./app/admin/reset.js"
import {
  handlerCreateChirp,
  handlerDeleteChirp,
  handlerGetChirp,
  handlerGetChirps,
} from "./app/api/chirps.js"
import { middlewareErrorHandler } from "./app/middleware/errors.js"
import { config } from "./config.js"
import postgres from "postgres"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import { drizzle } from "drizzle-orm/postgres-js"
import { handlerCreateUser, handlerUpdateUser } from "./app/api/users.js"
import { handlerLogin, handlerRefreshToken, handlerRevokeToken } from "./app/api/auth.js"
import { handlerUpdateUserIsChirpyRed } from "./app/api/polka/webhooks.js"

const migrationClient = postgres(config.db.url, { max: 1 })
await migrate(drizzle(migrationClient), config.db.migrationConfig)

const app = express()
const PORT = 8080

app.use(middlewareLogResponses)
app.use(express.json())

app.use("/app", middlewareMetricsInc, express.static("./src/app"))

app.get("/admin/metrics", (req, res, next) => {
  Promise.resolve(handlerMetrics(req, res)).catch(next)
})
app.post("/admin/reset", (req, res, next) => {
  Promise.resolve(handlerReset(req, res)).catch(next)
})

app.get("/api/healthz", (req, res, next) => {
  Promise.resolve(handlerReadiness(req, res)).catch(next)
})

app.get("/api/chirps", (req, res, next) => {
  Promise.resolve(handlerGetChirps(req, res)).catch(next)
})
app.get("/api/chirps/:id", (req, res, next) => {
  Promise.resolve(handlerGetChirp(req, res)).catch(next)
})
app.post("/api/chirps", (req, res, next) => {
  Promise.resolve(handlerCreateChirp(req, res)).catch(next)
})
app.delete("/api/chirps/:id", (req, res, next) => {
  Promise.resolve(handlerDeleteChirp(req, res)).catch(next)
})

app.post("/api/users", (req, res, next) => {
  Promise.resolve(handlerCreateUser(req, res)).catch(next)
})
app.put("/api/users", (req, res, next) => {
  Promise.resolve(handlerUpdateUser(req, res)).catch(next)
})

app.post("/api/login", (req, res, next) => {
  Promise.resolve(handlerLogin(req, res)).catch(next)
})
app.post("/api/refresh", (req, res, next) => {
  Promise.resolve(handlerRefreshToken(req, res)).catch(next)
})
app.post("/api/revoke", (req, res, next) => {
  Promise.resolve(handlerRevokeToken(req, res)).catch(next)
})

app.post("/api/polka/webhooks", (req, res, next) => {
  Promise.resolve(handlerUpdateUserIsChirpyRed(req, res)).catch(next)
})

app.use(middlewareErrorHandler)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
