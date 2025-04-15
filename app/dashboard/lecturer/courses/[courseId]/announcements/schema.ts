import { z } from "zod"

export const CreateAnnouncementSchema = z.object({
  course_id: z.string().uuid(),
  title: z.string().min(3, "Title is too short"),
  message: z.string().min(5, "Message must be meaningful"),
})
