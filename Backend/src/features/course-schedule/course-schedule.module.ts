import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CourseScheduleController } from './course-schedule.controller';
import { CourseScheduleService } from './course-schedule.service';
import { CourseSchedule } from './entities/course-schedule.entity';

@Module({
  imports: [SequelizeModule.forFeature([CourseSchedule])],
  controllers: [CourseScheduleController],
  providers: [CourseScheduleService],
})
export class CourseScheduleModule {}
