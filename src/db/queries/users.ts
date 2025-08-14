import { eq } from "drizzle-orm"
import { db } from "../index.js"
import { NewUser, users } from "../schema.js"

async function createUser(user: NewUser) {
  const [result] = await db.insert(users).values(user).onConflictDoNothing().returning()
  return result
}

async function deleteUsers() {
  await db.delete(users)
}

async function getUserById(id: string) {
  const [result] = await db.select().from(users).where(eq(users.id, id))
  return result
}

async function getUserByEmail(email: string) {
  const [result] = await db.select().from(users).where(eq(users.email, email))
  return result
}

export { createUser, deleteUsers, getUserById, getUserByEmail }
