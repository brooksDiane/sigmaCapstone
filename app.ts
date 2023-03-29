import express, { Express, Response, Request } from 'express';
import dotenv from 'dotenv';
import { connectToDb } from './dbConnection';

import { signInHandler, signUpHandler } from './authHandlers';
import {
  addMovieHandler,
  addSeriesHandler,
  getMoviesHandler,
  getSeriesHandler,
  getTitlesHandler,
} from './titleHandlers';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

connectToDb();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.post('/sign-in', signInHandler);

app.post('/sign-up', signUpHandler);

app.get('/get-series/:id', getSeriesHandler);
app.get('/get-movies/:id', getMoviesHandler);
app.get('/get-titles/:id', getTitlesHandler);

app.post('/add-series/:id', addSeriesHandler);
app.post('/add-movie/:id', addMovieHandler);

app.listen(port, () => {
  console.log(`[server] Server is running at http://localhost:${port}`);
});
