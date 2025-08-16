import { Request, Response } from "express"
import { respondWithError, respondWithJSON } from "./json.js"
import { createUser, updateUser } from "../../db/queries/users.js"
import { NewUser, User } from "../../db/schema.js"
import { BadRequestError, NotFoundError } from "../middleware/errors.js"
import { getBearerToken, hashPassword, validateJWT } from "../../auth.js"
import { config } from "../../config.js"

type UserResponse = Omit<User, "hashedPassword">

async function handlerCreateUser(req: Request, res: Response) {
  type Params = {
    email: string
    password: string
  }

  const params = req.body as Params

  if (!params.email || !params.password) {
    throw new BadRequestError("Missing required fields")
  }

  const hashedPassword = await hashPassword(params.password)

  const newUser = {
    email: params.email,
    hashedPassword,
  } satisfies NewUser

  const user = await createUser(newUser)

  if (!user) {
    respondWithError(res, 500, "Could not create user")
  }

  respondWithJSON(res, 201, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  } satisfies UserResponse)
}

async function handlerUpdateUser(req: Request, res: Response) {
  type Params = {
    email: string
    password: string
  }

  const token = getBearerToken(req)
  const subject = validateJWT(token, config.jwt.secret)

  const params = req.body as Params

  if (!params.email || !params.password) {
    throw new BadRequestError("Missing required fields")
  }

  const hashedPassword = await hashPassword(params.password)

  const user = await updateUser(subject, params.email, hashedPassword)

  if (!user) {
    throw new NotFoundError("User not found")
  }

  respondWithJSON(res, 200, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  } satisfies UserResponse)
}

export type { UserResponse }
export { handlerCreateUser, handlerUpdateUser }
