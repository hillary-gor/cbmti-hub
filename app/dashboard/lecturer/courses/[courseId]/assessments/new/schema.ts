import { z } from "zod";

export const CreateAssessmentSchema = z.object({
  course_id: z.string().uuid(),
  title: z.string().min(3),
  type: z.enum(["quiz", "assignment", "exam"]),
  description: z.string().optional(),
  due_date: z.string().datetime({ message: "Invalid date format" }),
});
