import express, { Request, Response, NextFunction } from "express";
import cors from "cors"; // Ensure CORS is imported
import routes from "./routers";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());

declare global {
  namespace Express {
    interface Request {
      email: string;
      role: string;
    }
  }
}
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
// Route handlers
app.use("/api", routes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, welcome to the Express + TypeScript app!");
});

// 404 Catch-All Route for Undefined Routes
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Route ${req.originalUrl} not found`) as any;
  error.statusCode = 404;
  next(error); // Pass error to the error handling middleware
});

export default app;
