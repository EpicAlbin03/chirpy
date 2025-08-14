import { Request, Response } from "express"
import { respondWithJSON } from "./json.js"
import { BadRequestError, NotFoundError, UnauthorizedError } from "../middleware/errors.js"
import { createChirp, getChirp, getChirps } from "../../db/queries/chirps.js"
import { getBearerToken, validateJWT } from "../../auth.js"
import { config } from "../../config.js"

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
  }

  let params = req.body as Params

  if (!params.body) {
    throw new BadRequestError("Missing required fields")
  }

  const token = getBearerToken(req)
  const userId = validateJWT(token, config.jwt.secret)

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
    userId: userId,
  })

  respondWithJSON(res, 201, chirp)
}

export { handlerCreateChirp, handlerGetChirps, handlerGetChirp }
