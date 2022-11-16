import ILoginInfo from '../interfaces/ILoginInfo';
import UserModel from '../database/models/UserModel';
import AccountModel from '../database/models/AccountModel';
import ErrorUnauthorized from '../errors/ErrorUnauthorized';
import generateToken from '../utils/generateToken';
import bcrypt from 'bcryptjs';
import ErrorBadRequest from '../errors/ErrorBadRequest';

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

    const user = await UserModel.create({
      username,
      password: passwordHash,
    });
    if (!user) throw new ErrorBadRequest('Error to register user');

    const userId = user.getDataValue('id');
    await AccountModel.create({
      id: userId,
    })
  
    return generateToken({ username, userId });
  },
};

export default userService;
