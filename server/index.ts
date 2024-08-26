import { Hono, Context } from "hono";
import { logger } from "hono/logger";
import reward from "./routes/reward";
import { v2 as cloudinary } from "cloudinary";
import { authHandler, initAuthConfig, verifyAuth, type AuthConfig } from "@hono/auth-js";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "@auth/core/providers/google";
import { db } from "./db/drizzle";
import transaction from "./routes/transaction";

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

function getAuthConfig(c: Context): AuthConfig {
  return {
    secret: c.env.AUTH_SECRET,
    adapter: DrizzleAdapter(db),
    session: {
      strategy: "jwt",
    },
    providers: [Google({ clientId: process.env.AUTH_GOOGLE_ID, clientSecret: process.env.AUTH_GOOGLE_SECRET })],
    callbacks: {
      async jwt({ user, token }) {
        return token;
      },
    },
  };
}

app.use("*", initAuthConfig(getAuthConfig));

app.use("/auth/*", authHandler());

app.use("/v1/*", verifyAuth());

app.get("/protected", (c) => {
  const app = c.get("authUser");
  console.log(app.user);
  return c.json(app);
});

// Endpoints
app.route("/rewards", reward);
app.route("/transactions", transaction);

export default app;
