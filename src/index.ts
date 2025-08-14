import express from "express"
import { handlerReadiness } from "./app/api/readiness.js"
import { middlewareLogResponses } from "./app/middleware/logging.js"
import { handlerMetrics } from "./app/admin/metrics.js"
import { middlewareMetricsInc } from "./app/middleware/metrics.js"
import { handlerReset } from "./app/admin/reset.js"
import { handlerValidateChirp } from "./app/api/chirp.js"

const app = express()
const PORT = 8080

app.use(middlewareLogResponses)
app.use(express.json())

app.use("/app", middlewareMetricsInc, express.static("./src/app"))

app.get("/admin/metrics", handlerMetrics)
app.post("/admin/reset", handlerReset)

app.get("/api/healthz", handlerReadiness)
app.post("/api/validate_chirp", handlerValidateChirp)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
