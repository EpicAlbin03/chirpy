import { Request, Response } from "express"
import { BadRequestError, NotFoundError, UnauthorizedError } from "../../middleware/errors.js"
import { updateUserIsChirpyRed } from "../../../db/queries/users.js"
import { getAPIKey } from "../../../auth.js"
import { config } from "../../../config.js"

async function handlerUpdateUserIsChirpyRed(req: Request, res: Response) {
  type Params = {
    event: string
    data: {
      userId: string
    }
  }

  const apiKey = getAPIKey(req)
  if (apiKey !== config.api.polkaKey) {
    throw new UnauthorizedError("Invalid API key")
  }

  let params = req.body as Params

  if (!params.event || !params.data.userId) {
    throw new BadRequestError("Missing required fields")
  }

  if (params.event !== "user.upgraded") {
    res.status(204).send()
    return
  }

  const user = await updateUserIsChirpyRed(params.data.userId, true)

  if (!user) {
    throw new NotFoundError("User not found")
  }

  res.status(204).send()
}

export { handlerUpdateUserIsChirpyRed }
