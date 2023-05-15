import { Response, Request } from 'express';
import { users, movies } from '../dbConnection';
import { Movie } from '../types';
import { ObjectId } from 'mongodb';

export async function addMovieHandler(req: Request, res: Response) {
  console.log('Step 2: got the data');

  const uploadResult = await uploadFile(req);

  console.log('Step 3: Uploaded the file');

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
  console.log('Step 4: updated the db');
  res.json({ successful: true, _id: insertResult.insertedId, ...updateResult });
}

async function uploadFile(req: Request) {
  try {
    const file = req.file!;
    const metadata = {
      mimetype: file.mimetype,
      size: file.size,
      url: 'video/' + file.filename,
    };
    return metadata;
  } catch (error) {
    console.error(error);
  }
}

export async function addCoverHandler(req: Request, res: Response) {
  console.log('Step 7: Got cover request');
  const coverData = await uploadCover(req);
  console.log('Step 8: Uploaded cover', coverData);

  const updateResult = await movies.updateOne(
    { _id: new ObjectId(req.params.titleId) },
    {
      $set: {
        cover: coverData,
      },
    }
  );

  console.log('step 9: Updated db for cover');
  res.json(updateResult);
}

async function uploadCover(req: Request) {
  try {
    const file = req.file!;
    const coverData = {
      mimetype: file.mimetype,
      url: 'cover/' + file.filename,
    };

    return coverData;
  } catch (error) {
    console.error(error);
  }
}