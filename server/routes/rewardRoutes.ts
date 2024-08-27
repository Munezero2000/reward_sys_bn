import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { GetRewardsQuerySchema, RewardSchema, UpdateRewardSchema } from "../util/types";
import {
  createReward,
  deleteReward,
  getAllRewards,
  getRewardById,
  updateReward,
} from "@/server/service/rewardServices";

const reward = new Hono();

// route for getting all rewards
reward.get("/", zValidator("query", GetRewardsQuerySchema), async (c) => {
  try {
    const { page, pageSize } = c.req.valid("query");
    const result = await getAllRewards(page, pageSize);
    return c.json(result);
  } catch (error) {
    console.error("Error in reward GET handler:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

reward.get("/:id", async (c) => {
  const { id } = c.req.param();
  const reward = await getRewardById(id);
  if (!reward) {
    return c.json({ message: "reward not found" }, 404);
  }
  return c.json(reward);
});

// route for adding a new reward
reward.post(
  "/",
  zValidator("form", RewardSchema, (result, c) => {
    if (!result.success) {
      return c.json({ errors: result.error.format() }, 400);
    }
  }),
  async (c) => {
    try {
      const rewardInput = c.req.valid("form");

      const reward = await createReward(rewardInput);

      return c.json(
        {
          message: "Reward added successfully",
          data: reward,
        },
        201
      );
    } catch (error) {
      console.error("Error processing reward:", error);
      return c.json({ error: "Failed to process reward" }, 500);
    }
  }
);

reward.put(
  "/:id",
  zValidator("form", UpdateRewardSchema, (result, c) => {
    if (!result.success) {
      return c.json({ errors: result.error.format() }, 400);
    }
  }),
  async (c) => {
    try {
      const { id } = c.req.param();

      // checking  for reward existance
      const returnedReward = await getRewardById(id);

      if (!returnedReward) {
        return c.json({
          message: "Reward not found",
        });
      }

      const rewardInput = c.req.valid("form");

      const reward = await updateReward(id, rewardInput);

      return c.json({
        message: "Reward details updated successfully",
        data: reward,
      });
    } catch (error) {
      console.log(error);
      return c.json({ message: "Internal server Error" }, 500);
    }
  }
);

reward.delete("/:id", async (c) => {
  const { id } = c.req.param();

  // check if reward exists
  const reward = await getRewardById(id);

  if (reward) {
    await deleteReward(id);
    return c.json({ message: "Reward deleted successfully" });
  } else {
    return c.json({ message: "Reward not found" });
  }
});

export default reward;
