import { pgTable, timestamp, varchar, uuid, boolean } from "drizzle-orm/pg-core"

type User = typeof users.$inferSelect
type NewUser = typeof users.$inferInsert
const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  email: varchar("email", { length: 256 }).unique().notNull(),
  hashedPassword: varchar("hashed_password", { length: 256 }).notNull().default("unset"),
  isChirpyRed: boolean("is_chirpy_red").notNull().default(false),
})

type Chirp = typeof chirps.$inferSelect
type NewChirp = typeof chirps.$inferInsert
const chirps = pgTable("chirps", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  body: varchar("body", { length: 256 }).notNull(),
  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
})

type RefreshToken = typeof refreshTokens.$inferSelect
const refreshTokens = pgTable("refresh_tokens", {
  token: varchar("token", { length: 256 }).primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  revokedAt: timestamp("revoked_at"),
})

export type { NewUser, User, NewChirp, Chirp, RefreshToken }
export { users, chirps, refreshTokens }
