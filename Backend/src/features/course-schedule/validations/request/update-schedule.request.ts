import * as Joi from 'joi';

export const updateScheduleSchema = Joi.object({
  course_id: Joi.number().optional(),
  day_of_week: Joi.number().optional(),
  start_time: Joi.string().optional(),
  end_time: Joi.string().optional(),
});
