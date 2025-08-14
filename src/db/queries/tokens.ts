import { and, eq, gt, isNull } from "drizzle-orm"
import { db } from "../index.js"
import { refreshTokens, users } from "../schema.js"
import { config } from "../../config.js"

async function saveRefreshToken(userId: string, token: string) {
  const rows = await db
    .insert(refreshTokens)
    .values({
      userId: userId,
      token: token,
      expiresAt: new Date(Date.now() + config.jwt.refreshDuration),
      revokedAt: null,
    })
    .returning()

  return rows.length > 0
}

async function getUserByRefreshToken(token: string) {
  const [result] = await db
    .select({ user: users })
    .from(users)
    .innerJoin(refreshTokens, eq(users.id, refreshTokens.userId))
    .where(
      and(
        eq(refreshTokens.token, token),
        isNull(refreshTokens.revokedAt),
        gt(refreshTokens.expiresAt, new Date())
      )
    )
    .limit(1)

  return result
}

async function revokeRefreshToken(token: string) {
  const rows = await db
    .update(refreshTokens)
    .set({ expiresAt: new Date() })
    .where(eq(refreshTokens.token, token))
    .returning()

  if (rows.length === 0) {
    throw new Error("Couldn't revoke token")
  }
}

export { saveRefreshToken, getUserByRefreshToken, revokeRefreshToken }
