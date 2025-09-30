import * as Joi from 'joi';

export const createCourseSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
});
