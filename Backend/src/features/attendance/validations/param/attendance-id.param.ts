import * as Joi from 'joi';
import { Attendance } from '../../entities/attendance.entity';

export const attendanceIdExrenal = async (value) => {
  const attendance = await Attendance.findOne({
    where: { id: value },
  });

  if (!attendance) {
    throw new Joi.ValidationError(
      'any.invalid-attendance-id',
      [
        {
          message: 'Attendance not found',
          path: ['id'],
          type: 'any.invalid-attendance-id',
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
  return attendance;
};

export const attendanceIdParamSchema = Joi.number()
  .required()
  .external(attendanceIdExrenal);
