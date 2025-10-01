import * as Joi from 'joi';

export const updateAttendanceSchema = Joi.object({
  session_id: Joi.number().optional(),
  student_id: Joi.number().optional(),
  status: Joi.string().optional(),
  confirmed: Joi.boolean().optional(),
  timestamp: Joi.date().optional(),
});
