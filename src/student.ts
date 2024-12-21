import { Elysia, t } from "elysia";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

const Student = new Elysia({ prefix: "students" })
  .decorate("prisma", new PrismaClient())
  .model({
    user: t.Object({
      id:         t.Optional(t.String()),
      lastname:   t.String(),
      firstname:  t.String(),
      courseId:   t.Optional(t.String()),
      level:      t.String(),
    })
  })
  /**
   * [GET] 
   * /api/students
   * 
   * Returns a list of students.
   */
  .get("/",     async ({ prisma }) => {

    const students = await prisma.student.findMany({
      select: {
        id: true,
        lastname: true,
        firstname: true,
        course: {
          select: { id: true, name: true }
        },
        level: true
      }
    });
    return {
      type: "success",
      data: students
    };

  })
  /**
   * [POST] 
   * /api/students
   * 
   * Creates a new student.
   */
  .post("/",    async ({ body, prisma }) => {
    
    const { id, lastname, firstname, courseId, level } = body;

    if(!id) {
      throw new Error("Missing ID");
    }

    const config: Prisma.StudentCreateArgs<DefaultArgs> = {
      data: {
        id: id,
        lastname: lastname,
        firstname: firstname,
        level: parseInt(level)
      },
      select: {
        id: true,
        lastname: true,
        firstname: true,
        course: {
          select: { id: true, name: true }
        },
        level: true
      }
    }

    // if courseId is stated
    if(courseId)
      config.data.course = {
        connect: {
          id: courseId
        }
      }

    const student = await prisma.student.create(config);
    return {
      type: "success",
      data: student
    }

  }, {
    body: "user"
  })
  /**
   * [PUT] 
   * /api/students/:id
   * 
   * Updates a student with the given id.
   */
  .put("/:id",     async ({ body, params, prisma }) => {

    const { id } = params;
    const { lastname, firstname, courseId, level } = body;

    if(!id) {
      throw new Error("Missing ID");
    }

    const config: Prisma.StudentUpdateArgs<DefaultArgs> = {
      where: {
        id: id
      },
      data: {
        lastname: lastname,
        firstname: firstname,
        level: parseInt(level)
      },
      select: {
        id: true,
        lastname: true,
        firstname: true,
        course: {
          select: { id: true, name: true }
        },
        level: true
      }
    }

    // if courseId is stated
    if(courseId) {
      // disconnect old course
      config.data.course = {
        disconnect: true
      }

      // connect new course
      config.data.course = {
        connect: {
          id: courseId
        }
      }
    }

    const student = await prisma.student.update(config);
    return {
      type: "success",
      data: student
    }

  }, {
    body: "user"
  })
   /**
   * [DELETE] 
   * /api/students/:id
   * 
   * Deletes a student with the given id.
   */
  .delete("/:id",  async ({ params, prisma }) => {

    const { id } = params;

    const student = await prisma.student.delete({
      where: {
        id: id
      },
      select: {
        id: true,
        lastname: true,
        firstname: true,
        course: {
          select: { id: true, name: true }
        },
        level: true
      }
    });

    return {
      type: "success",
      data: student
    };

  })
  .onError(({ error }) => {

    return {
      type: "error", 
      message: error.message
    };

  })

export default Student;