import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ResponseHelper } from 'src/cores/helpers/response.helper';
import { Attendance } from 'src/features/attendance/entities/attendance.entity';
import { CourseSchedule } from 'src/features/course-schedule/entities/course-schedule.entity';
import { Course } from 'src/features/course/entities/course.entity';
import { Session } from 'src/features/sessions/entities/session.entity';
import { User } from 'src/features/user/entities/user.entity';
import UserRoleEnum from 'src/features/user/enums/user-role.enum';

@Injectable()
export class DashboardService {
  constructor(
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
    @InjectModel(Session)
    private readonly sessionModel: typeof Session,
    @InjectModel(Attendance)
    private readonly attendanceModel: typeof Attendance,
    @InjectModel(Course)
    private readonly courseModel: typeof Course,
  ) {}

  async getStatistics(date: string, user: User) {
    try {
      // Use current date if not provided
      const targetDate = date || new Date().toISOString().split('T')[0];

      // Build course condition based on user role
      const courseCondition: any = {};
      if (user.role === UserRoleEnum.LECTURER) {
        courseCondition.lecturer_id = user.id;
      }

      // Get all sessions for the target date
      const sessions = await this.sessionModel.findAll({
        where: { date: targetDate },
        include: [
          {
            model: Course,
            as: 'course',
            required: true,
            where: courseCondition,
          },
        ],
      });

      const sessionIds = sessions.map((s) => s.id);

      // Get all attendances for these sessions
      const attendances = await this.attendanceModel.findAll({
        where: {
          session_id: {
            [Op.in]: sessionIds.length > 0 ? sessionIds : [0],
          },
        },
      });

      // Calculate statistics
      const totalSessions = sessions.length;
      const totalAttendances = attendances.length;

      // Count students who should attend (from courses)
      const courseIds = sessions.map((s) => s.course_id);
      const uniqueCourseIds = [...new Set(courseIds)];

      // For now, we'll use attendance count as present count
      // You can enhance this by counting enrolled students per course
      const presentCount = attendances.filter((a) => a.confirmed).length;

      // Calculate average attendance rate
      const averageAttendance =
        totalSessions > 0 && totalAttendances > 0
          ? Math.round((presentCount / totalAttendances) * 100)
          : 0;

      const result = {
        totalSessions,
        totalAttendances: presentCount,
        averageAttendance,
        date: targetDate,
      };

      return this.response.success(
        result,
        200,
        'Successfully get statistics',
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async getTodaySessions(date: string, user: User) {
    try {
      // Use current date if not provided
      const targetDate = date || new Date().toISOString().split('T')[0];
      const currentTime = new Date().toTimeString().split(' ')[0];

      // Build course condition based on user role
      const courseCondition: any = {};
      if (user.role === UserRoleEnum.LECTURER) {
        courseCondition.lecturer_id = user.id;
      }

      // Get all sessions for the target date
      const sessions = await this.sessionModel.findAll({
        where: { date: targetDate },
        include: [
          {
            model: Course,
            as: 'course',
            required: true,
            where: courseCondition,
            attributes: ['id', 'name', 'code'],
          },
          {
            model: CourseSchedule,
            as: 'schedule',
            required: false,
            attributes: ['id', 'day_of_week', 'start_time', 'end_time'],
          },
        ],
        order: [['start_time', 'ASC']],
      });

      // Get attendance count for each session
      const sessionsWithStats = await Promise.all(
        sessions.map(async (session) => {
          const attendanceCount = await this.attendanceModel.count({
            where: {
              session_id: session.id,
              confirmed: true,
            },
          });

          // Determine if QR is active
          const isActive =
            targetDate === new Date().toISOString().split('T')[0] &&
            currentTime >= session.start_time &&
            currentTime <= session.end_time;

          return {
            ...session.toJSON(),
            attendanceCount,
            isActive,
          };
        }),
      );

      return this.response.success(
        { sessions: sessionsWithStats },
        200,
        'Successfully get today sessions',
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async getRecentAttendances(user: User) {
    try {
      // Build course condition based on user role
      const courseCondition: any = {};
      if (user.role === UserRoleEnum.LECTURER) {
        courseCondition.lecturer_id = user.id;
      }

      // Get recent attendances
      const attendances = await this.attendanceModel.findAll({
        limit: 10,
        order: [['timestamp', 'DESC']],
        include: [
          {
            model: Session,
            as: 'session',
            required: true,
            include: [
              {
                model: Course,
                as: 'course',
                required: true,
                where: courseCondition,
                attributes: ['id', 'name', 'code'],
              },
            ],
          },
          {
            model: User,
            as: 'student',
            required: true,
            attributes: ['id', 'name', 'username'],
          },
        ],
      });

      return this.response.success(
        { attendances },
        200,
        'Successfully get recent attendances',
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }
}
