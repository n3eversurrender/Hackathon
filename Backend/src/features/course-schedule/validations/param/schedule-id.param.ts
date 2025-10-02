import * as Joi from 'joi';
import { CourseSchedule } from '../../entities/course-schedule.entity';

export const scheduleIdExrenal = async (value) => {
  const schedule = await CourseSchedule.findOne({
    where: { id: value.id, course_id: value.coursesId },
  });

  if (!schedule) {
    throw new Joi.ValidationError(
      'any.invalid-schedule-id',
      [
        {
          message: 'Schedule not found',
          path: ['id'],
          type: 'any.invalid-schedule-id',
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
  return schedule;
};

export const scheduleIdParamSchema = Joi.object()
  .required()
  .external(scheduleIdExrenal);
