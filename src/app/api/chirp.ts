import { Request, Response } from "express"
import { respondWithError, respondWithJSON } from "./json.js"

function handlerValidateChirp(req: Request, res: Response) {
  type Params = {
    body: string
  }

  let params = req.body as Params

  const maxChirpLength = 140
  if (params.body.length > maxChirpLength) {
    respondWithError(res, 400, "Chirp is too long")
    return
  }

  const profanity = ["kerfuffle", "sharbert", "fornax"]
  for (const word of profanity) {
    const regex = new RegExp(word, "gi")
    params.body = params.body.replace(regex, "****")
  }

  respondWithJSON(res, 200, {
    cleanedBody: params.body,
  })
}

export { handlerValidateChirp }
