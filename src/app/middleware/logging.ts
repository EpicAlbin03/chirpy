import { NextFunction, Request, Response } from "express"

function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
  res.on("finish", () => {
    if (res.statusCode >= 400) {
      console.log(`[NON-OK] ${req.method} ${req.originalUrl} - Status: ${res.statusCode}`)
    }
  })
  next()
}

export { middlewareLogResponses }
