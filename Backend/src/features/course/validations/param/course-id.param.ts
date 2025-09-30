import * as Joi from 'joi';
import { Course } from '../../entities/course.entity';

export const courseIdExrenal = async (value) => {
  const course = await Course.findOne({
    where: { id: value },
  });

  if (!course) {
    throw new Joi.ValidationError(
      'any.invalid-course-id',
      [
        {
          message: 'Course not found',
          path: ['id'],
          type: 'any.invalid-course-id',
          context: {
            key: 'id',
            label: 'id',
            value,
          },
        },
      ],
      value,
    );
  }
  return course;
};

export const courseIdParamSchema = Joi.number()
  .required()
  .external(courseIdExrenal);
