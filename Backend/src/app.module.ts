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
import { AuthModule } from './features/auth/auth.module';
import { EmployeeModule } from './features/employee/employee.module';
import { FactoryModule } from './features/factory/factory.module';
import { UserModule } from './features/user/user.module';
import { DepartmentModule } from './features/department/department.module';
import { FloorModule } from './features/floor/floor.module';
import { RoomModule } from './features/room/room.module';
import { TaskModule } from './features/task/task.module';
import { TaskAssignmentsModule } from './features/task-assignments/task-assignments.module';

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
    EmployeeModule,
    FactoryModule,
    DepartmentModule,
    FloorModule,
    RoomModule,
    TaskModule,
    TaskAssignmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService, NotificationListener],
})
export class AppModule {}
