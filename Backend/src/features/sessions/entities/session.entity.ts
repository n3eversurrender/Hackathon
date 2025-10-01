import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import type { TypeWrapper } from 'src/cores/helpers/type-wrapper';
import { CourseSchedule } from 'src/features/course-schedule/entities/course-schedule.entity';
import { Course } from 'src/features/course/entities/course.entity';

@Table({
  tableName: 'sessions',
  modelName: 'sessions',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
export class Session extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.BIGINT,
  })
  id: number;

  @ForeignKey(() => Course)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  course_id: number;

  @BelongsTo(() => Course, 'course_id')
  course: TypeWrapper<Course>;

  @ForeignKey(() => CourseSchedule)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  schedule_id: number;

  @BelongsTo(() => CourseSchedule, 'schedule_id')
  schedule: TypeWrapper<CourseSchedule>;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  date: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  start_time: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  end_time: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  qr_code: string;
}
