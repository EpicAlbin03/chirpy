import { Request, Response } from "express"
import { config } from "../../config.js"

function handlerMetrics(req: Request, res: Response) {
  const resp = `Hits: ${config.fileserverHits}`
  res.status(200).send(resp)
}

export { handlerMetrics }
