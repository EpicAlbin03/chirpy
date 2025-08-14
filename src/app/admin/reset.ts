import { Request, Response } from "express"
import { config } from "../../config.js"

async function handlerReset(req: Request, res: Response) {
  config.fileserverHits = 0
  res.status(200).send("OK")
}

export { handlerReset }
