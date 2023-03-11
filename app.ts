import express, { Express, Response, Request } from 'express';
import dotenv from 'dotenv';
import { connectToDb } from './dbConnection';
// const cors = require('cors');

import { signInHandler } from './handlers';

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

app.listen(port, () => {
  console.log(`[server] Server is running at http://localhost:${port}`);
});
