import { Response, Request } from 'express';
import { users, series, movies, findUserById } from '../dbConnection';
import { Movie, Series, UserDocument } from '../types';
import { ObjectId } from 'mongodb';

export async function getSeriesHandler(req: Request, res: Response) {
  const user = await findUserById(req.params.userId);
  if (user === null) {
    res.json({ error: 'No such user exists | Wrong user ID' });
  } else {
    const seriesArray = await findSeriesArray(user);
    res.json(seriesArray);
  }
}

export async function getMoviesHandler(req: Request, res: Response) {
  const user = await findUserById(req.params.userId);
  if (user === null) {
    res.json({ error: 'No such user exists | Wrong user ID' });
  } else {
    const moviesArray = await findMoviesArray(user);
    res.json(moviesArray);
  }
}

export async function getTitlesHandler(req: Request, res: Response) {
  const user = await findUserById(req.params.userId);
  if (user === null) {
    res.json({ error: 'No such user exists | Wrong user ID' });
  } else {
    const titles = {
      series: await findSeriesArray(user),
      movies: await findMoviesArray(user),
    };
    res.json(titles);
  }
}

async function findSeriesArray(user: UserDocument) {
  const seriesArray = [];
  for (const seriesId of user.titles.series) {
    const returnedSeries = await series.findOne<Series>({
      _id: new ObjectId(seriesId),
    });
    if (returnedSeries !== null) {
      seriesArray.push({
        id: seriesId,
        title: returnedSeries.title,
      });
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
      moviesArray.push({
        id: movieId,
        title: returnedMovie.title,
      });
    }
  }
  return moviesArray;
}

export async function getOneMovie(req: Request, res: Response) {
  const user = await findUserById(req.params.userId);
  if (user === null) {
    res.json({ error: 'No such user exists | Wrong user ID' });
  } else {
    console.log(req.params);
    const result = await movies.findOne({ _id: new ObjectId(req.params.titleId) });
    res.json(result);
  }
}

export async function getOneSeries(req: Request, res: Response) {}
