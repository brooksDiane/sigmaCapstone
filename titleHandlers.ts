import { Response, Request } from 'express';
import { users, series, movies } from './dbConnection';
import { Movie, Series, UserDocument } from './types';
import { ObjectId } from 'mongodb';

export async function getSeriesHandler(req: Request, res: Response) {
  const user = await findUserById(req.params.id);
  if (user === null) {
    res.json(null);
  } else {
    const seriesArray = await findSeriesArray(user);
    res.json(seriesArray);
  }
}

export async function getMoviesHandler(req: Request, res: Response) {
  const user = await findUserById(req.params.id);
  if (user === null) {
    res.json(null);
  } else {
    const moviesArray = await findMoviesArray(user);
    res.json(moviesArray);
  }
}

export async function getTitlesHandler(req: Request, res: Response) {
  const user = await findUserById(req.params.id);
  if (user === null) {
    res.json(null);
  } else {
    const titles = {
      series: await findSeriesArray(user),
      movies: await findMoviesArray(user),
    };
    res.json(titles);
  }
}

export async function addMovieHandler(req: Request, res: Response) {
  const newMovie: Movie = req.body;
  const insertResult = await movies.insertOne(newMovie);
  const updateResult = await users.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $push: { 'titles.movies': insertResult.insertedId } }
  );
  res.json(updateResult);
}

export async function addSeriesHandler(req: Request, res: Response) {
  const newSeries: Series = req.body;
  const insertResult = await series.insertOne(newSeries);
  const updateResult = await users.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $push: { 'titles.series': insertResult.insertedId } }
  );
  res.json(updateResult);
}

async function findUserById(id: string) {
  const query = { _id: new ObjectId(id) };
  const user = await users.findOne<UserDocument>(query);
  return user;
}

async function findSeriesArray(user: UserDocument) {
  const seriesArray = [];
  for (const seriesId of user.titles.series) {
    const returnedSeries = await series.findOne<Series>({
      _id: new ObjectId(seriesId),
    });
    if (returnedSeries !== null) {
      seriesArray.push(returnedSeries.title);
    }
  }
  return seriesArray;
}

async function findMoviesArray(user: UserDocument) {
  const moviesArray = [];
  for (const movieId of user.titles.movies) {
    const returnedMovie = await movies.findOne<Movie>({
      _id: new ObjectId(movieId),
    });
    if (returnedMovie !== null) {
      moviesArray.push(returnedMovie.title);
    }
  }
  return moviesArray;
}
