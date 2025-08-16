import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import { BadRequestError, UnauthorizedError } from "./app/middleware/errors.js"
import { Request } from "express"
import crypto from "node:crypto"

const TOKEN_ISSUER = "chirpy"

async function hashPassword(password: string) {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

async function checkPasswordHash(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">

function makeJWT(userID: string, expiresIn: number, secret: string): string {
  const issuedAt = Math.floor(Date.now() / 1000)
  const expiresAt = issuedAt + expiresIn
  const token = jwt.sign(
    {
      iss: TOKEN_ISSUER, // issuer
      sub: userID, // subject (user id)
      iat: issuedAt, // issued at
      exp: expiresAt, // expires at
    } satisfies Payload,
    secret,
    { algorithm: "HS256" }
  )

  return token
}

function validateJWT(tokenString: string, secret: string): string {
  let decoded: Payload
  try {
    decoded = jwt.verify(tokenString, secret) as JwtPayload
  } catch (e) {
    throw new UnauthorizedError("Invalid token")
  }

  if (decoded.iss !== TOKEN_ISSUER) {
    throw new UnauthorizedError("Invalid issuer")
  }

  if (!decoded.sub) {
    throw new UnauthorizedError("No user ID in token")
  }

  return decoded.sub
}

function getBearerToken(req: Request): string {
  const authHeader = req.get("Authorization")
  if (!authHeader) {
    throw new UnauthorizedError("Malformed authorization header")
  }

  return extractBearerToken(authHeader)
}

function extractBearerToken(header: string) {
  if (!header || header.trim() === "") {
    throw new BadRequestError("Malformed authorization header")
  }

  const splitAuth = header.split(" ")
  if (splitAuth.length < 2 || splitAuth[0] !== "Bearer") {
    throw new BadRequestError("Malformed authorization header")
  }
  return splitAuth[1]
}

function makeRefreshToken(): string {
  const randomBytes = crypto.randomBytes(32)
  const token = randomBytes.toString("hex")
  return token
}

function getAPIKey(req: Request): string {
  const authHeader = req.get("Authorization")
  if (!authHeader) {
    throw new UnauthorizedError("Malformed authorization header")
  }

  return extractAPIKey(authHeader)
}

function extractAPIKey(header: string) {
  if (!header || header.trim() === "") {
    throw new BadRequestError("Malformed authorization header")
  }

  const splitAuth = header.split(" ")
  if (splitAuth.length < 2 || splitAuth[0] !== "ApiKey") {
    throw new BadRequestError("Malformed authorization header")
  }
  return splitAuth[1]
}

export {
  hashPassword,
  checkPasswordHash,
  makeJWT,
  validateJWT,
  getBearerToken,
  extractBearerToken,
  makeRefreshToken,
  getAPIKey,
  extractAPIKey,
}
