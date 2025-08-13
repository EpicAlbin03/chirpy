import express from "express"
import { handlerReadiness } from "./app/api/readiness.js"
import { middlewareLogResponses } from "./app/middleware/logging.js"
import { handlerMetrics } from "./app/api/metrics.js"
import { middlewareMetricsInc } from "./app/middleware/metrics.js"
import { handlerReset } from "./app/api/reset.js"

const app = express()
const PORT = 8080

app.use(middlewareLogResponses)

app.use("/app", middlewareMetricsInc, express.static("./src/app"))

app.get("/healthz", handlerReadiness)
app.get("/metrics", handlerMetrics)
app.get("/reset", handlerReset)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
