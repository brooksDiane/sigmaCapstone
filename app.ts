import express, { Express, Response, Request } from 'express';
import dotenv from 'dotenv';
import { connectToDb } from './dbConnection';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

connectToDb();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
