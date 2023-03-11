import { Response, Request } from 'express';
import { users } from './dbConnection';

export async function signInHandler(req: Request, res: Response) {
  const details = { email: req.body.email, password: req.body.password };
  const result = await users.findOne(details);
  if (result) {
    res.json({ isSuccessful: true, errorMsg: null, _id: result._id });
  } else {
    res.json({ isSuccessful: false, errorMsg: 'No such user exists', _id: null });
  }
}
