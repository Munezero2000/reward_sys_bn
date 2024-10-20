import { z } from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

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

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5, { message: "Password must be at least 5 characters long" }),
});

export const UpdateRewardSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Reward name must be at least 3 characters long" })
    .max(100, { message: "Reward name can't exceed 100 characters" })
    .optional(),
  description: z
    .string()
    .min(1, { message: "Write a little description about this reward" })
    .max(255, { message: "Description can't exceed 255 characters" })
    .optional(),
  requiredPoints: z.preprocess(
    (val) => (val === undefined ? undefined : Number(val)),
    z
      .number({ required_error: "Required points is required" })
      .int({ message: "Required points must be an integer" })
      .positive({ message: "Required points must be positive" })
      .optional()
  ),
  image: z
    .instanceof(File, { message: "Image must be a file" })
    .refine((file) => file.size <= MAX_IMAGE_SIZE, `Max image size is 5MB`)
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only .jpg, .png, and .webp formats are supported."
    )
    .optional(),
  quantity: z.preprocess(
    (val) => (val === undefined ? undefined : Number(val)),
    z
      .number({ required_error: "Quantity is required" })
      .int({ message: "Quantity must be an integer" })
      .positive({ message: "Quantity must be positive" })
      .optional()
  ),
});

export const GetRewardsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(10),
});

export const createUserSchema = z.object({
  name: z.string().max(100, { message: "Name cannot exceed 100 characters" }),
  email: z.string().email({ message: "Invalid email address" }).max(255),
  password: z.string().min(5, { message: "Password must be at least 5 characters long" }),
  emailVerified: z.date().nullable().optional(),
  earnedPoints: z.number().int().nonnegative().default(1000).optional(),
  role: z.enum(["user", "admin"]).default("user"),
  Image: z.string().url({ message: "Invalid image URL" }).optional(),
});

export const createTransactionSchema = z.object({
  userId: z.string(),
  rewardId: z.string(),
});
