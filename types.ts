import { ObjectIdLike } from 'bson';

/**
 * Data the client sends on user
 */
export interface UserPostData {
  firstname: string;
  lastname?: string;
  email: string;
  password: string;
}

/**
 * Extended user data with specific title arrays
 */
export interface UserExtData extends UserPostData {
  titles: {
    series: ObjectIdLike[];
    movies: ObjectIdLike[];
  };
}

/**
 * User document from database
 */
export interface UserDocument extends UserExtData {
  _id: ObjectIdLike;
}

interface Title {
  title: string;
}

export interface Movie extends Title {}

export interface Series extends Title {}
