import { Request, Response } from "express"
import { config } from "../../config.js"

async function handlerMetrics(req: Request, res: Response) {
  res.set("Content-Type", "text/html; charset=utf-8")
  const resp = `<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.fileserverHits} times!</p>
  </body>
</html>`
  res.status(200).send(resp)
}

export { handlerMetrics }
