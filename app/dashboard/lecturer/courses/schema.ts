// app/dashboard/lecturer/courses/schema.ts
import { z } from "zod";

export const CreateCourseSchema = z.object({
  title: z.string().min(3, "Title is too short"),
  code: z.string().min(2).max(10, "Code is too long"),
  description: z.string().optional(),
  semester: z.string().optional(),
});
