import { Request, Response } from "express"
import { config } from "../../config.js"
import { deleteUsers } from "../../db/queries/users.js"
import { ForbiddenError } from "../middleware/errors.js"

async function handlerReset(req: Request, res: Response) {
  if (config.api.platform !== "dev") {
    console.log(config.api.platform)
    throw new ForbiddenError("Reset is only allowed in dev environment.")
  }

  config.api.fileserverHits = 0
  await deleteUsers()
  res.status(200).send("OK")
}

export { handlerReset }
