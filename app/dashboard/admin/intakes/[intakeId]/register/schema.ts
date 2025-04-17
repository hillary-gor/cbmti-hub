import { z } from 'zod';

export const registerSchema = z.object({
  studentId: z.string().uuid({ message: 'Invalid student' }),
  courseId: z.string().uuid({ message: 'Invalid course' }),
  intakeId: z.string().uuid({ message: 'Invalid intake' }),
});
