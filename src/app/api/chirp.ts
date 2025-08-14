import { Request, Response } from "express"
import { respondWithJSON } from "./json.js"
import { BadRequestError } from "../middleware/errors.js"

async function handlerValidateChirp(req: Request, res: Response) {
  type Params = {
    body: string
  }

  let params = req.body as Params

  const maxChirpLength = 140
  if (params.body.length > maxChirpLength) {
    throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`)
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
