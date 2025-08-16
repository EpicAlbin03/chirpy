import { Request, Response } from "express"
import { respondWithJSON } from "./json.js"
import { getUserByEmail } from "../../db/queries/users.js"
import { BadRequestError, NotFoundError, UnauthorizedError } from "../middleware/errors.js"
import { checkPasswordHash, getBearerToken, makeJWT, makeRefreshToken } from "../../auth.js"
import { config } from "../../config.js"
import { UserResponse } from "./users.js"
import {
  getUserByRefreshToken,
  revokeRefreshToken,
  saveRefreshToken,
} from "../../db/queries/tokens.js"

type LoginResponse = UserResponse & {
  token: string
  refreshToken: string
}

async function handlerLogin(req: Request, res: Response) {
  type Params = {
    email: string
    password: string
  }

  let params = req.body as Params

  if (!params.email || !params.password) {
    throw new BadRequestError("Missing required fields")
  }

  const user = await getUserByEmail(params.email)
  if (!user) {
    throw new NotFoundError("User not found")
  }

  const matching = await checkPasswordHash(params.password, user.hashedPassword)
  if (!matching) {
    throw new UnauthorizedError("Invalid password")
  }

  const accessToken = makeJWT(user.id, config.jwt.defaultDuration, config.jwt.secret)
  const refreshToken = makeRefreshToken()

  const saved = await saveRefreshToken(user.id, refreshToken)
  if (!saved) {
    throw new UnauthorizedError("could not save refresh token")
  }

  respondWithJSON(res, 200, {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    token: accessToken,
    refreshToken,
    isChirpyRed: user.isChirpyRed,
  } satisfies LoginResponse)
}

async function handlerRefreshToken(req: Request, res: Response) {
  let refreshToken = getBearerToken(req)

  const result = await getUserByRefreshToken(refreshToken)
  if (!result) {
    throw new UnauthorizedError("invalid refresh token")
  }

  const user = result.user
  const accessToken = makeJWT(user.id, config.jwt.defaultDuration, config.jwt.secret)

  type Response = {
    token: string
  }

  respondWithJSON(res, 200, {
    token: accessToken,
  } satisfies Response)
}

async function handlerRevokeToken(req: Request, res: Response) {
  const refreshToken = getBearerToken(req)
  await revokeRefreshToken(refreshToken)
  res.status(204).send()
}

export { handlerLogin, handlerRefreshToken, handlerRevokeToken }
