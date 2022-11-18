import { Model } from 'sequelize';

export default interface IResponseAccount extends Model {
  id: number;
  balance: string;
}
