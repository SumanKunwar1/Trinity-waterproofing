import express, { Request, Response } from 'express';
import routes from './routers'; 
import { handleResponse } from './middlewares';

const app = express();

app.use(express.json());

app.use('/api', routes);  

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, welcome to the Express + TypeScript app!');
});

export default app;