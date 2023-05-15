import { MongoClient, ObjectId } from 'mongodb';
import { UserDocument } from './types';
import dotenv from 'dotenv';

dotenv.config();

export const client = new MongoClient(process.env.uri!);
export async function connectToDb() {
  try {
    await client.connect();
  } catch (e) {
    console.error(e);
  }
}

const db = client.db('solibra');
export const users = db.collection('users');
export const movies = db.collection('movies');

export async function findUserById(id: string) {
  const query = { _id: new ObjectId(id) };
  const user = await users.findOne<UserDocument>(query);
  return user;
}
