import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Course } from 'src/features/course/entities/course.entity';
import { Session } from './entities/session.entity';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

@Module({
  imports: [SequelizeModule.forFeature([Session, Course])],
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}
