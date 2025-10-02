import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { QueryBuilderHelper } from 'src/cores/helpers/query-builder.helper';
import { ResponseHelper } from 'src/cores/helpers/response.helper';
import { User } from 'src/features/user/entities/user.entity';
import UserRoleEnum from 'src/features/user/enums/user-role.enum';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CourseService {
  constructor(
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
    @InjectModel(Course)
    private readonly courseModel: typeof Course,
  ) {}

  async findAll(query: any, user: User) {
    const condition = {};

    // Only show courses created by the lecturer themselves
    if (user.role === UserRoleEnum.LECTURER) {
      Object.assign(condition, {
        lecturer_id: user.id,
      });
    }
    // Admin can see all courses, students can see all courses (no filter)

    try {
      const { count, data } = await new QueryBuilderHelper(
        this.courseModel,
        query,
      )
        .where(condition)
        .load('lecturer')
        .getResult();

      const result = {
        count: count,
        courses: data,
      };

      return this.response.success(
        result,
        200,
        'Successfully get all courses',
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findOne(course: Course) {
    try {
      await course.reload({
        include: [
          {
            association: 'lecturer',
          },
        ],
      });
      return this.response.success(course, 200, 'Successfully get course');
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async create(createCourseDto: CreateCourseDto, user: any) {
    const transaction = await this.sequelize.transaction();
    try {
      const course = await this.courseModel.create(
        { ...createCourseDto, lecturer_id: user.id },
        { transaction },
      );

      await transaction.commit();
      return this.response.success(
        course,
        201,
        'Successfully create course',
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async update(course: Course, updateCourseDto: UpdateCourseDto) {
    const transaction = await this.sequelize.transaction();
    try {
      await course.update({ ...updateCourseDto }, { transaction });
      await transaction.commit();
      return this.response.success(
        course,
        200,
        'Successfully update course',
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(course: Course) {
    const transaction = await this.sequelize.transaction();
    try {
      await course.destroy({ transaction });
      await transaction.commit();
      return this.response.success({}, 200, 'Successfully delete course');
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }
}
