import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';  // Ensure CORS is imported
import routes from './routers';

const app = express();

declare global {
  namespace Express {
    interface Request {
      email?: string;
      role?: string;
    }
  }
}
// Middleware
app.use(express.json());
app.use(cors());
// Route handlers
app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, welcome to the Express + TypeScript app!');
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;
