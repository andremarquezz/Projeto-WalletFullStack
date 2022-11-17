import bcrypt from 'bcryptjs';

export const hashPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};

export const compare = (password: string, userDbPassword: string): Boolean => {
  return bcrypt.compareSync(password, userDbPassword);
};
