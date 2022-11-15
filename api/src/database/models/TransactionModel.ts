import { Model, INTEGER, DATE } from 'sequelize';

import db from '.';
import Accounts from './AccountModel';

class Transactions extends Model {
  id!: number;
  debitedAccountId!: number;
  creditedAccountId!: number;
  value!: number;
  createdAt!: Date;
}

Transactions.init(
  {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    debitedAccountId: {
      type: INTEGER,
      allowNull: false,
    },
    creditedAccountId: {
      type: INTEGER,
      allowNull: false,
    },
    value: {
      type: INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DATE,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'transactions',
    timestamps: false,
  }
);

Transactions.hasMany(Accounts, {
  foreignKey: 'debitedAccountId',
});
Transactions.hasMany(Accounts, {
  foreignKey: 'creditedAccountId',
});
Accounts.belongsTo(Transactions);

export default Transactions;
