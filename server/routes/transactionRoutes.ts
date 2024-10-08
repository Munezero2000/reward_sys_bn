import { Hono } from "hono";
import { addTransaction, getTransactions } from "../service/transactionServices";
import { createTransactionSchema } from "../util/types";
import { zValidator } from "@hono/zod-validator";

const transaction = new Hono();

transaction.post("/", zValidator("json", createTransactionSchema), async (c) => {
  try {
    const { userId, rewardId } = c.req.valid("json");

    try {
      await addTransaction({ userId, rewardId });
      return c.json({ message: "You have successfully redeemed your reward" }, 201);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Insufficient points") {
          return c.json({ error: "You don't have enough points to redeem this reward" }, 400);
        } else if (error.message === "Reward out of stock") {
          return c.json({ error: "This reward is currently out of stock" }, 400);
        }
      }
      throw error;
    }
  } catch (error) {
    console.error("Error processing transaction:", error);
    return c.json({ error: "Failed to process transaction" }, 500);
  }
});

transaction.get("/", async (c) => {
  try {
    const userId = c.req.query("userId");

    if (!userId) {
      return c.json({ error: "Missing userId parameter" }, 400);
    }

    const transactions = await getTransactions(userId);
    return c.json(transactions, 200);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return c.json({ error: "Failed to fetch transactions" }, 500);
  }
});

export default transaction;
