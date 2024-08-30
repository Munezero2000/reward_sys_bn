import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "@auth/core/providers/google";
import { db } from "../db/drizzle";
import { Context } from "hono";
import { AuthConfig } from "@hono/auth-js";

export function getAuthConfig(c: Context): AuthConfig {
  return {
    secret: c.env.AUTH_SECRET,
    adapter: DrizzleAdapter(db),
    session: {
      strategy: "jwt",
    },
    pages: {
      signIn: "http://localhost:3001/rewards",
    },
    cookies: {
      sessionToken: {
        options: {
          sameSite: "none",
        },
      },
    },
    // basePath: "/api/auth/",
    providers: [Google({ clientId: process.env.AUTH_GOOGLE_ID, clientSecret: process.env.AUTH_GOOGLE_SECRET })],
  };
}
