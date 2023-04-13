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
    const filePath = __dirname + '\\..\\' + file.path;
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'image',
    });
    const coverData = {
      mimetype: file.mimetype,
      url: result.secure_url,
    };

    fs.unlinkSync(filePath);

    return coverData;
  } catch (error) {
    console.error(error);
  }
}

// // import fetch from 'node-fetch';

// async function uploadFile(req: Request) {
//   const file = req.file!;
//   const formData = new FormData();
//   // const blob = new Blob([file]);
//   formData.append('file', Buffer.from(file.buffer));
//   // const arrayBuffer: ArrayBuffer = file.buffer.slice(
//   //   file.byteOffset,
//   //   file.byteOffset + file.byteLength
//   // );
//   const result = await fetch('https://pixeldrain.com/api/file/' + file.filename, {
//     method: 'PUT',
//     body: JSON.stringify(formData),
//   });
//   console.log(result);
//   return result;
// }

// async function uploadFile(req: Request) {
//   const file: Blob = req.file!;
//   let xhr = new XMLHttpRequest();
//   xhr.open(
//     'PUT',
//     'https://pixeldrain.com/api/file/' + encodeURIComponent(file.name),
//     true
//   );
//   xhr.onreadystatechange = () => {};
//   xhr.send(file);
// }
