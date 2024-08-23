import { sql, eq } from "drizzle-orm";
import { db } from "../db/drizzle";
import { reward } from "../db/schema";

interface RewardInput {
  name: string;
  description: string;
  image: string;
  quantity: number;
  requiredPoints: number;
}

export async function getAllRewards(page: number = 1, pageSize: number = 10) {
  try {
    const offset = (page - 1) * pageSize;

    const rewards = await db.select().from(reward).limit(pageSize).offset(offset);

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

export async function createReward(input: RewardInput) {
  try {
    const [createdReward] = await db
      .insert(reward)
      .values({
        name: input.name,
        description: input.description,
        image: input.image,
        quantity: input.quantity!,
        requiredPoints: input.requiredPoints,
      })
      .returning();

    return createdReward;
  } catch (error) {
    console.error("Error creating reward:", error);
  }
}

export async function updateReward(id: string, input: RewardInput) {
  try {
    return db
      .update(reward)
      .set({
        name: input.name,
        description: input.description,
        image: input.image,
        quantity: input.quantity!,
        requiredPoints: input.requiredPoints,
      })
      .where(eq(reward.id, id))
      .returning();
  } catch (error) {
    console.log(error);
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
