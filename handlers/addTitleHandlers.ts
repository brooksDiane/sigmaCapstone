import { Response, Request } from 'express';
import { users, series, movies } from '../dbConnection';
import { Movie, Series, Episode } from '../types';
import { ObjectId } from 'mongodb';
import fs from 'fs';

import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
  secure: true,
});

export async function addSeriesHandler(req: Request, res: Response) {
  const newSeries: Series = req.body;
  const insertResult = await series.insertOne(newSeries);
  const updateResult = await users.updateOne(
    { _id: new ObjectId(req.params.userId) },
    { $push: { 'titles.series': insertResult.insertedId } }
  );
  res.json(updateResult);
}

export async function addEpisodeHandler(req: Request, res: Response) {
  const newSeries: Series = req.body;
  const insertResult = await series.insertOne(newSeries);
  const updateResult = await users.updateOne(
    { _id: new ObjectId(req.params.userId) },
    { $push: { 'titles.series': insertResult.insertedId } }
  );
  res.json(updateResult);
}

export async function addMovieHandler(req: Request, res: Response) {
  console.log('yay');

  const uploadResult = await uploadFile(req);

  const newMovie: Movie = {
    ...req.body,
    ...uploadResult,
  };
  console.log(newMovie);

  const insertResult = await movies.insertOne(newMovie);
  const updateResult = await users.updateOne(
    { _id: new ObjectId(req.params.userId) },
    { $push: { 'titles.movies': insertResult.insertedId } }
  );
  res.json(updateResult);
}

async function uploadFile(req: Request) {
  try {
    const file = req.file!;
    const filePath = __dirname + '\\..\\' + file.path;
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'video',
    });
    const metadata = {
      mimetype: file.mimetype,
      format: result.format,
      size: result.bytes,
      url: result.secure_url,
    };

    fs.unlinkSync(filePath);

    return metadata;
  } catch (error) {
    console.error(error);
  }
}
