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
import { Course } from 'src/features/course/entities/course.entity';

@Table({
  tableName: 'course_schedules',
  modelName: 'course_schedules',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
export class CourseSchedule extends Model {
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

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
  })
  day_of_week: number;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  start_time: string;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  end_time: string;
}
