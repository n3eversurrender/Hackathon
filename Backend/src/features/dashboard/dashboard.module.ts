import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Attendance } from 'src/features/attendance/entities/attendance.entity';
import { Course } from 'src/features/course/entities/course.entity';
import { Session } from 'src/features/sessions/entities/session.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [SequelizeModule.forFeature([Session, Attendance, Course])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
