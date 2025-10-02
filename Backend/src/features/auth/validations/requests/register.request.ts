import * as Joi from 'joi';
import { JoiException } from 'src/cores/helpers/joi-exception.helper';
import { User } from 'src/features/user/entities/user.entity';
import UserRoleEnum from 'src/features/user/enums/user-role.enum';

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  username: Joi.string()
    .allow('', null)
    .external(async (value, helper) => {
      if (value) {
        const user = await User.findOne({
          where: { username: value },
        });

        if (user) {
          throw JoiException.handle('Username already exists', helper);
        }
      }
      return value;
    }),
  email: Joi.string()
    .required()
    .external(async (value, helper) => {
      const user = await User.findOne({
        where: { email: value },
      });
      if (user) {
        throw JoiException.handle('Email already exists', helper);
      }
      return value;
    }),
  password: Joi.string().min(8),
  role: Joi.number()
    .valid(UserRoleEnum.ADMIN, UserRoleEnum.STUDENT, UserRoleEnum.LECTURER)
    .optional(),
}).options({ abortEarly: false });
