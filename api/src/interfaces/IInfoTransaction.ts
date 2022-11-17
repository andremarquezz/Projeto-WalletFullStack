export default interface IInfoTransaction {
  userCashIn: string;
  value: number;
  user: {
    accountId: number;
    userId: number;
  };
}