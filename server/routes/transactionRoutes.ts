import { Hono } from "hono";
import { addTransaction, getTransactions } from "../service/transactionServices";

const transaction = new Hono();

transaction.post("/", async (c) => {
  try {
    const { userId, rewardId } = await c.req.json();

    if (!userId || !rewardId === undefined) {
      return c.json({ error: "Missing required fields" }, 400);
    }

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
      throw error; // Re-throw if it's not one of the expected errors
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
