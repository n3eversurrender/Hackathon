import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { QRCodeHelper } from 'src/cores/helpers/qrcode.helper';
import { ResponseHelper } from 'src/cores/helpers/response.helper';
import { Attendance } from 'src/features/attendance/entities/attendance.entity';
import { CourseSchedule } from 'src/features/course-schedule/entities/course-schedule.entity';
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
    try {
      const whereCondition: any = {};

      // Add course filter if provided
      if (query.course_id) {
        whereCondition.course_id = parseInt(query.course_id);
      }

      // Add date range filter if provided
      if (query.date_from || query.date_to) {
        whereCondition.date = {};
        if (query.date_from) {
          whereCondition.date[Op.gte] = query.date_from;
        }
        if (query.date_to) {
          whereCondition.date[Op.lte] = query.date_to;
        }
      }

      // Add lecturer filter if user is lecturer
      if (user.role === UserRoleEnum.LECTURER) {
        whereCondition['$course.lecturer_id$'] = user.id;
      }

      const includeOptions: any = [
        {
          model: Course,
          as: 'course',
          required: user.role === UserRoleEnum.LECTURER,
        },
        {
          model: CourseSchedule,
          as: 'schedule',
          required: false,
        },
        {
          model: Attendance,
          as: 'attendances',
          required: false,
          include: [
            {
              model: User,
              as: 'student',
              required: false,
              attributes: ['id', 'name', 'username', 'email'],
            },
          ],
        },
      ];

      // Direct query without QueryBuilderHelper for custom conditions
      const result = await this.sessionModel.findAndCountAll({
        where: whereCondition,
        include: includeOptions,
        subQuery: user.role === UserRoleEnum.LECTURER ? false : true,
        order: [['date', 'DESC']],
      });

      return this.response.success(
        {
          count: result.count,
          sessions: result.rows,
        },
        200,
        'Successfully get all sessions',
      );
    } catch (error) {
      console.error('Error in findAll sessions:', error);
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
