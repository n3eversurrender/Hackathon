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
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { courseIdParamSchema } from './validations/param/course-id.param';
import { createCourseSchema } from './validations/request/create-course.request';
import { updateCourseSchema } from './validations/request/update-course.request';

@Controller()
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query: any, @CurrentUser() user: any) {
    return this.courseService.findAll(query, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id', new JoiValidationParamPipe(courseIdParamSchema))
    course: Course,
  ) {
    return this.courseService.findOne(course);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body(new JoiValidationPipe(createCourseSchema))
    createCourseDto: CreateCourseDto,
    @CurrentUser() user: any,
  ) {
    return this.courseService.create(createCourseDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id', new JoiValidationParamPipe(courseIdParamSchema))
    course: Course,
    @Body(new JoiValidationPipe(updateCourseSchema))
    body: UpdateCourseDto,
  ) {
    return this.courseService.update(course, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', new JoiValidationParamPipe(courseIdParamSchema))
    course: Course,
  ) {
    return this.courseService.remove(course);
  }
}
