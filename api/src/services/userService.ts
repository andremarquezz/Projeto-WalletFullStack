import ILoginInfo from "../interfaces/ILoginInfo"
import UserModel  from "../database/models/UserModel";
import ErrorUnauthorized from "../errors/ErrorUnauthorized";
import * as jwt from 'jsonwebtoken';
import generateToken from "../utils/generateToken";

const { JWT_SECRET } = process.env;

const userService = {
login: async ({ username, password }: ILoginInfo): Promise<string> => {
     const userDb = await UserModel.findOne({
      where: {
        username
      },
    });

    if (userDb) {
      const userDbPassword = userDb.getDataValue('password');
      const userId = userDb.getDataValue('id');
      try {
        const verify = jwt.verify(userDbPassword, JWT_SECRET as string);
        if (verify !== password) {
          throw new ErrorUnauthorized('Password is incorrect');
        }
        return generateToken({ username, userId });
      } catch (error) {
        throw new ErrorUnauthorized('Token must be a valid token');
      }
    }
    throw new ErrorUnauthorized('Incorrect username or password');
  }

  
}

export default userService