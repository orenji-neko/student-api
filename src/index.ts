import { Elysia } from "elysia";
import Student from "./student";

const app = new Elysia({ prefix: "/api" })
  .use(Student)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
