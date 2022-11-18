import { Model, INTEGER, STRING } from 'sequelize';

import db from '.';
import Accounts from './AccountModel';

class Users extends Model {
  id!: number;

  username!: string;

  password!: string;

  accountId!: number;
}

Users.init(
  {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: STRING,
      allowNull: false,
    },
    password: {
      type: STRING,
      allowNull: false,
    },
    accountId: {
      type: INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'users',
    timestamps: false,
  },
);

Accounts.hasOne(Users, {
  foreignKey: 'accountId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Users.belongsTo(Accounts);

export default Users;
