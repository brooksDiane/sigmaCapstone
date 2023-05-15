import { Response, Request } from 'express';
import { movies, findUserById } from '../dbConnection';
import { Movie, UserDocument } from '../types';
import { ObjectId } from 'mongodb';


export async function getMoviesHandler(req: Request, res: Response) {
  const user = await findUserById(req.params.userId);
  if (user === null) {
    res.json({ error: 'No such user exists | Wrong user ID' });
  } else {
    const moviesArray = await findMoviesArray(user);
    res.json(moviesArray);
  }
}


async function findMoviesArray(user: UserDocument) {
  const moviesArray = [];
  for (const movieId of user.titles.movies) {
    const returnedMovie = await movies.findOne<Movie>({
      _id: new ObjectId(movieId),
    });
    if (returnedMovie !== null) {
      console.log(returnedMovie);
      moviesArray.push({
        id: movieId,
        title: returnedMovie.title,
        genres: returnedMovie.genres,
        year: returnedMovie.year,
        size: returnedMovie.size,
        cover: returnedMovie.cover
      });
    }
  }
  return moviesArray;
}

export async function getMovieHandler(req: Request, res: Response) {
  const user = await findUserById(req.params.userId);
  if (user === null) {
    res.json({ error: 'No such user exists | Wrong user ID' });
  } else {
    console.log(req.params);
    const returnedMovie = await movies.findOne({ _id: new ObjectId(req.params.titleId) });
    if (returnedMovie !== null) {
      res.json({
        id: req.params.titleId,
        title: returnedMovie.title,
        genres: returnedMovie.genres,
        year: returnedMovie.year,
        size: returnedMovie.size,
        cover: returnedMovie.cover,
        mimetype: returnedMovie.mimetype,
        url: returnedMovie.url,
      });
    } else {
      res.json({ error: 'No such title exists | Wrong title ID' });
    }
  }
}

export async function getVideo(req: Request, res: Response) {
  res.sendFile('E:/Works/Capstone Project/Code/server/files/' + req.params.videoName);
}

export async function getCover(req: Request, res: Response) {
  res.sendFile('E:/Works/Capstone Project/Code/server/files/' + req.params.coverName);
}