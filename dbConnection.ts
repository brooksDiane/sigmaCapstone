import { MongoClient } from 'mongodb';
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
