import ILoginInfo from '../interfaces/ILoginInfo';
import UserModel from '../database/models/UserModel';
import AccountModel from '../database/models/AccountModel';
import ErrorUnauthorized from '../errors/ErrorUnauthorized';
import generateToken from '../utils/generateToken';
import bcrypt from 'bcryptjs';
import ErrorBadRequest from '../errors/ErrorBadRequest';
import sequelize from '../database/models';
import IUserCreated from '../interfaces/IUserCreated';

const userService = {
  login: async ({ username, password }: ILoginInfo): Promise<string> => {
    const userDb = await UserModel.findOne({
      where: {
        username,
      },
    });

    if (!userDb) throw new ErrorUnauthorized('Incorrect username');

    const userDbPassword = userDb.getDataValue('password');
    const userId = userDb.getDataValue('id');

    const validPassword = bcrypt.compareSync(password, userDbPassword);
    if (!validPassword) throw new ErrorUnauthorized('Incorrect password');

    return generateToken({ username, userId });
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

      return generateToken({ username, userId: dataValues.id });
    } catch (error) {
      throw new ErrorBadRequest('Error to register user');
    }
  },
};

export default userService;
