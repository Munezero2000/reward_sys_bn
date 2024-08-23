// import { createTodo, getAllTodo } from "@/service/todo";
// import { zValidator } from "@hono/zod-validator";
// import { Hono } from "hono";
// import { z } from "zod";

// const todo = new Hono();

// const todoDTO = z.object({
//   text: z.string().min(3, { message: "todo text must be at least 3 characters" }),
// });

// todo.get("/", async (c) => {
//   const todos = await getAllTodo();
//   return c.json({
//     todos,
//   });
// });

// todo.post(
//   // "/"
//   zValidator("json", todoDTO, (result, c) => {
//     if (!result.success) {
//       return c.text("Invalid inputs", 400);
//     }
//   }),
//   async (c) => {
//     const body: { text: string } = await c.req.json();
//     const todo = await createTodo(body);
//     return c.json({ message: "Todo created suceessull", todo: todo });
//   }
// );

// todo.delete("/:id", async (c) => {});

// export default todo;
