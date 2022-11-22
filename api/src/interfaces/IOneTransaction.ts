import IUserId from './IUserId';

export default interface IOneTransaction {
  user: { userId: number };
  id: string;
}
