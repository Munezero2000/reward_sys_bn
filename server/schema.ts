import { z } from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const RewardSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Reward must be at least 3 characters long" })
    .max(100, { message: "Reward can't exceed 100 characters" }),
  description: z.string().min(1, { message: "Write a little description about this reward" }).max(255),
  requiredPoints: z.preprocess((val) => Number(val), z.number({ message: "required points must be a number" })),
  images: z.any().refine((file) => file?.size <= MAX_IMAGE_SIZE, `Max image size is ${MAX_IMAGE_SIZE}.`),
  quantity: z.preprocess((val) => Number(val), z.number({ message: "Available quantity is required" }).positive()),
});
