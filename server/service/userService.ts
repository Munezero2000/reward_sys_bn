import { User } from "@auth/core/types";
import { users } from "../db/schema";
import { db } from "../db/drizzle";
import { asc, desc } from "drizzle-orm";

export async function getTopUsers(): Promise<User[]> {
  try {
    return await db.select().from(users).orderBy(desc(users.earnedPoints)).limit(10);
  } catch (error) {
    console.error("Error fetching users sorted by earned points:", error);
    throw error;
  }
}
