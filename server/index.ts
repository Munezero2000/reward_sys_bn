import { Hono } from "hono";
import { logger } from "hono/logger";
import reward from "./routes/rewardRoutes";
import { v2 as cloudinary } from "cloudinary";
import { authHandler, initAuthConfig, verifyAuth } from "@hono/auth-js";
import transaction from "./routes/transactionRoutes";
import user from "./routes/userRoutes";
import { getAuthConfig } from "./util/auth";
import { cors } from "hono/cors";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.use(logger());
app.use(
  "*",
  cors({
    origin: ["http://localhost:3001", "http://localhost:3000"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
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

app.use("*", initAuthConfig(getAuthConfig));

app.use("/auth/*", authHandler());

app.use("/v1/*", verifyAuth());

// Endpoints
app.route("/rewards", reward);
app.route("/transactions", transaction);
app.route("/users", user);

export default app;
