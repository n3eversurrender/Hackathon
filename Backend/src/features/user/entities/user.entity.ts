import {
  Column,
  DataType,
  DefaultScope,
  Model,
  Table,
} from 'sequelize-typescript';
import { getUserRoleEnumLabel } from '../enums/user-role.enum';

@Table({
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  paranoid: true,
  tableName: 'users',
  modelName: 'users',
})
@DefaultScope(() => ({
  attributes: {
    exclude: ['password'],
  },
}))
export class User extends Model {
  @Column(DataType.STRING)
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  username: string;

  @Column(DataType.STRING)
  password: string;

  @Column({ type: DataType.TINYINT, allowNull: true, defaultValue: 0 })
  role: number;

  @Column({
    type: DataType.VIRTUAL,
    get() {
      return getUserRoleEnumLabel(this.getDataValue('role'));
    },
    set(value) {
      this.setDataValue(
        'role_name',
        getUserRoleEnumLabel(this.getDataValue('role')),
      );
    },
  })
  role_name: string;
}
