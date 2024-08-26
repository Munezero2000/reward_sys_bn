import { Hono } from "hono";
import { addTransaction } from "../service/transactionServices";

const transaction = new Hono();

transaction.post("/", async (c) => {
  try {
    const { userId, rewardId } = await c.req.json();

    if (!userId || !rewardId === undefined) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    await addTransaction({ userId, rewardId });

    return c.json({ message: "Transaction recorded successfully" }, 201);
  } catch (error) {
    console.error("Error processing transaction:", error);
    return c.json({ error: "Failed to process transaction" }, 500);
  }
});

export default transaction;
