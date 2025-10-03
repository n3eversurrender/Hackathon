import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { QRCodeHelper } from 'src/cores/helpers/qrcode.helper';
import { QueryBuilderHelper } from 'src/cores/helpers/query-builder.helper';
import { ResponseHelper } from 'src/cores/helpers/response.helper';
import { Course } from 'src/features/course/entities/course.entity';
import { User } from 'src/features/user/entities/user.entity';
import UserRoleEnum from 'src/features/user/enums/user-role.enum';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from './entities/session.entity';

@Injectable()
export class SessionsService {
  constructor(
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
    private readonly qrcodeHelper: QRCodeHelper,
    @InjectModel(Session)
    private readonly sessionModel: typeof Session,
    @InjectModel(Course)
    private readonly courseModel: typeof Course,
  ) {}

  async findAll(query: any, user: User) {
    const condition = {};
    const includeOptions: any = [
      {
        association: 'course',
        required: false,
      },
      {
        association: 'schedule',
        required: false,
      },
    ];

    if (user.role === UserRoleEnum.LECTURER) {
      Object.assign(condition, {
        '$course.lecturer_id$': user.id,
      });
      // Make course join required when filtering by lecturer
      includeOptions[0].required = true;
    }

    try {
      const queryBuilder = new QueryBuilderHelper(this.sessionModel, query)
        .where(condition)
        .options({ include: includeOptions });

      // Set subQuery to false when using nested conditions to ensure proper filtering
      if (user.role === UserRoleEnum.LECTURER) {
        queryBuilder.setSubQuery(false);
      }

      const { count, data } = await queryBuilder.getResult();

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
      await session.reload({
        include: [
          {
            association: 'course',
          },
          {
            association: 'schedule',
          },
        ],
      });
      return this.response.success(
        session,
        200,
        'Successfully get session',
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async create(body: CreateSessionDto, user: User) {
    const transaction = await this.sequelize.transaction();
    try {
      // If user is lecturer, verify they own the course
      if (user.role === UserRoleEnum.LECTURER) {
        const course = await this.courseModel.findOne({
          where: {
            id: body.course_id,
            lecturer_id: user.id,
          },
        });

        if (!course) {
          return this.response.fail(
            'You can only create sessions for your own courses',
            403,
          );
        }
      }

      // Create session first (without QR code)
      const session = await this.sessionModel.create(
        {
          course_id: body.course_id,
          schedule_id: body.schedule_id,
          date: body.date,
          start_time: body.start_time,
          end_time: body.end_time,
          qr_code: null, // Will be generated below
        },
        { transaction },
      );

      // Generate unique token for this session
      const token = this.qrcodeHelper.generateSessionToken(
        session.id,
        body.course_id,
        body.date,
      );

      // Create QR data string
      const qrDataString = this.qrcodeHelper.createSessionQRData(
        session.id,
        token,
      );

      // Generate QR code image (base64 data URL)
      const qrCodeDataURL =
        await this.qrcodeHelper.generateQRCode(qrDataString);

      // Update session with QR code
      await session.update({ qr_code: qrCodeDataURL }, { transaction });

      await transaction.commit();

      // Reload session with relations
      await session.reload({
        include: [{ association: 'course' }, { association: 'schedule' }],
      });

      return this.response.success(
        session,
        201,
        'Successfully create session with QR code',
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
