import express, { Express, Response, Request } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectToDb } from './dbConnection';

import { signInHandler, signUpHandler } from './handlers/authHandlers';
import {
  getMoviesHandler,
  getSeriesHandler,
  getTitlesHandler,
  getMovieHandler,
  getOneSeries,
  getVideo,
  getCover,
} from './handlers/getTitleHandlers';
import {
  addCoverHandler,
  addEpisodeHandler,
  addMovieHandler,
  addSeriesHandler,
} from './handlers/addTitleHandlers';

import path from 'path';
import multer from 'multer';

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'files/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// var storage = multer.memoryStorage();

var upload = multer({ storage: storage });

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

connectToDb();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.post('/sign-in', signInHandler);

app.post('/sign-up', signUpHandler);

app.get('/get-series/:userId', getSeriesHandler);
app.get('/get-movies/:userId', getMoviesHandler);
app.get('/get-titles/:userId', getTitlesHandler);

app.get('/series/:userId/:titleId', getOneSeries);
app.get('/movie/:userId/:titleId', getMovieHandler);

app.post('/add-series/:userId', addSeriesHandler);
app.post('/add-series/:userId/episode', upload.single('file'), addEpisodeHandler);
app.post('/add-movie/:userId', upload.single('file'), addMovieHandler);
app.put('/add-cover/:titleId', upload.single('file'), addCoverHandler);

app.get('/video/:videoName', getVideo);
app.get('/cover/:coverName', getCover);

app.listen(port, () => {
  console.log(`[server] Server is running at http://localhost:${port}`);
});
