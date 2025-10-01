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
import { Session } from 'src/features/sessions/entities/session.entity';
import { User } from 'src/features/user/entities/user.entity';

@Table({
  tableName: 'attendances',
  modelName: 'attendances',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
export class Attendance extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.BIGINT,
  })
  id: number;

  @ForeignKey(() => Session)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  session_id: number;

  @BelongsTo(() => Session, 'session_id')
  session: TypeWrapper<Session>;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  student_id: number;

  @BelongsTo(() => User, 'student_id')
  student: TypeWrapper<User>;

  @Column({
    type: DataType.ENUM('present', 'late'),
    allowNull: true,
  })
  status: 'present' | 'late' | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  confirmed: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  timestamp: Date | null;
}
