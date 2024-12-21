import { Elysia } from "elysia";
import Student from "./student";
import swagger from "@elysiajs/swagger";

const app = new Elysia()
  .use(swagger({
    path: "/documentation"
  }))  
  .use(Student)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
