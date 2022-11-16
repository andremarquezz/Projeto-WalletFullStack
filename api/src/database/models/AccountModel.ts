import { Model, INTEGER, DECIMAL } from 'sequelize';

import db from '.';

class Accounts extends Model {
  id!: number;

  balance!: string;

}

Accounts.init(
  {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    balance: {
      type: DECIMAL(10, 2),
      defaultValue: 100,
    },
  },
  {
    sequelize: db,
    modelName: 'accounts',
    timestamps: false,
  }
);
export default Accounts;
