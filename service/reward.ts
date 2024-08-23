import { db } from "../server/db/drizzle";
import { reward } from "../server/db/schema";

export const createReward = async (
  description: string,
  images: string[],
  name: string,
  quantity: number,
  requiredPoints: number
) => {
  try {
    return db.insert(reward).values({ name, description, requiredPoints, images, quantity });
  } catch (error) {
    console.log(error);
  }
};
