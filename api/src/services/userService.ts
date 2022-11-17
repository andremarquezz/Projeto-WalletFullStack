import ILoginInfo from '../interfaces/ILoginInfo';
import UserModel from '../database/models/UserModel';
import AccountModel from '../database/models/AccountModel';
import ErrorUnauthorized from '../errors/ErrorUnauthorized';
import generateToken from '../utils/generateToken';
import bcrypt from 'bcryptjs';
import sequelize from '../database/models';
import IUserCreated from '../interfaces/IUserCreated';
import ErrorInternalServer from '../errors/ErrorInternalServer';
import ErrorBadRequest from '../errors/ErrorBadRequest';

const userService = {
  login: async ({ username, password }: ILoginInfo): Promise<string> => {
    const userDb = await UserModel.findOne({
      where: {
        username,
      },
    });

    if (!userDb) throw new ErrorBadRequest('Incorrect username');

    const userDbPassword = userDb.getDataValue('password');
    const userId = userDb.getDataValue('id');
    const accountId = userDb.getDataValue('accountId');

    const validPassword = bcrypt.compareSync(password, userDbPassword);
    if (!validPassword) throw new ErrorUnauthorized('Incorrect password');

    return generateToken({ accountId, userId });
  },

  register: async ({ username, password }: ILoginInfo): Promise<string> => {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    try {
      const { dataValues } = await sequelize.transaction(async (t) => {
        const account = await AccountModel.create({ balance: 100 }, { transaction: t });
        const accountId = account.getDataValue('id');

        const user: IUserCreated = await UserModel.create(
          {
            username,
            password: passwordHash,
            accountId,
          },
          { transaction: t }
        );
        return user;
      });

      const {accountId, id} = dataValues;

      return generateToken({ accountId, userId: id });
    } catch (error) {
      throw new ErrorInternalServer('Error to register user');
    }
  },
};

export default userService;
