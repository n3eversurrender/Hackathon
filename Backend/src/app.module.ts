import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import routerConfig from './cores/configs/router.config';
import { sequelizeConfigAsync } from './cores/configs/sequelize.config';
import { NotificationListener } from './cores/event-emitter/notification.listener';
import { ResponseModule } from './cores/modules/response/response.module';
import { AttendanceModule } from './features/attendance/attendance.module';
import { AuthModule } from './features/auth/auth.module';
import { CourseScheduleModule } from './features/course-schedule/course-schedule.module';
import { CourseModule } from './features/course/course.module';
import { DashboardModule } from './features/dashboard/dashboard.module';
import { SessionsModule } from './features/sessions/sessions.module';
import { UserModule } from './features/user/user.module';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      cache: true,
    }),
    SequelizeModule.forRootAsync(sequelizeConfigAsync),
    routerConfig,
    AuthModule,
    ResponseModule,
    UserModule,
    ScheduleModule.forRoot(),
    CourseModule,
    CourseScheduleModule,
    SessionsModule,
    AttendanceModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService, NotificationListener],
})
export class AppModule {}
