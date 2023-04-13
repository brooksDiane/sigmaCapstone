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
  genres: string[];
  year: number;
  duration: number;
}

interface VideoFile {
  size: number;
  format: string;
  url: string;
  mimetype: string;
}

export interface Movie extends Title, VideoFile {}

export interface Series extends Title {}

export interface Episode extends VideoFile {
  seasonNum: number;
  episodeNum: number;
}
