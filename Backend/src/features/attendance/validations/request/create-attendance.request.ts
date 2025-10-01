import * as Joi from 'joi';

export const createAttendanceSchema = Joi.object({
  session_id: Joi.number().required(),
  student_id: Joi.number().required(),
  status: Joi.string().required(),
  confirmed: Joi.boolean().required(),
  timestamp: Joi.date().required(),
});
