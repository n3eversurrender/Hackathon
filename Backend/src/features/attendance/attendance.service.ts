import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { QueryBuilderHelper } from 'src/cores/helpers/query-builder.helper';
import { ResponseHelper } from 'src/cores/helpers/response.helper';
import { Session } from 'src/features/sessions/entities/session.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Attendance } from './entities/attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
    @InjectModel(Attendance)
    private readonly attendanceModel: typeof Attendance,
    @InjectModel(Session)
    private readonly sessionModel: typeof Session,
  ) {}

  async findAll(query: any) {
    try {
      const { count, data } = await new QueryBuilderHelper(
        this.attendanceModel,
        query,
      )
        .options({
          include: [
            {
              association: 'student',
              required: false,
              attributes: ['id', 'name', 'username', 'email'],
            },
            {
              association: 'session',
              required: false,
              include: [
                {
                  association: 'course',
                  required: false,
                  attributes: ['id', 'name', 'code'],
                },
              ],
            },
          ],
        })
        .getResult();

      const result = {
        count: count,
        attendances: data,
      };

      return this.response.success(
        result,
        200,
        'Successfully get all attendances',
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findOne(attendance: Attendance) {
    try {
      return this.response.success(
        attendance,
        200,
        'Successfully get attendance',
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async create(body: CreateAttendanceDto) {
    const transaction = await this.sequelize.transaction();
    try {
      // Get session to validate QR code is still active
      const session = await this.sessionModel.findByPk(body.session_id);
      if (!session) {
        throw new Error('Session tidak ditemukan');
      }

      // Get current date and time in Jakarta timezone (WIB/WITA/WIT)
      const now = new Date();
      const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const currentTime = now.toTimeString().split(' ')[0]; // HH:MM:SS

      // Validate date - QR code only valid on session date
      if (session.date !== currentDate) {
        throw new Error(
          'QR Code hanya berlaku pada tanggal ' +
            new Date(session.date).toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
        );
      }

      // Validate time - QR code only valid between start_time and end_time
      if (
        currentTime < session.start_time ||
        currentTime > session.end_time
      ) {
        throw new Error(
          `QR Code hanya berlaku pada pukul ${session.start_time.substring(0, 5)} - ${session.end_time.substring(0, 5)}`,
        );
      }

      // Create attendance
      const attendance = await this.attendanceModel.create(
        { ...body },
        { transaction },
      );

      await transaction.commit();
      return this.response.success(
        attendance,
        201,
        'Successfully create attendance',
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async update(attendance: Attendance, body: UpdateAttendanceDto) {
    const transaction = await this.sequelize.transaction();
    try {
      await attendance.update({ ...body }, { transaction });
      await transaction.commit();
      return this.response.success(
        attendance,
        200,
        'Successfully update attendance',
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(attendance: Attendance) {
    const transaction = await this.sequelize.transaction();
    try {
      await attendance.destroy({ transaction });
      await transaction.commit();
      return this.response.success(
        {},
        200,
        'Successfully delete attendance',
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }
}
