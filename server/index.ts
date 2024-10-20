import { Hono } from "hono";
import { logger } from "hono/logger";
import reward from "./routes/rewardRoutes";
import { v2 as cloudinary } from "cloudinary";
import transaction from "./routes/transactionRoutes";
import user from "./routes/userRoutes";
import { cors } from "hono/cors";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.use(logger());
app.use(
  "*",
  cors({
    origin: (origin) => origin,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "x-auth-return-redirect", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

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
app.route("/transactions", transaction);
app.route("/users", user);

export default app;
