import { z } from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export const RewardSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Reward name must be at least 3 characters long" })
    .max(100, { message: "Reward name can't exceed 100 characters" }),
  description: z
    .string()
    .min(1, { message: "Write a little description about this reward" })
    .max(255, { message: "Description can't exceed 255 characters" }),
  requiredPoints: z.preprocess(
    (val) => Number(val),
    z
      .number({ required_error: "Required points is required" })
      .int({ message: "Required points must be an integer" })
      .positive({ message: "Required points must be positive" })
  ),
  image: z
    .instanceof(File, { message: "Image must be a file" })
    .refine((file) => file.size <= MAX_IMAGE_SIZE, `Max image size is 5MB`)
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only .jpg, .png, and .webp formats are supported."
    ),
  quantity: z.preprocess(
    (val) => Number(val),
    z
      .number({ required_error: "Quantity is required" })
      .int({ message: "Quantity must be an integer" })
      .positive({ message: "Quantity must be positive" })
  ),
});
