import { timestamp, pgTable, text, integer, index } from "drizzle-orm/pg-core";

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
  password: text("password").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  earnedPoints: integer("earnedPoints").default(1000),
  role: text("role").default("user"),
  Image: text("image"),
});

export const transactions = pgTable(
  "Transactions",
  {
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
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
    rewardIdIdx: index("reward_id_idx").on(table.rewardId),
  })
);
