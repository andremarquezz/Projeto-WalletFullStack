export default interface ITransaction {
  userCashIn: string;
  value: number;
  user: {
    accountId: number;
    userId: number;
  };
}