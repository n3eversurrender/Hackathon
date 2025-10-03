import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Session } from 'src/features/sessions/entities/session.entity';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { Attendance } from './entities/attendance.entity';

@Module({
  imports: [SequelizeModule.forFeature([Attendance, Session])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
