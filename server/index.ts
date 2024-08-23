import { Hono } from "hono";
import { logger } from "hono/logger";
import reward from "./route.ts/reward";
export const runtime = "edge";

const app = new Hono().basePath("/api");

app.use(logger());
app.route("/rewards", reward);

export default app;
