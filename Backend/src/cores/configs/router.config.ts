import { RouterModule } from '@nestjs/core';
import { AuthModule } from 'src/features/auth/auth.module';
import { DepartmentModule } from 'src/features/department/department.module';
import { EmployeeModule } from 'src/features/employee/employee.module';
import { FactoryModule } from 'src/features/factory/factory.module';
import { FloorModule } from 'src/features/floor/floor.module';
import { RoomModule } from 'src/features/room/room.module';
import { TaskAssignmentsModule } from 'src/features/task-assignments/task-assignments.module';
import { TaskModule } from 'src/features/task/task.module';
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
        children: [
          {
            path: ':userId/employees',
            module: EmployeeModule,
          },
        ],
      },
      {
        path: 'factories',
        module: FactoryModule,
        children: [
          {
            path: ':factoryId/departments',
            module: DepartmentModule,
          },
          {
            path: ':factoryId/floors',
            module: FloorModule,
          },
          {
            path: ':factoryId/rooms',
            module: RoomModule,
          },
        ],
      },
      {
        path: 'tasks',
        module: TaskModule,
        children: [
          {
            path: ':taskId/assignments',
            module: TaskAssignmentsModule,
          },
        ],
      },
    ],
  },
]);
