export default interface IUserCreated {
  dataValues: {
    id: number;
    username: string;
    password: string;
    accountId: number;
  };
}
