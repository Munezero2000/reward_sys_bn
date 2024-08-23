import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { RewardSchema } from "../schema";

const reward = new Hono();

reward.post(
  "/",
  zValidator("form", RewardSchema, (result, c) => {
    if (!result.success) {
      return c.text(JSON.stringify(result.error.format()), 400);
    }
  }),
  async (c) => {
    const body = await c.req.parseBody();
    const images = body["images"];
    const description = body["description"] as string;
    const name = body["name"] as string;
    const quantity = body["name"] as string;
    const requiredPoints = body["requiredPoints"] as string;

    console.log(body);
    // console.log(images);
    return c.text("uploaded");
  }
);

export default reward;
