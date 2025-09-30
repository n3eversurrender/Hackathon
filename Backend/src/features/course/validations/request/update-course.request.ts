import * as Joi from 'joi';

export const updateCourseSchema = Joi.object({
  name: Joi.string().optional(),
  code: Joi.string().optional(),
  lecturer_id: Joi.number().optional(),
});
