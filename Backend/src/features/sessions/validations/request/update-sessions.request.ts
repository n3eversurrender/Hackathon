import * as Joi from 'joi';

export const updateSessionsSchema = Joi.object({
  course_id: Joi.number().optional(),
  schedule_id: Joi.number().optional(),
  date: Joi.string().optional(),
  start_time: Joi.string().optional(),
  end_time: Joi.string().optional(),
  qr_code: Joi.string().optional(),
});
