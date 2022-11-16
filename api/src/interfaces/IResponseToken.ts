import { Response } from 'express';

export default interface IResponseToken extends Response {
  locals: {
    user: {
      username: string;
      userId: string
    };
  };
}
