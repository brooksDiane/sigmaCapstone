import { Response, Request } from 'express';
import { users } from './dbConnection';
import { UserPostData, UserExtData } from './types';
import { ObjectId } from 'mongodb';

export async function signInHandler(req: Request, res: Response) {
  const authData = { email: req.body.email, password: req.body.password };
  const result = await users.findOne(authData);
  try {
    if (result) {
      res.json(newAuthResponse(true, null, result._id));
    } else {
      res.json(newAuthResponse(false, 'No such user exists', null));
    }
  } catch (error) {
    res.json(newAuthResponse(false, error, null));
  }
}

export async function signUpHandler(req: Request, res: Response) {
  const userData: UserPostData = req.body;

  try {
    const result = await users.insertOne(extendUserData(userData));
    if (result) {
      res.json(newAuthResponse(true, null, result.insertedId));
    }
  } catch (error) {
    res.json(newAuthResponse(false, error, null));
  }
}

function newAuthResponse(isSuccessful: boolean, error: any, _id: ObjectId | null) {
  let errorMsg = null;
  if (typeof error === 'string') {
    errorMsg = error;
  } else if (error instanceof Error) {
    errorMsg = error.message;
  }
  return { isSuccessful, errorMsg, _id };
}

function extendUserData(data: UserPostData) {
  const extendedData: UserExtData = {
    ...data,
    titles: {
      series: [],
      movies: [],
    },
  };
  return extendedData;
}
