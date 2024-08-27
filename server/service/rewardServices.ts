import { sql, eq, gt, desc } from "drizzle-orm";
import { db } from "../db/drizzle";
import { reward } from "../db/schema";
import { uploadImageToCloudinary } from "../util";
import { RewardSchema, UpdateRewardSchema } from "../util/types";
import { z } from "zod";

export async function getAllRewards(page: number = 1, pageSize: number = 10) {
  try {
    const offset = (page - 1) * pageSize;

    const rewards = await db
      .select()
      .from(reward)
      .orderBy(desc(reward.createdOn))
      .where(gt(reward.quantity, 0))
      .limit(pageSize)
      .offset(offset);

    const totalCount = await db.select({ count: sql`count(*)` }).from(reward);

    return {
      rewards,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems: totalCount[0].count,
        totalPages: Math.ceil((totalCount[0].count as number) / pageSize),
      },
    };
  } catch (error) {
    console.error("Error fetching rewards:", error);
    throw error;
  }
}

export async function getRewardById(id: string) {
  try {
    return await db.query.reward.findFirst({ where: eq(reward.id, id) });
  } catch (error) {
    console.error("Error fetching reward by ID:", error);
    throw error;
  }
}

export async function createReward(input: z.infer<typeof RewardSchema>) {
  try {
    // Upload image
    const imageUrl = await uploadImageToCloudinary(input.image);
    const [createdReward] = await db
      .insert(reward)
      .values({
        name: input.name,
        description: input.description,
        image: imageUrl,
        quantity: input.quantity!,
        requiredPoints: input.requiredPoints,
      })
      .returning();

    return createdReward;
  } catch (error) {
    console.error("Error creating reward:", error);
  }
}

export async function updateReward(id: string, input: z.infer<typeof UpdateRewardSchema>) {
  try {
    let updateData: Partial<typeof reward.$inferInsert> = {};

    // Add fields to updateData only if they are present in the input
    if (input.name) updateData.name = input.name;
    if (input.description) updateData.description = input.description;
    if (input.requiredPoints) updateData.requiredPoints = input.requiredPoints;
    if (input.quantity !== undefined) updateData.quantity = input.quantity;

    // Handle image upload if present
    if (input.image) {
      const imageUrl = await uploadImageToCloudinary(input.image);
      updateData.image = imageUrl;
    }

    return db.update(reward).set(updateData).where(eq(reward.id, id)).returning();
  } catch (error) {
    console.error("Error updating reward:", error);
    throw error;
  }
}

export async function deleteReward(id: string) {
  try {
    return await db.delete(reward).where(eq(reward.id, id)).returning();
  } catch (error) {
    console.error("Error fetching reward by ID:", error);
    throw error;
  }
}
