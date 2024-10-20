import { User } from "@auth/core/types";
import { users } from "../db/schema";
import { db } from "../db/drizzle";
import { desc, eq } from "drizzle-orm";
import { createUserSchema } from "../util/types";
import { hash } from "bcrypt";
import { z } from "zod";

export async function getTopUsers(): Promise<User[]> {
  try {
    return await db.select().from(users).orderBy(desc(users.earnedPoints)).limit(10);
  } catch (error) {
    console.error("Error fetching users sorted by earned points:", error);
    throw error;
  }
}

export async function signIn() {}

export async function createUserAccount(userData: z.infer<typeof createUserSchema>) {
  try {
    // Validate user data
    const validatedData = createUserSchema.parse(userData);

    // Hash the password
    const hashedPassword = await hash(validatedData.password, 10);

    // Insert user into the database
    const newUser = await db
      .insert(users)
      .values({
        ...validatedData,
        password: hashedPassword,
      })
      .returning();

    // Return the created user (excluding the password)
    const { password, ...userWithoutPassword } = newUser[0];
    return userWithoutPassword;
  } catch (error) {
    console.error("Error creating user account:", error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await db.query.users.findFirst({ where: eq(users.email, email) });
    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
}
