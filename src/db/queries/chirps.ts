import { eq } from "drizzle-orm"
import { db } from "../index.js"
import { NewChirp, chirps } from "../schema.js"

async function createChirp(chirp: NewChirp) {
  const [result] = await db.insert(chirps).values(chirp).returning()
  return result
}

async function getChirps() {
  const result = await db.select().from(chirps)
  return result
}

async function getChirp(id: string) {
  const [result] = await db.select().from(chirps).where(eq(chirps.id, id))
  return result
}

async function deleteChirp(id: string) {
  const rows = await db.delete(chirps).where(eq(chirps.id, id)).returning()
  return rows.length > 0
}

export { createChirp, getChirps, getChirp, deleteChirp }
