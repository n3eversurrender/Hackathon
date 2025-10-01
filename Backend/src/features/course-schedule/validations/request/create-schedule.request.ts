import * as Joi from 'joi';

export const createScheduleSchema = Joi.object({
  day_of_week: Joi.number().required(),
  start_time: Joi.string().required(),
  end_time: Joi.string().required(),
});
