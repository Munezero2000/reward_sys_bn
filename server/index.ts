import { Hono } from "hono";
import { logger } from "hono/logger";
import reward from "./route.ts/reward";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.use(logger());

app.use(async (_c, next) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
  await next();
});

// Endpoints
app.route("/rewards", reward);

export default app;
