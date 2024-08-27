import { Hono } from "hono";
import { getTopUsers } from "../service/userService";

const user = new Hono();

user.get("/", async (c) => {
  const leaderboardUsers = await getTopUsers();
  return c.json(leaderboardUsers);
});

export default user;
