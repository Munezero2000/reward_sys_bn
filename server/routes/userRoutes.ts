import { Hono } from "hono";
import { createUserAccount, getTopUsers, getUserByEmail } from "../service/userService";
import { zValidator } from "@hono/zod-validator";
import { createUserSchema, signInSchema } from "../util/types";
import { decode, sign, verify } from "hono/jwt";
import { compare } from "bcrypt";

const user = new Hono();

user.get("/", async (c) => {
  const leaderboardUsers = await getTopUsers();
  return c.json(leaderboardUsers);
});

user.post(
  "/signin",
  zValidator("json", signInSchema, (result, c) => {
    if (!result.success) {
      return c.json({ errors: result.error.format() }, 400);
    }
  }),
  async (c) => {
    const signInData = c.req.valid("json");

    const user = await getUserByEmail(signInData.email);
    if (!user) {
      return c.json({
        message: "Invalid email",
      });
    }
    const verifyPassword = await compare(signInData.password, user.password);
    if (!verifyPassword) {
      return c.json({
        message: "Invalid password",
      });
    }
    const secret = process.env.AUTH_SECRET!;
    const token = await sign(user, secret);
    c.res.headers.append("x-auth-token", token);
    return c.json({ message: "sign in successfully" });
  }
);

user.post(
  "/create",
  zValidator("json", createUserSchema, (result, c) => {
    if (!result.success) {
      return c.json({ errors: result.error.format() }, 400);
    }
  }),
  async (c) => {
    try {
      // Get user data from request body
      const userData = c.req.valid("json");

      // verify if password is not used
      const user = await getUserByEmail(userData.email);
      if (user) {
        return c.json({
          message: "This email has been taken",
        });
      }

      const newUser = await createUserAccount(userData);

      return c.json(
        {
          message: "User created successfully",
          user: newUser,
        },
        201
      );
    } catch (error) {
      console.error("Error creating user:", error);
      return c.json({ error: "Internal server Error" }, 500);
    }
  }
);

export default user;
