import { Request, Response } from "express"

async function handlerReadiness(req: Request, res: Response) {
  res.set("Content-Type", "text/plain; charset=utf-8")
  res.status(200).send("OK")
}

export { handlerReadiness }
