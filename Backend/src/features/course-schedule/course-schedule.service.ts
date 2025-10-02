import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { QueryBuilderHelper } from 'src/cores/helpers/query-builder.helper';
import { ResponseHelper } from 'src/cores/helpers/response.helper';
import { User } from 'src/features/user/entities/user.entity';
import UserRoleEnum from 'src/features/user/enums/user-role.enum';
import { CreateCourseScheduleDto } from './dto/create-course-schedule.dto';
import { UpdateCourseScheduleDto } from './dto/update-course-schedule.dto';
import { CourseSchedule } from './entities/course-schedule.entity';

@Injectable()
export class CourseScheduleService {
  constructor(
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
    @InjectModel(CourseSchedule)
    private readonly courseScheduleModel: typeof CourseSchedule,
  ) {}

  async findAll(query: any, courseId: number, user: User) {
    const condition: any = { course_id: courseId };

    // If user is lecturer, filter schedules to only show schedules from their courses
    if (user.role === UserRoleEnum.LECTURER) {
      Object.assign(condition, {
        '$course.lecturer_id$': user.id,
      });
    }
    // Admin and students can see all schedules

    try {
      const { count, data } = await new QueryBuilderHelper(
        this.courseScheduleModel,
        query,
      )
        .where(condition)
        .load('course')
        .getResult();

      const result = {
        count: count,
        schedules: data,
      };

      return this.response.success(
        result,
        200,
        'Successfully get all course schedules',
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findOne(schedule: CourseSchedule) {
    try {
      await schedule.reload({
        include: [
          {
            association: 'course',
          },
        ],
      });
      return this.response.success(
        schedule,
        200,
        'Successfully get course schedule',
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async create(
    courseId: number,
    createCourseScheduleDto: CreateCourseScheduleDto,
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      const schedule = await this.courseScheduleModel.create(
        { ...createCourseScheduleDto, course_id: courseId },
        { transaction },
      );

      await transaction.commit();
      return this.response.success(
        schedule,
        201,
        'Successfully create course schedule',
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async update(
    schedule: CourseSchedule,
    updateCourseScheduleDto: UpdateCourseScheduleDto,
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      await schedule.update(
        { ...updateCourseScheduleDto },
        { transaction },
      );
      await transaction.commit();
      return this.response.success(
        schedule,
        200,
        'Successfully update course schedule',
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(schedule: CourseSchedule) {
    const transaction = await this.sequelize.transaction();
    try {
      await schedule.destroy({ transaction });
      await transaction.commit();
      return this.response.success(
        {},
        200,
        'Successfully delete course schedule',
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }
}
