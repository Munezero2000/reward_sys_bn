import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { RewardSchema } from "../util/types";
import { createReward, deleteReward, getAllRewards, getRewardById } from "@/server/service/rewardServices";
import { uploadImageToCloudinary } from "../util";

const reward = new Hono();

// route for getting all rewards
reward.get("/", async (c) => {
  const user = c.get("authUser");
  console.log(user);
  if (!user) {
    return c.text("not authorized");
  }

  const page = c.req.query("page") ? parseInt(c.req.query("page")!) : 1;
  const pageSize = c.req.query("pageSize") ? parseInt(c.req.query("pageSize")!) : 10;

  try {
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
      const body = await c.req.parseBody();
      const rewardImage = body["image"] as File;
      const description = body["description"] as string;
      const name = body["name"] as string;
      const quantity = parseInt(body["quantity"] as string, 10);
      const requiredPoints = parseInt(body["requiredPoints"] as string, 10);

      // Upload image
      const imageUrl = await uploadImageToCloudinary(rewardImage);

      const reward = await createReward({ name, description, image: imageUrl, quantity, requiredPoints });

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

reward.put("/:id", async (c) => {
  try {
    const { id } = c.req.param();
    let imageUrl: string;

    // checking  for reward existance
    const returnedReward = await getRewardById(id);

    if (!returnedReward) {
      return c.json({
        message: "Reward not found",
      });
    }

    const body = await c.req.parseBody();
    const rewardImage = body["image"] as File;
    const description = (body["description"] as string) || returnedReward.description;
    const name = (body["name"] as string) || returnedReward.name;
    const quantity = parseInt(body["quantity"] as string, 10) || returnedReward.quantity;
    const requiredPoints = parseInt(body["requiredPoints"] as string, 10) || returnedReward.requiredPoints;

    // checking if the image is present and reassigning new otherwise keep existing one
    rewardImage ? (imageUrl = await uploadImageToCloudinary(rewardImage)) : (imageUrl = returnedReward.image);

    const reward = await createReward({ name, description, image: imageUrl, quantity, requiredPoints });

    return c.json({
      message: "Reward details updated successfully",
      data: reward,
    });
  } catch (error) {
    console.log(error);
    return c.json({ message: "Internal server Error" }, 500);
  }
});

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
