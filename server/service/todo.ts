// import { db } from "@/server/db/drizzle";
// // import { todo } from "@/server/db/schema";

// export async function createTodo(todoDTO: { id?: string; text: string; done?: false }) {
//   const { text } = todoDTO;
//   return db.insert(todo).values({ text }).returning();
// }

// export async function getAllTodo() {
//   return db.select().from(todo);
// }
