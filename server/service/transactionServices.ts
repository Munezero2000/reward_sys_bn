import { db } from "../db/drizzle";
import { reward, transactions, users } from "../db/schema";
import { eq } from "drizzle-orm";

export const addTransaction = async ({ userId, rewardId }: { userId: string; rewardId: string }) => {
  try {
    return await db.transaction(async (tx) => {
      // Get current user points and reward details
      const [[user], [rewardDetails]] = await Promise.all([
        tx.select({ earnedPoints: users.earnedPoints }).from(users).where(eq(users.id, userId)),
        tx
          .select({ points: reward.requiredPoints, availableQuantity: reward.quantity })
          .from(reward)
          .where(eq(reward.id, rewardId)),
      ]);

      if (!user || !rewardDetails) {
        throw new Error("User or reward not found");
      }

      const pointsNeeded = rewardDetails.points;
      const availableQuantity = rewardDetails.availableQuantity;

      if (user.earnedPoints! < pointsNeeded) {
        throw new Error("Insufficient points");
      }

      if (availableQuantity <= 0) {
        throw new Error("Reward out of stock");
      }

      // Update user's earned points
      await tx
        .update(users)
        .set({ earnedPoints: user.earnedPoints! - pointsNeeded })
        .where(eq(users.id, userId));

      // Update reward's available quantity
      await tx
        .update(reward)
        .set({ quantity: availableQuantity - 1 })
        .where(eq(reward.id, rewardId));

      // Insert transaction
      return tx.insert(transactions).values({ userId, rewardId, pointUsed: pointsNeeded });
    });
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error;
  }
};

export const getTransactions = async (userId: string) => {
  try {
    const userTransactions = await db
      .select({
        id: transactions.id,
        pointUsed: transactions.pointUsed,
        createdAt: transactions.createdOn,
        rewardName: reward.name,
      })

      .from(transactions)
      .leftJoin(reward, eq(transactions.rewardId, reward.id))
      .where(eq(transactions.userId, userId))
      .orderBy(transactions.createdOn);

    return userTransactions.map((transaction) => ({
      id: transaction.id,
      rewardName: transaction.rewardName,
      pointUsed: transaction.pointUsed,
      createdAt: transaction.createdAt,
    }));
  } catch (error) {
    console.error("Error retrieving user transactions:", error);
    throw error;
  }
};
