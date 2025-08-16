import { NextFunction, Request, Response } from "express"
import { respondWithError } from "../api/json.js"

class BadRequestError extends Error {
  constructor(message: string) {
    super(message)
  }
}

class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message)
  }
}

class ForbiddenError extends Error {
  constructor(message: string) {
    super(message)
  }
}

class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
  }
}

function middlewareErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof BadRequestError) {
    respondWithError(res, 400, err.message)
  } else if (err instanceof UnauthorizedError) {
    respondWithError(res, 401, err.message)
  } else if (err instanceof ForbiddenError) {
    respondWithError(res, 403, err.message)
  } else if (err instanceof NotFoundError) {
    respondWithError(res, 404, err.message)
  } else {
    console.log(err.message)
    respondWithError(res, 500, "Internal Server Error")
  }
}

export { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError }
export { middlewareErrorHandler }
