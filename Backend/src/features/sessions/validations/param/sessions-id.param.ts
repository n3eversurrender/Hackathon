import * as Joi from 'joi';
import { Session } from '../../entities/session.entity';

export const sessionIdExrenal = async (value) => {
  const session = await Session.findOne({
    where: { id: value },
  });

  if (!session) {
    throw new Joi.ValidationError(
      'any.invalid-session-id',
      [
        {
          message: 'Session not found',
          path: ['id'],
          type: 'any.invalid-session-id',
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
  return session;
};

export const sessionIdParamSchema = Joi.number()
  .required()
  .external(sessionIdExrenal);
