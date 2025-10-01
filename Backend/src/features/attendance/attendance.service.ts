import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { QueryBuilderHelper } from 'src/cores/helpers/query-builder.helper';
import { ResponseHelper } from 'src/cores/helpers/response.helper';
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
  ) {}

  async findAll(query: any) {
    try {
      const { count, data } = await new QueryBuilderHelper(
        this.attendanceModel,
        query,
      ).getResult();

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
