import ILoginInfo from '../interfaces/ILoginInfo';
import UserModel from '../database/models/UserModel';
import AccountModel from '../database/models/AccountModel';
import generateToken from '../utils/generateToken';
import sequelize from '../database/models';
import IUserCreated from '../interfaces/IUserCreated';
import ErrorInternalServer from '../errors/ErrorInternalServer';
import ErrorBadRequest from '../errors/ErrorBadRequest';
import ErrorNotFound from '../errors/ErrorNotFound';
import { compare, hashPassword } from '../utils/hashPassword';

const userService = {
  login: async ({ username, password }: ILoginInfo): Promise<string> => {
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
    if (!validPassword) throw new ErrorBadRequest('Incorrect password');

    return generateToken({ userId });
  },

  register: async ({ username, password }: ILoginInfo): Promise<string> => {
    const hashedPassword = hashPassword(password);
    try {
      const { dataValues } = await sequelize.transaction(async (t) => {
        const account = await AccountModel.create({ balance: 100 }, { transaction: t });
        const accountId = account.getDataValue('id');

        const user: IUserCreated = await UserModel.create(
          {
            username,
            password: hashedPassword,
            accountId,
          },
          { transaction: t },
        );
        return user;
      });

      const { id } = dataValues;

      return await generateToken({ userId: id });
    } catch (error) {
      throw new ErrorInternalServer('Error to register user');
    }
  },
};

export default userService;
