import { Response } from 'express';

export default interface IResponseToken extends Response {
  locals: {
    user: {
      accountId: number;
      userId: number;
    };
  };
}
