import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { Attendance } from './entities/attendance.entity';

@Module({
  imports: [SequelizeModule.forFeature([Attendance])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
