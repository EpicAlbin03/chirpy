import { Request, Response } from "express"
import { respondWithError, respondWithJSON } from "./json.js"
import { createUser } from "../../db/queries/users.js"
import { NewUser, User } from "../../db/schema.js"
import { BadRequestError } from "../middleware/errors.js"
import { hashPassword } from "../../auth.js"

type UserResponse = Omit<User, "hashedPassword">

async function handlerCreateUser(req: Request, res: Response) {
  type Params = {
    email: string
    password: string
  }

  let params = req.body as Params

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

export type { UserResponse }
export { handlerCreateUser }
