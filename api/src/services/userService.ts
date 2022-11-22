import { Transaction } from 'sequelize';
import IInfoUser from '../interfaces/IInfoUser';
import UserModel from '../database/models/UserModel';
import AccountModel from '../database/models/AccountModel';
import generateToken from '../utils/generateToken';
import sequelize from '../database/models';
import IUserCreated from '../interfaces/IUserCreated';
import ErrorInternalServer from '../errors/ErrorInternalServer';
import ErrorBadRequest from '../errors/ErrorBadRequest';
import ErrorNotFound from '../errors/ErrorNotFound';
import { compare, hashPassword } from '../utils/hashPassword';
import ICreateUser from '../interfaces/ICreateUser';
import ErrorUnauthorized from '../errors/ErrorUnauthorized';

const userService = {
  login: async ({ username, password }: IInfoUser): Promise<string> => {
    if (!username || !password) {
      throw new ErrorBadRequest('username and password is required');
    }
    const userDb = await UserModel.findOne({
      where: {
        username,
      },
    });

    if (!userDb) throw new ErrorNotFound('Incorrect username');

    const userDbPassword = userDb.getDataValue('password');
    const userId = userDb.getDataValue('id');

    const validPassword = compare(password, userDbPassword);
    if (!validPassword) throw new ErrorUnauthorized('Incorrect password');

    return generateToken({ userId });
  },

  findUser: async (userId: string): Promise<string | null> => {
    const user = await UserModel.findByPk(userId);
    const username = user?.getDataValue('username');
    return username;
  },

  createAccount: async (t: Transaction): Promise<number> => {
    const account = await AccountModel.create({ balance: 100 }, { transaction: t });
    const accountId = account.getDataValue('id');
    return accountId;
  },

  createUser: async ({
    userToRegister,
    accountId,
    t,
  }: ICreateUser): Promise<IUserCreated> => {
    const hashedPassword = hashPassword(userToRegister.password);
    const user = await UserModel.create(
      {
        username: userToRegister.username,
        password: hashedPassword,
        accountId,
      },
      { transaction: t },
    );
    return user;
  },

  register: async (userToRegister: IInfoUser): Promise<string> => {
    try {
      const { dataValues } = await sequelize.transaction(async (t) => {
        const accountId = await userService.createAccount(t);
        const userCreated = await userService.createUser({
          userToRegister,
          accountId,
          t,
        });
        return userCreated;
      });

      const { id } = dataValues;

      const token = await generateToken({ userId: id });
      return token;
    } catch (error) {
      throw new ErrorInternalServer('Error to register user');
    }
  },
};

export default userService;
