import { Request, Response } from "express"
import { respondWithJSON } from "./json.js"
import { createUser } from "../../db/queries/users.js"
import { NewUser } from "../../db/schema.js"
import { BadRequestError } from "../middleware/errors.js"

async function handlerCreateUser(req: Request, res: Response) {
  type Params = {
    email: string
  }

  let params = req.body as Params

  if (!params.email) {
    throw new BadRequestError("Missing required fields")
  }

  const newUser = {
    email: params.email,
  } satisfies NewUser

  const user = await createUser(newUser)

  if (!user) {
    throw new Error("Could not create user")
  }

  respondWithJSON(res, 201, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  })
}

export { handlerCreateUser }
