import { RouterModule } from '@nestjs/core';
import { AttendanceModule } from 'src/features/attendance/attendance.module';
import { AuthModule } from 'src/features/auth/auth.module';
import { CourseScheduleModule } from 'src/features/course-schedule/course-schedule.module';
import { CourseModule } from 'src/features/course/course.module';
import { SessionsModule } from 'src/features/sessions/sessions.module';
import { UserModule } from 'src/features/user/user.module';

export default RouterModule.register([
  {
    path: '/api/v1',
    children: [
      {
        path: 'auth',
        module: AuthModule,
      },
      {
        path: 'users',
        module: UserModule,
      },
      {
        path: 'courses',
        module: CourseModule,
        children: [
          {
            path: ':coursesId/schedules',
            module: CourseScheduleModule,
          },
        ],
      },
      {
        path: 'sessions',
        module: SessionsModule,
      },
      {
        path: 'attendances',
        module: AttendanceModule,
      },
    ],
  },
]);
