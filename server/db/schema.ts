import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const reward = pgTable("Rewards", {
  id: text("Id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("Name").notNull(),
  description: text("Description").notNull(),
  requiredPoints: integer("RequiredPoints").notNull(),
  images: jsonb("Images").notNull(),
  quantity: integer("Quantity").$default(() => 0),
  createdOn: timestamp("CreatedOn").defaultNow(),
  updatedOn: timestamp("UpdatedOn").defaultNow(),
});
