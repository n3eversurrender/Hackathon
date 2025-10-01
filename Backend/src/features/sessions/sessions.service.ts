import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { QueryBuilderHelper } from 'src/cores/helpers/query-builder.helper';
import { ResponseHelper } from 'src/cores/helpers/response.helper';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from './entities/session.entity';

@Injectable()
export class SessionsService {
  constructor(
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
    @InjectModel(Session)
    private readonly sessionModel: typeof Session,
  ) {}

  async findAll(query: any) {
    try {
      const { count, data } = await new QueryBuilderHelper(
        this.sessionModel,
        query,
      ).getResult();

      const result = {
        count: count,
        sessions: data,
      };

      return this.response.success(
        result,
        200,
        'Successfully get all sessions',
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findOne(session: Session) {
    try {
      return this.response.success(
        session,
        200,
        'Successfully get session',
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async create(body: CreateSessionDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const session = await this.sessionModel.create(
        { ...body },
        { transaction },
      );

      await transaction.commit();
      return this.response.success(
        session,
        201,
        'Successfully create session',
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async update(session: Session, body: UpdateSessionDto) {
    const transaction = await this.sequelize.transaction();
    try {
      await session.update({ ...body }, { transaction });
      await transaction.commit();
      return this.response.success(
        session,
        200,
        'Successfully update session',
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(session: Session) {
    const transaction = await this.sequelize.transaction();
    try {
      await session.destroy({ transaction });
      await transaction.commit();
      return this.response.success({}, 200, 'Successfully delete session');
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }
}
