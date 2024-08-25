import { AdapterAccountType } from "@auth/core/adapters";
import { boolean, timestamp, pgTable, text, primaryKey, integer } from "drizzle-orm/pg-core";

export const reward = pgTable("Rewards", {
  id: text("Id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("Name").notNull(),
  description: text("Description").notNull(),
  requiredPoints: integer("RequiredPoints").notNull(),
  image: text("Images").notNull(),
  quantity: integer("Quantity")
    .$default(() => 0)
    .notNull(),
  createdOn: timestamp("CreatedOn").defaultNow(),
  updatedOn: timestamp("UpdatedOn").defaultNow(),
});

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  earnedPoints: integer("earnedPoints").default(0),
  role: text("role"),
  Image: text("image"),
});

export const transactions = pgTable("Transactions", {
  id: text("Id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("UserId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  rewardId: text("RewardId")
    .notNull()
    .references(() => reward.id, { onDelete: "cascade" }),
  pointUsed: integer("PointUsed").notNull(),
  createdOn: timestamp("CreatedOn").defaultNow(),
  updatedOn: timestamp("UpdatedOn").defaultNow(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);
