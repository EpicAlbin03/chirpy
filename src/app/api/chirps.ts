import { Request, Response } from "express"
import { respondWithJSON } from "./json.js"
import { BadRequestError, NotFoundError } from "../middleware/errors.js"
import { createChirp, getChirp, getChirps } from "../../db/queries/chirps.js"

async function handlerGetChirps(req: Request, res: Response) {
  const chirps = await getChirps()
  respondWithJSON(res, 200, chirps)
}

async function handlerGetChirp(req: Request, res: Response) {
  const chirp = await getChirp(req.params.id)

  if (!chirp) {
    throw new NotFoundError("Chirp not found")
  }

  respondWithJSON(res, 200, chirp)
}

async function handlerCreateChirp(req: Request, res: Response) {
  type Params = {
    body: string
    userId: string
  }

  let params = req.body as Params

  if (!params.userId || !params.body) {
    throw new BadRequestError("Missing required fields")
  }

  const maxChirpLength = 140
  if (params.body.length > maxChirpLength) {
    throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`)
  }

  const profanity = ["kerfuffle", "sharbert", "fornax"]
  for (const word of profanity) {
    const regex = new RegExp(word, "gi")
    params.body = params.body.replace(regex, "****")
  }

  const chirp = await createChirp({
    body: params.body,
    userId: params.userId,
  })

  respondWithJSON(res, 201, chirp)
}

export { handlerCreateChirp, handlerGetChirps, handlerGetChirp }
