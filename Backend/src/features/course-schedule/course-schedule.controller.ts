import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/cores/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/cores/guards/jwt-auth.guard';
import { JoiValidationParamPipe } from 'src/cores/validators/pipes/joi-validation-param.pipe';
import { JoiValidationPipe } from 'src/cores/validators/pipes/joi-validation.pipe';
import { Course } from 'src/features/course/entities/course.entity';
import { courseIdParamSchema } from 'src/features/course/validations/param/course-id.param';
import { User } from 'src/features/user/entities/user.entity';
import { CourseScheduleService } from './course-schedule.service';
import { CreateCourseScheduleDto } from './dto/create-course-schedule.dto';
import { UpdateCourseScheduleDto } from './dto/update-course-schedule.dto';
import { CourseSchedule } from './entities/course-schedule.entity';
import { scheduleIdParamSchema } from './validations/param/schedule-id.param';
import { createScheduleSchema } from './validations/request/create-schedule.request';
import { updateScheduleSchema } from './validations/request/update-schedule.request';

@Controller()
export class CourseScheduleController {
  constructor(
    private readonly courseScheduleService: CourseScheduleService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query() query: any,
    @Param('coursesId', new JoiValidationParamPipe(courseIdParamSchema))
    course: Course,
    @CurrentUser() user: User,
  ) {
    return this.courseScheduleService.findAll(query, course.id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param(new JoiValidationParamPipe(scheduleIdParamSchema))
    schedule: CourseSchedule,
  ) {
    return this.courseScheduleService.findOne(schedule);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Param('coursesId', new JoiValidationParamPipe(courseIdParamSchema))
    course: Course,
    @Body(new JoiValidationPipe(createScheduleSchema))
    body: CreateCourseScheduleDto,
  ) {
    return this.courseScheduleService.create(course.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param(new JoiValidationParamPipe(scheduleIdParamSchema))
    schedule: CourseSchedule,
    @Body(new JoiValidationPipe(updateScheduleSchema))
    body: UpdateCourseScheduleDto,
  ) {
    return this.courseScheduleService.update(schedule, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param(new JoiValidationParamPipe(scheduleIdParamSchema))
    schedule: CourseSchedule,
  ) {
    return this.courseScheduleService.remove(schedule);
  }
}
